"use client";

import { useEffect, useRef } from "react";
import type { ProjectItem } from "@/data/portfolioData";

/**
 * A corridor of project screenshots that the page scroll glides through.
 *
 * Each project is a station: its cover hangs large on one wall, up to two
 * more screens from it on the opposite wall, walls alternating station to
 * station. Hairline grids run along floor and ceiling, a few accent tiles sit
 * in the cells, and fog melts everything into the page background.
 *
 * The camera's place in the corridor comes from how far the reader has
 * scrolled through `section` (it is pinned for the trip): it starts outside
 * the mouth while the section slides in and ends as the fog closes over the
 * far end, so the next section rises out of plain background. Pointer moves
 * turn the view a little; speed adds a radial blur. A click on a cover opens
 * that project.
 */

const S = 7; // corridor length per project
const MOUTH = 3; // corridor before the first station
const TAIL = 8; // corridor after the last one, up to the end wall with the exit

/**
 * The exit (a doorway in the end wall, drawn by the page over the canvas)
 * starts at this share of the screen. The page scales it as
 * 1 / (1 / EXIT_START - a * (1 / EXIT_START - 1)) for approach a in 0..1, and
 * the camera closes in on the end wall by the same law, so the two agree.
 */
export const EXIT_START = 0.12;
const CELL = 1.4; // grid spacing along the corridor
const LANES = 5;

const texture = (src: string, w: number) =>
  src.startsWith("http") ? src : `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75`;

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const BLUR_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;
const BLUR_FRAG = /* glsl */ `
  uniform sampler2D tScene;
  uniform float uAmount;
  varying vec2 vUv;
  void main() {
    vec2 dir = vUv - 0.5;
    vec4 sum = vec4(0.0);
    float total = 0.0;
    for (int i = 0; i < 10; i++) {
      float t = float(i) / 9.0;
      float w = 1.0 - t * 0.6;
      sum += texture2D(tScene, vUv - dir * t * uAmount * 0.09) * w;
      total += w;
    }
    gl_FragColor = sum / total;
    #include <colorspace_fragment>
  }
`;

export function PassageTunnel({
  projects,
  section,
  tripEnd = 1,
  approachEnd = 1,
  onActive,
  onOpen,
}: {
  projects: ProjectItem[];
  section: React.RefObject<HTMLElement | null>;
  /** Share of the section's pinned scroll spent travelling the corridor. */
  tripEnd?: number;
  /** Where the approach to the exit (the next section) is complete. */
  approachEnd?: number;
  onActive: (i: number) => void;
  onOpen: (i: number) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const cb = useRef({ onActive, onOpen });
  cb.current = { onActive, onOpen };

  useEffect(() => {
    const el = host.current;
    if (!el || projects.length === 0) return;
    let disposed = false;
    let cleanup = () => {};

    import("three").then((THREE) => {
      if (disposed) return;
      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      } catch {
        return;
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      renderer.setPixelRatio(dpr);
      el.appendChild(renderer.domElement);

      const N = projects.length;
      const LENGTH = MOUTH + N * S + TAIL;
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      const W = mobile ? 4.4 : 6.4; // corridor width
      const H = mobile ? 4.2 : 3.8; // and height
      // Panels turn toward the oncoming camera so they read at speed; more on
      // a narrow screen, where the walls are seen at a steeper angle.
      const TURN = mobile ? 0.62 : 0.42;

      const scene = new THREE.Scene();
      const bg = new THREE.Color("#0b0b0c");
      scene.fog = new THREE.Fog(bg, 1, 30);

      const camera = new THREE.PerspectiveCamera(mobile ? 78 : 66, 1, 0.05, 80);
      const loader = new THREE.TextureLoader();
      const disposables: { dispose: () => void }[] = [];

      // --- Grid: floor and ceiling lanes, cross lines, corner rails ---------
      const pts: number[] = [];
      for (const y of [-H / 2, H / 2]) {
        for (let k = 0; k <= LANES; k++) {
          const x = -W / 2 + (k / LANES) * W;
          pts.push(x, y, 2, x, y, -LENGTH);
        }
        for (let z = 2; z >= -LENGTH; z -= CELL) pts.push(-W / 2, y, z, W / 2, y, z);
      }
      for (const x of [-W / 2, W / 2]) {
        for (let z = 2; z >= -LENGTH; z -= CELL) pts.push(x, -H / 2, z, x, H / 2, z);
      }
      const gridGeo = new THREE.BufferGeometry();
      gridGeo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
      const gridMat = new THREE.LineBasicMaterial({ color: "#85857f", transparent: true, opacity: 0.22, fog: true });
      scene.add(new THREE.LineSegments(gridGeo, gridMat));
      disposables.push(gridGeo, gridMat);

      // --- Accent tiles: a few warm cells on floor and ceiling --------------
      const glowCanvas = document.createElement("canvas");
      glowCanvas.width = glowCanvas.height = 64;
      const accentTex = new THREE.CanvasTexture(glowCanvas);
      const paintAccent = (color: string) => {
        const g = glowCanvas.getContext("2d")!;
        g.clearRect(0, 0, 64, 64);
        const grad = g.createLinearGradient(0, 0, 64, 64);
        grad.addColorStop(0, color);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        g.fillStyle = grad;
        g.fillRect(0, 0, 64, 64);
        accentTex.needsUpdate = true;
      };
      const accentMat = new THREE.MeshBasicMaterial({ map: accentTex, transparent: true, fog: true, depthWrite: false });
      const cellW = W / LANES;
      const tileGeo = new THREE.PlaneGeometry(cellW * 0.8, CELL * 0.8);
      let seed = 7;
      const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      for (let z = -MOUTH; z > -LENGTH + TAIL; z -= CELL) {
        if (rand() > 0.16) continue;
        const lane = Math.floor(rand() * LANES);
        const ceiling = rand() > 0.5;
        const tile = new THREE.Mesh(tileGeo, accentMat);
        tile.rotation.x = ceiling ? Math.PI / 2 : -Math.PI / 2;
        tile.position.set(-W / 2 + (lane + 0.5) * cellW, ceiling ? H / 2 - 0.01 : -H / 2 + 0.01, z - CELL / 2);
        scene.add(tile);
      }
      disposables.push(tileGeo, accentMat, accentTex);

      // --- Screens -----------------------------------------------------------
      type Screen = { mesh: import("three").Mesh; mat: import("three").MeshBasicMaterial; project: number; main: boolean };
      const screens: Screen[] = [];
      const frameMat = new THREE.LineBasicMaterial({ color: "#85857f", transparent: true, opacity: 0.5, fog: true });
      disposables.push(frameMat);

      const addScreen = (src: string, w: number, h: number, side: number, y: number, z: number, project: number, main: boolean) => {
        const geo = new THREE.PlaneGeometry(w, h);
        const mat = new THREE.MeshBasicMaterial({ color: "#1c1c1f", fog: true, toneMapped: false });
        const mesh = new THREE.Mesh(geo, mat);
        // On the wall, facing across the corridor, then turned toward the camera.
        mesh.position.set(side * (W / 2 - 0.02 - Math.sin(TURN) * w * 0.5), y, z);
        mesh.rotation.y = side * (-Math.PI / 2 + TURN);
        const frame = new THREE.LineSegments(new THREE.EdgesGeometry(geo), frameMat);
        mesh.add(frame);
        scene.add(mesh);
        loader.load(texture(src, main ? 1200 : 828), (tex) => {
          if (disposed) return tex.dispose();
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
          mat.map = tex;
          mat.color.set(main ? "#ffffff" : "#d8d8d8");
          mat.needsUpdate = true;
          disposables.push(tex);
        });
        screens.push({ mesh, mat, project, main });
        disposables.push(geo, frame.geometry);
      };

      const stationZ = (i: number) => -(MOUTH + (i + 0.5) * S);
      const mainW = mobile ? 2.6 : 3.2;
      const sideW = mobile ? 1.5 : 1.8;
      projects.forEach((p, i) => {
        const shots = p.shots?.length ? p.shots : [];
        if (shots.length === 0) return;
        const side = i % 2 === 0 ? -1 : 1;
        const z = stationZ(i);
        addScreen(shots[0], mainW, mainW / 1.6, side, 0.15, z, i, true);
        // Supporting screens across the corridor, a little further on.
        const rest = shots.slice(1, 3);
        rest.forEach((src, k) => {
          const y = rest.length === 1 ? 0.15 : k === 0 ? 0.62 : -0.5;
          addScreen(src, sideW, sideW / 1.6, -side, y, z - 1.4, i, false);
        });
      });

      // --- Post: radial speed blur -------------------------------------------
      const rt = new THREE.WebGLRenderTarget(2, 2, { samples: 4 });
      const blurMat = new THREE.ShaderMaterial({
        vertexShader: BLUR_VERT,
        fragmentShader: BLUR_FRAG,
        uniforms: { tScene: { value: rt.texture }, uAmount: { value: 0 } },
        depthTest: false,
        depthWrite: false,
      });
      const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), blurMat);
      const postScene = new THREE.Scene();
      postScene.add(quad);
      const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      disposables.push(rt, blurMat, quad.geometry);

      const resize = () => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        rt.setSize(Math.round(w * dpr), Math.round(h * dpr));
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      // --- Theme ---------------------------------------------------------------
      const readTheme = () => {
        const cs = getComputedStyle(document.documentElement);
        bg.set(cs.getPropertyValue("--bg").trim() || "#0b0b0c");
        (scene.fog as import("three").Fog).color.copy(bg);
        renderer.setClearColor(bg, 1);
        const line = cs.getPropertyValue("--fg-3").trim() || "#85857f";
        gridMat.color.set(line);
        frameMat.color.set(line);
        paintAccent(cs.getPropertyValue("--accent").trim() || "#ff4d2e");
      };
      readTheme();
      const themeObserver = new MutationObserver(readTheme);
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      const scheme = window.matchMedia("(prefers-color-scheme: light)");
      scheme.addEventListener("change", readTheme);

      // --- Pointer: look, hover, click a cover ----------------------------------
      const ndc = new THREE.Vector2(0, 0);
      const look = new THREE.Vector2(0, 0);
      const raycaster = new THREE.Raycaster();
      let hovered = -1;
      let down: { x: number; y: number } | null = null;
      const mains = () => screens.filter((s) => s.main).map((s) => s.mesh);
      const pick = () => {
        raycaster.setFromCamera(ndc, camera);
        const hit = raycaster.intersectObjects(mains(), false)[0];
        if (!hit) return -1;
        return screens.find((s) => s.mesh === hit.object)?.project ?? -1;
      };
      const setNdc = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      };
      const onMove = (e: PointerEvent) => {
        setNdc(e);
        if (e.pointerType === "mouse") {
          hovered = pick();
          el.style.cursor = hovered >= 0 ? "pointer" : "";
        }
      };
      const onDown = (e: PointerEvent) => {
        down = { x: e.clientX, y: e.clientY };
      };
      const onUp = (e: PointerEvent) => {
        if (!down) return;
        const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
        down = null;
        if (moved > 8) return;
        setNdc(e);
        const i = pick();
        if (i >= 0) cb.current.onOpen(i);
      };
      const onLeave = () => {
        hovered = -1;
        ndc.set(0, 0);
      };
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerdown", onDown);
      el.addEventListener("pointerup", onUp);
      el.addEventListener("pointerleave", onLeave);

      // --- Frame -----------------------------------------------------------------
      let camZ = 4;
      let lastZ = camZ;
      let active = -1;
      let visible = false;
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      io.observe(el);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const clock = new THREE.Clock();

      renderer.setAnimationLoop(() => {
        const dt = Math.min(clock.getDelta(), 0.05);
        if (!visible) return;
        const sec = section.current;
        if (!sec) return;

        // Where the reader is: sliding in, then through the pinned trip.
        const r = sec.getBoundingClientRect();
        const vh = window.innerHeight;
        const enter = Math.min(1, Math.max(0, 1 - r.top / vh));
        const whole = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
        const p = Math.min(1, whole / tripEnd);
        // Past the corridor: the camera keeps drifting toward the exit while
        // the next section grows in it; once that fills the screen, stop.
        const approach = Math.min(1, Math.max(0, (whole - tripEnd) / Math.max(1e-3, approachEnd - tripEnd)));
        if (approach >= 1) return;

        // Trip: from outside the mouth to just past the last station.
        // Approach: toward the end wall, distance shrinking as 1 / scale.
        const zStart = 3;
        const zTrip = stationZ(N - 1) - 2;
        const d0 = zTrip + LENGTH;
        const exitScale = 1 / (1 / EXIT_START - approach * (1 / EXIT_START - 1));
        const target =
          approach > 0
            ? -LENGTH + (d0 * EXIT_START) / exitScale
            : zStart + (zTrip - zStart) * p + (1 - enter) * 3;
        camZ += (target - camZ) * (reduce ? 1 : Math.min(1, dt * 7));
        const speed = Math.abs(camZ - lastZ) / Math.max(dt, 1e-3);
        lastZ = camZ;

        look.lerp(ndc, 0.05);
        camera.position.set(look.x * 0.35, look.y * 0.18, camZ);
        camera.rotation.set(look.y * 0.12, -look.x * 0.22, 0);

        // Fog opens as the section arrives and closes over the far end.
        const fog = scene.fog as import("three").Fog;
        fog.near = 1;
        fog.far = 4 + 26 * smooth(0.15, 1, enter);

        // Which project is being passed, judged a little ahead of the camera.
        let best = 0;
        let bestD = Infinity;
        for (let i = 0; i < N; i++) {
          const d = Math.abs(camZ - 4 - stationZ(i));
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        }
        if (best !== active) {
          active = best;
          cb.current.onActive(best);
        }

        // The project being passed is lit; hovered covers lift.
        for (const s of screens) {
          const on = s.project === active;
          const want = s.main ? (s.project === hovered ? 1.1 : on ? 1 : 0.62) : on ? 0.92 : 0.5;
          const cur = (s.mesh.userData.k as number | undefined) ?? want;
          const next = cur + (want - cur) * Math.min(1, dt * 6);
          s.mesh.userData.k = next;
          if (s.mat.map) s.mat.color.setScalar(next);
          const lift = s.main && s.project === hovered ? 1.04 : 1;
          s.mesh.scale.setScalar(s.mesh.scale.x + (lift - s.mesh.scale.x) * Math.min(1, dt * 8));
        }

        blurMat.uniforms.uAmount.value = reduce ? 0 : Math.min(1, speed / 22);
        renderer.setRenderTarget(rt);
        renderer.render(scene, camera);
        renderer.setRenderTarget(null);
        renderer.render(postScene, postCam);
      });

      cleanup = () => {
        renderer.setAnimationLoop(null);
        io.disconnect();
        ro.disconnect();
        themeObserver.disconnect();
        scheme.removeEventListener("change", readTheme);
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerdown", onDown);
        el.removeEventListener("pointerup", onUp);
        el.removeEventListener("pointerleave", onLeave);
        screens.forEach((s) => s.mat.dispose());
        disposables.forEach((d) => d.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [projects, section, tripEnd, approachEnd]);

  return <div ref={host} aria-hidden className="absolute inset-0 touch-pan-y [&>canvas]:h-full [&>canvas]:w-full" />;
}
