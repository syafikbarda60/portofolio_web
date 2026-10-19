"use client";

import { useEffect, useRef } from "react";
import {
  branchShape,
  browserShape,
  chipShape,
  databaseShape,
  dustShape,
  groundShape,
  networkShape,
  pathShape,
  planeShape,
  signalShape,
  softwareShape,
  type Shape,
} from "@/components/three/shapes";
import { intro, LEAVE_MS, splashFrame, SPLASH_SHAPES } from "@/lib/intro";

/** Fired by the contact form when a message has actually been delivered. */
export const SENT_EVENT = "contact:sent";

/**
 * The page's narrator: one cloud of points, fixed behind the content, that
 * travels the whole scroll and takes a new shape at every chapter. Sections
 * say what they want with <StoryMark shape="..." />; the field reads where
 * those marks sit on the page and, as each one reaches the middle of the
 * screen, the cloud becomes that shape and moves to where that chapter
 * wants it. Between two marks it holds, then flies to the next one over a
 * short stretch of scroll, so it is never half-formed while being read.
 */

const BUILDERS = {
  dust: dustShape,
  ground: groundShape,
  code: softwareShape,
  chip: chipShape,
  net: networkShape,
  path: pathShape,
  browser: browserShape,
  database: databaseShape,
  signal: signalShape,
  branch: branchShape,
  plane: planeShape,
} as const;

export type StoryShape = keyof typeof BUILDERS;
const NAMES = Object.keys(BUILDERS) as StoryShape[];

// Where each shape sits on screen: x/y as a fraction of the viewport from its
// centre (+y up), s as the share of the viewport height two units span,
// o opacity, sway how far it rocks, spin whether it turns continuously.
type Look = { x: number; y: number; s: number; o: number; sway: number; spin: number };
const look = (x: number, y: number, s: number, o: number, sway = 0.42, spin = 0): Look => ({ x, y, s, o, sway, spin });

// Shapes that share a pinned chapter share a place on screen.
const STAGE_D = look(-0.06, -0.08, 0.7, 1);
const STAGE_M = look(0, 0.12, 0.42, 1);

// The loading intro: the cloud centred on the splash screen.
const SPLASH_LOOK = { d: look(0, 0.04, 0.8, 1, 0.5), m: look(0, 0.06, 0.52, 1, 0.5) };

const LOOKS: Record<StoryShape, { d: Look; m: Look }> = {
  dust: { d: look(0, 0, 0.8, 0, 0, 1), m: look(0, 0, 0.6, 0, 0, 1) },
  ground: { d: look(0, 0.26, 0.8, 0.55, 0.05), m: look(0, 0.15, 0.45, 0.45, 0.05) },
  code: { d: STAGE_D, m: STAGE_M },
  chip: { d: STAGE_D, m: STAGE_M },
  net: { d: STAGE_D, m: STAGE_M },
  path: { d: look(0, 0, 0.36, 0.85, 0.3), m: look(0, 0, 0.27, 0.7, 0.3) },
  browser: { d: STAGE_D, m: STAGE_M },
  database: { d: STAGE_D, m: STAGE_M },
  signal: { d: STAGE_D, m: STAGE_M },
  branch: { d: STAGE_D, m: STAGE_M },
  plane: { d: look(0, -0.02, 0.42, 1, 0.25), m: look(0, -0.01, 0.21, 0.95, 0.25) },
};

const VERTEX = /* glsl */ `
  uniform sampler2D uShapes;
  uniform sampler2D uFlows;
  uniform float uTexW;
  uniform float uTexH;
  uniform float uRows;
  uniform float uFrom;
  uniform float uTo;
  uniform float uMix;
  uniform float uTime;
  uniform float uSize;
  uniform float uCamZ;
  uniform vec2 uPointer;
  uniform float uPointerActive;

  attribute float aId;
  attribute vec3 aRand;

  varying float vAccent;
  varying float vAlpha;

  vec4 fetch(sampler2D tex, float shape) {
    float col = mod(aId, uTexW);
    float row = floor(aId / uTexW) + shape * uRows;
    return texture2D(tex, vec2((col + 0.5) / uTexW, (row + 0.5) / uTexH));
  }

  vec3 spinY(vec3 p, float a) {
    float c = cos(a), s = sin(a);
    return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
  }

  float pulse(float f) {
    if (f < 0.0) return 0.0;
    return smoothstep(0.12, 0.0, fract(f - uTime * 0.35));
  }

  void main() {
    vec4 a = fetch(uShapes, uFrom);
    vec4 b = fetch(uShapes, uTo);
    float fa = fetch(uFlows, uFrom).r;
    float fb = fetch(uFlows, uTo).r;

    // Per-point delay, so the change sweeps through the cloud.
    float r = aRand.x * 0.5 + 0.5;
    float t = smoothstep(0.0, 1.0, clamp(uMix * 1.7 - r * 0.7, 0.0, 1.0));

    vec3 p = mix(a.xyz, b.xyz, t);
    float flight = sin(t * 3.14159);
    p = spinY(p, flight * (0.9 + aRand.z * 0.8));
    p += aRand * flight * 0.3;
    p += aRand * 0.01 * sin(uTime * 1.4 + aRand.y * 20.0);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    vec2 ndc = gl_Position.xy / gl_Position.w;
    float heat = smoothstep(0.22, 0.0, distance(ndc, uPointer)) * uPointerActive;
    float live = mix(pulse(fa), pulse(fb), t) * (1.0 - flight);
    float depth = smoothstep(uCamZ + 1.4, uCamZ - 1.4, -mv.z);

    vAccent = clamp(mix(a.w, b.w, t) + heat + live, 0.0, 1.0);
    vAlpha = (0.42 + 0.58 * fract(aRand.y * 7.31)) * mix(0.35, 1.0, depth) * (1.0 - flight * 0.2) + live * 0.4;
    gl_PointSize = uSize * (0.7 + 0.6 * fract(aRand.z * 3.7)) * (1.0 + heat * 0.6 + live * 0.8) * (1.0 + vAccent * 0.9) * (uCamZ / -mv.z);
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uAccent;
  uniform float uOpacity;
  varying float vAccent;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    // Plain points are crisp dots; accent points glow, a soft halo around a
    // bright core, so the part of each shape that matters catches the eye.
    float core = smoothstep(0.5, 0.12, d);
    float halo = pow(smoothstep(0.5, 0.0, d), 2.0) * 0.8 + smoothstep(0.18, 0.0, d) * 0.6;
    float shapeA = mix(core, halo, vAccent);
    gl_FragColor = vec4(mix(uColor, uAccent, vAccent), shapeA * min(vAlpha, 1.0) * uOpacity);
  }
`;

// Chapters: a flight between different chapters fades out mid-way, so the
// cloud never crosses the copy in between; it dissolves and re-forms.
const CHAPTER: Record<StoryShape, string> = {
  dust: "hero", ground: "about", code: "focus", chip: "focus", net: "focus",
  path: "exp", browser: "skills", database: "skills", signal: "skills", branch: "skills", plane: "contact",
};
// Shapes that sit beside copy in a normal (unpinned) section: shown only
// while their mark is near mid-screen, so they never sit on the text below.
const LOCAL: Partial<Record<StoryShape, true>> = { ground: true, path: true, plane: true };

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * A chapter mark: where on the page the story field takes this shape.
 * With `stage`, the mark sits in the centre of the box it is placed in, and
 * the shape is drawn centred on that box: the layout reserves the room, so
 * the shape never lands on copy.
 */
export function StoryMark({ shape, at = "50%", stage = false }: { shape: StoryShape; at?: string; stage?: boolean }) {
  return (
    <span
      aria-hidden
      data-story={shape}
      data-stage={stage ? "" : undefined}
      className={`pointer-events-none absolute h-px w-px ${stage ? "left-1/2" : "left-0"}`}
      style={{ top: at }}
    />
  );
}

export function StoryField() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let disposed = false;
    let cleanup = () => {};

    import("three").then((THREE) => {
      if (disposed) return;
      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
      } catch {
        intro.setCloudReady(); // no WebGL: the splash should not wait for it
        return;
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      renderer.setPixelRatio(dpr);
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);

      // --- Every shape, baked into two float textures ------------------------
      const count = window.matchMedia("(max-width: 1023px)").matches ? 5600 : 9000;
      const TEX_W = 128;
      const ROWS = Math.ceil(count / TEX_W);
      const TEX_H = ROWS * NAMES.length;
      const shapeData = new Float32Array(TEX_W * TEX_H * 4);
      const flowData = new Float32Array(TEX_W * TEX_H * 4);
      NAMES.forEach((name, s) => {
        const shape: Shape = BUILDERS[name](count);
        for (let i = 0; i < count; i++) {
          const o = (s * ROWS * TEX_W + i) * 4;
          shapeData[o] = shape.pos[i * 3];
          shapeData[o + 1] = shape.pos[i * 3 + 1];
          shapeData[o + 2] = shape.pos[i * 3 + 2];
          shapeData[o + 3] = shape.accent[i];
          flowData[o] = shape.flow[i];
        }
      });
      const tex = (data: Float32Array) => {
        const t = new THREE.DataTexture(data, TEX_W, TEX_H, THREE.RGBAFormat, THREE.FloatType);
        t.minFilter = t.magFilter = THREE.NearestFilter;
        t.needsUpdate = true;
        return t;
      };
      const shapesTex = tex(shapeData);
      const flowsTex = tex(flowData);

      const ids = new Float32Array(count).map((_, i) => i);
      const rand = new Float32Array(count * 3).map(() => Math.random() * 2 - 1);
      const geometry = new THREE.BufferGeometry();
      // Positions come from the textures; this only sizes the draw.
      geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
      geometry.setAttribute("aId", new THREE.BufferAttribute(ids, 1));
      geometry.setAttribute("aRand", new THREE.BufferAttribute(rand, 3));

      const uniforms = {
        uShapes: { value: shapesTex },
        uFlows: { value: flowsTex },
        uTexW: { value: TEX_W },
        uTexH: { value: TEX_H },
        uRows: { value: ROWS },
        uFrom: { value: 0 },
        uTo: { value: 0 },
        uMix: { value: 0 },
        uTime: { value: 0 },
        uSize: { value: 2.5 * dpr },
        uCamZ: { value: 6 },
        uPointer: { value: new THREE.Vector2(9, 9) },
        uPointerActive: { value: 0 },
        uOpacity: { value: 0 },
        uColor: { value: new THREE.Color("#f4f3f1") },
        uAccent: { value: new THREE.Color("#ff4d2e") },
      };
      const material = new THREE.ShaderMaterial({
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        uniforms,
        transparent: true,
        depthWrite: false,
        depthTest: false,
      });
      const points = new THREE.Points(geometry, material);
      points.frustumCulled = false;
      const rig = new THREE.Group(); // position, scale, and the plane's flight
      rig.add(points);
      const scene = new THREE.Scene();
      scene.add(rig);

      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 80);
      camera.position.z = 6;
      let worldH = 1;
      let worldW = 1;
      let mobile = false;
      const resize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        worldH = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
        worldW = worldH * camera.aspect;
        mobile = w < 1024;
      };
      resize();

      // --- Chapter marks ------------------------------------------------------
      let marks: { shape: number; y: number; name: StoryShape; x: number | null }[] = [];
      const readMarks = () => {
        marks = Array.from(document.querySelectorAll<HTMLElement>("[data-story]"))
          // A mark inside a hidden (display: none) layout has no box; skip it.
          .filter((m) => m.offsetParent !== null)
          .map((m) => {
            const name = m.dataset.story as StoryShape;
            const r = m.getBoundingClientRect();
            const x = m.dataset.stage !== undefined ? (r.left - window.innerWidth / 2) / window.innerWidth : null;
            return { name, shape: NAMES.indexOf(name), y: r.top + window.scrollY, x };
          })
          .filter((m) => m.shape >= 0)
          .sort((a, b) => a.y - b.y);
      };
      readMarks();
      const bodyObserver = new ResizeObserver(readMarks);
      bodyObserver.observe(document.body);
      const onResize = () => {
        resize();
        readMarks();
      };
      window.addEventListener("resize", onResize);

      // --- Theme --------------------------------------------------------------
      const readTheme = () => {
        const cs = getComputedStyle(document.documentElement);
        uniforms.uColor.value.set(cs.getPropertyValue("--fg").trim() || "#f4f3f1");
        uniforms.uAccent.value.set(cs.getPropertyValue("--accent").trim() || "#ff4d2e");
      };
      readTheme();
      const themeObserver = new MutationObserver(readTheme);
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      const scheme = window.matchMedia("(prefers-color-scheme: light)");
      scheme.addEventListener("change", readTheme);

      // --- Reader ---------------------------------------------------------------
      const pointer = new THREE.Vector2(9, 9);
      let lastMove = -10;
      const clock = new THREE.Clock();
      const onMove = (e: PointerEvent) => {
        pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
        lastMove = clock.elapsedTime;
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      let flightStart = -1;
      const onSent = () => {
        flightStart = clock.elapsedTime;
      };
      window.addEventListener(SENT_EVENT, onSent);

      // --- Frame ----------------------------------------------------------------
      let storyPos = window.scrollY + window.innerHeight / 2;
      let spinAngle = 0;
      const cur: Look = { ...LOOKS.dust.d };

      renderer.setAnimationLoop(() => {
        const dt = Math.min(clock.getDelta(), 0.05);
        const t = clock.elapsedTime;
        uniforms.uTime.value = t;
        let fade = 1;
        const phase = intro.phase;
        if (phase !== "done") {
          // The loading intro: the cloud is the splash screen, above it.
          el.style.zIndex = "95";
          const now = performance.now();
          const splashLook = mobile ? SPLASH_LOOK.m : SPLASH_LOOK.d;
          if (phase === "playing") {
            const f = splashFrame(now);
            uniforms.uFrom.value = NAMES.indexOf(SPLASH_SHAPES[f.from]);
            uniforms.uTo.value = NAMES.indexOf(SPLASH_SHAPES[f.to]);
            uniforms.uMix.value = f.mix;
            Object.assign(cur, splashLook);
          } else {
            // Leaving: whatever shape was up bursts out into dust and fades
            // as the splash lifts off the page underneath.
            const f = splashFrame(intro.leaveAt);
            const e = smooth(0, LEAVE_MS, now - intro.leaveAt);
            const dust = mobile ? LOOKS.dust.m : LOOKS.dust.d;
            uniforms.uFrom.value = NAMES.indexOf(SPLASH_SHAPES[f.mix < 0.5 ? f.from : f.to]);
            uniforms.uTo.value = NAMES.indexOf("dust");
            uniforms.uMix.value = e;
            (Object.keys(cur) as (keyof Look)[]).forEach((k) => {
              cur[k] = lerp(splashLook[k], dust[k], e);
            });
            // Fade early, so the dust only brushes past the hero copy.
            cur.o = 1 - smooth(0.15, 0.7, e);
          }
          storyPos = window.scrollY + window.innerHeight / 2;
        } else {
          if (el.style.zIndex) el.style.zIndex = "";
          if (marks.length === 0) return;

          // Where the reader is in the story, eased so wheel steps do not jolt.
          const target = window.scrollY + window.innerHeight / 2;
          storyPos += (target - storyPos) * 0.14;

          let i = 0;
          while (i < marks.length - 1 && marks[i + 1].y <= storyPos) i++;
          const a = marks[i];
          const b = marks[Math.min(i + 1, marks.length - 1)];
          let mixT = 0;
          if (b !== a && storyPos > a.y) {
            // Hold, then fly over a short stretch around the midpoint.
            const mid = (a.y + b.y) / 2;
            const span = Math.min((b.y - a.y) * 0.5, window.innerHeight * 0.85) / 2;
            mixT = smooth(mid - span, mid + span, storyPos);
          }
          uniforms.uFrom.value = a.shape;
          uniforms.uTo.value = b.shape;
          uniforms.uMix.value = mixT;

          const la = mobile ? LOOKS[a.name].m : LOOKS[a.name].d;
          const lb = mobile ? LOOKS[b.name].m : LOOKS[b.name].d;
          (Object.keys(cur) as (keyof Look)[]).forEach((k) => {
            cur[k] = lerp(la[k], lb[k], mixT);
          });
          // Staged marks know where their box is; that wins over the preset.
          cur.x = lerp(a.x ?? la.x, b.x ?? lb.x, mixT);

          if (CHAPTER[a.name] !== CHAPTER[b.name]) fade *= Math.pow(1 - Math.sin(Math.PI * mixT), 2);
          const near = mixT < 0.5 ? a : b;
          if (LOCAL[near.name]) {
            const vh = window.innerHeight;
            fade *= 1 - smooth(vh * 0.28, vh * 0.5, Math.abs(storyPos - near.y));
          }
        }
        uniforms.uOpacity.value = cur.o * fade;
        if (uniforms.uOpacity.value < 0.004) {
          renderer.clear();
          return;
        }

        // Turning: continuous for the orbit and dust, a sway for objects,
        // which then settle back to face the reader.
        spinAngle += dt * 0.12 * cur.spin;
        if (cur.spin < 0.5) {
          const home = Math.round(spinAngle / (Math.PI * 2)) * Math.PI * 2;
          spinAngle += (home - spinAngle) * Math.min(1, dt * 1.5);
        }
        const active = t - lastMove < 1 ? 1 : 0;
        uniforms.uPointerActive.value += (active - uniforms.uPointerActive.value) * 0.08;
        uniforms.uPointer.value.lerp(pointer, 0.2);
        const facing = 1 - cur.spin;
        points.rotation.y = spinAngle + Math.sin(t * 0.4) * cur.sway + uniforms.uPointer.value.x * 0.25 * facing * uniforms.uPointerActive.value;
        points.rotation.x += (0.1 - uniforms.uPointer.value.y * 0.15 * facing * uniforms.uPointerActive.value - points.rotation.x) * 0.06;

        // Place and size it for this chapter.
        const scale = (cur.s * worldH) / 2;
        rig.scale.setScalar(scale);
        let fx = 0;
        let fy = 0;
        if (flightStart >= 0) {
          // The plane is thrown off to the right, then glides back in.
          const k = t - flightStart;
          if (k < 0.9) {
            const e = k / 0.9;
            fx = e * e * worldW;
            fy = e * worldH * 0.25;
          } else if (k < 2.6) {
            const e = 1 - Math.pow(1 - (k - 0.9) / 1.7, 3);
            fx = -worldW * (1 - e);
            fy = -worldH * 0.1 * (1 - e);
          } else flightStart = -1;
        }
        rig.position.set(cur.x * worldW + fx, cur.y * worldH + fy, 0);
        uniforms.uCamZ.value = camera.position.z;

        renderer.render(scene, camera);
      });

      el.style.opacity = "1";
      intro.setCloudReady();

      cleanup = () => {
        renderer.setAnimationLoop(null);
        bodyObserver.disconnect();
        themeObserver.disconnect();
        scheme.removeEventListener("change", readTheme);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener(SENT_EVENT, onSent);
        geometry.dispose();
        material.dispose();
        shapesTex.dispose();
        flowsTex.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div
      ref={host}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-0 transition-opacity duration-700 [&>canvas]:h-full [&>canvas]:w-full"
    />
  );
}
