"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "motion/react";

/**
 * A rice field in lines, behind the "Most of what I build leaves the laptop"
 * statement: terraced furrows rolling toward the reader, with sensor posts
 * standing in the field and pulsing like the telemetry nodes they stand for.
 *
 * The furrows flow on their own and run further as the section scrolls; the
 * pointer drops a ripple into the field where it points. Lines, not points:
 * the field's rows are what make it read as farmland.
 */

// Shared field shape, used by the furrows and the sensor posts alike, so the
// posts always stand on the ground.
const FIELD_GLSL = /* glsl */ `
  uniform float uTravel;
  uniform float uTime;
  uniform vec3 uRipple;   // x, z, strength
  uniform float uPointScale;
  const float DEPTH = 36.0;
  const float NEAR = 5.0;

  // Wrap z so the rows recycle as the field flows toward the camera.
  float wrapZ(float z) {
    return mod(z + uTravel, DEPTH) - (DEPTH - NEAR);
  }

  float field(float x, float z) {
    float base = 0.9 * sin(x * 0.17 + z * 0.06) + 0.6 * cos(z * 0.21 - x * 0.08);
    // Terraces: soft steps, the way paddies are cut into a slope.
    float s = base * 2.4;
    float terrace = (floor(s) + smoothstep(0.25, 0.75, fract(s))) / 2.4;
    float d = distance(vec2(x, z), uRipple.xy);
    float ripple = sin(d * 1.8 - uTime * 4.0) * exp(-d * 0.35) * uRipple.z;
    return terrace * 1.05 + ripple * 0.45;
  }

  float fade(float z) {
    return smoothstep(-(DEPTH - NEAR), -(DEPTH - NEAR) + 12.0, z) * smoothstep(NEAR, NEAR - 4.0, z);
  }
`;

const FURROW_VERT = /* glsl */ `
  ${FIELD_GLSL}
  varying float vFade;
  void main() {
    float z = wrapZ(position.z);
    float y = field(position.x, z);
    vFade = fade(z);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, y, z, 1.0);
  }
`;

const FURROW_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vFade;
  void main() {
    gl_FragColor = vec4(uColor, vFade * uOpacity);
  }
`;

const POST_VERT = /* glsl */ `
  ${FIELD_GLSL}
  attribute float aTop;
  attribute float aPhase;
  varying float vFade;
  varying float vTop;
  varying float vPulse;
  void main() {
    float z = wrapZ(position.z);
    float y = field(position.x, z) + aTop * 1.3;
    vFade = fade(z);
    vTop = aTop;
    vPulse = 0.5 + 0.5 * sin(uTime * 2.6 + aPhase);
    vec4 mv = modelViewMatrix * vec4(position.x, y, z, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (14.0 + vPulse * 22.0) * (6.0 / -mv.z) * uPointScale;
  }
`;

const POST_LINE_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vFade;
  varying float vTop;
  void main() {
    gl_FragColor = vec4(uColor, vFade * uOpacity * mix(0.4, 1.0, vTop));
  }
`;

const POST_TIP_FRAG = /* glsl */ `
  uniform vec3 uAccent;
  varying float vFade;
  varying float vPulse;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uAccent, vFade * core * (0.45 + 0.55 * vPulse));
  }
`;

export function FieldTerrain({ progress }: { progress: MotionValue<number> }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};

    import("three").then((THREE) => {
      if (disposed) return;
      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);

      const coarse = window.matchMedia("(max-width: 1023px)").matches;
      const ROWS = coarse ? 46 : 70;
      const COLS = coarse ? 90 : 150;
      const WIDTH = 34;
      const DEPTH = 36;

      // --- Furrows: one polyline per row, as a single LineSegments -----------
      const pos = new Float32Array(ROWS * COLS * 3);
      const idx: number[] = [];
      for (let r = 0; r < ROWS; r++) {
        const z = -(r / ROWS) * DEPTH;
        for (let c = 0; c < COLS; c++) {
          const i = r * COLS + c;
          pos[i * 3] = (c / (COLS - 1) - 0.5) * WIDTH;
          pos[i * 3 + 1] = 0;
          pos[i * 3 + 2] = z;
          if (c > 0) idx.push(i - 1, i);
        }
      }
      const furrowGeo = new THREE.BufferGeometry();
      furrowGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      furrowGeo.setIndex(idx);

      const shared = {
        uTravel: { value: 0 },
        uTime: { value: 0 },
        uRipple: { value: new THREE.Vector3(0, -10, 0) },
        uColor: { value: new THREE.Color("#f4f3f1") },
        uAccent: { value: new THREE.Color("#ff4d2e") },
        uOpacity: { value: 0.32 },
        // Sensor heads are sized for a desktop band; a phone band is smaller.
        uPointScale: { value: coarse ? 0.55 : 1 },
      };
      const furrowMat = new THREE.ShaderMaterial({
        vertexShader: FURROW_VERT,
        fragmentShader: FURROW_FRAG,
        uniforms: shared,
        transparent: true,
        depthWrite: false,
      });
      const furrows = new THREE.LineSegments(furrowGeo, furrowMat);
      furrows.frustumCulled = false;

      // --- Sensor posts: a stalk and a pulsing tip each ----------------------
      const SENSORS: [number, number][] = [
        [-6.5, -2.5], [-2, -6], [3.5, -3.5], [8, -8], [-10, -11], [1, -13], [6.5, -17], [-5, -21], [11, -23],
      ];
      const stalkPos = new Float32Array(SENSORS.length * 2 * 3);
      const stalkTop = new Float32Array(SENSORS.length * 2);
      const stalkPhase = new Float32Array(SENSORS.length * 2);
      const tipPos = new Float32Array(SENSORS.length * 3);
      const tipTop = new Float32Array(SENSORS.length).fill(1);
      const tipPhase = new Float32Array(SENSORS.length);
      SENSORS.forEach(([x, z], s) => {
        for (let k = 0; k < 2; k++) {
          stalkPos.set([x, 0, z], (s * 2 + k) * 3);
          stalkTop[s * 2 + k] = k;
          stalkPhase[s * 2 + k] = s * 1.7;
        }
        tipPos.set([x, 0, z], s * 3);
        tipPhase[s] = s * 1.7;
      });
      const stalkGeo = new THREE.BufferGeometry();
      stalkGeo.setAttribute("position", new THREE.BufferAttribute(stalkPos, 3));
      stalkGeo.setAttribute("aTop", new THREE.BufferAttribute(stalkTop, 1));
      stalkGeo.setAttribute("aPhase", new THREE.BufferAttribute(stalkPhase, 1));
      const tipGeo = new THREE.BufferGeometry();
      tipGeo.setAttribute("position", new THREE.BufferAttribute(tipPos, 3));
      tipGeo.setAttribute("aTop", new THREE.BufferAttribute(tipTop, 1));
      tipGeo.setAttribute("aPhase", new THREE.BufferAttribute(tipPhase, 1));

      const stalkMat = new THREE.ShaderMaterial({
        vertexShader: POST_VERT,
        fragmentShader: POST_LINE_FRAG,
        uniforms: shared,
        transparent: true,
        depthWrite: false,
      });
      const tipMat = new THREE.ShaderMaterial({
        vertexShader: POST_VERT,
        fragmentShader: POST_TIP_FRAG,
        uniforms: shared,
        transparent: true,
        depthWrite: false,
      });
      const stalks = new THREE.LineSegments(stalkGeo, stalkMat);
      const tips = new THREE.Points(tipGeo, tipMat);
      stalks.frustumCulled = tips.frustumCulled = false;

      const scene = new THREE.Scene();
      scene.add(furrows, stalks, tips);

      // Low and wide: the field fills the section and the horizon sits high.
      const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 80);
      camera.position.set(0, 2.1, 4.6);
      camera.lookAt(0, -0.9, -8);

      const resize = () => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      const readTheme = () => {
        const cs = getComputedStyle(document.documentElement);
        shared.uColor.value.set(cs.getPropertyValue("--fg").trim() || "#f4f3f1");
        shared.uAccent.value.set(cs.getPropertyValue("--accent").trim() || "#ff4d2e");
        const bg = new THREE.Color(cs.getPropertyValue("--bg").trim() || "#0b0b0c");
        // Ink lines read heavier on paper, so the light theme draws them thinner.
        shared.uOpacity.value = bg.r * 0.299 + bg.g * 0.587 + bg.b * 0.114 > 0.5 ? 0.26 : 0.36;
      };
      readTheme();
      const themeObserver = new MutationObserver(readTheme);
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      const scheme = window.matchMedia("(prefers-color-scheme: light)");
      scheme.addEventListener("change", readTheme);

      // --- Pointer: ripple where the pointer meets the ground ----------------
      const raycaster = new THREE.Raycaster();
      const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const hit = new THREE.Vector3();
      const ndc = new THREE.Vector2();
      let rippleStrength = 0;
      let lastMove = -10;
      const clock = new THREE.Clock();
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        if (e.clientY < r.top || e.clientY > r.bottom) return;
        ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        raycaster.setFromCamera(ndc, camera);
        if (raycaster.ray.intersectPlane(ground, hit)) {
          shared.uRipple.value.x += (hit.x - shared.uRipple.value.x) * 0.5;
          shared.uRipple.value.y += (hit.z - shared.uRipple.value.y) * 0.5;
          lastMove = clock.elapsedTime;
        }
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      let visible = false;
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      io.observe(el);

      const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let drift = 0;
      const frame = () => {
        const dt = Math.min(clock.getDelta(), 0.05);
        const t = clock.elapsedTime;
        drift += dt * 0.9;
        shared.uTime.value = t;
        shared.uTravel.value = drift + progress.get() * 16;
        const want = t - lastMove < 1.2 ? 1 : 0;
        rippleStrength += (want - rippleStrength) * 0.05;
        shared.uRipple.value.z = rippleStrength;
        // Sway the view a touch toward the pointer for parallax.
        camera.position.x += (ndc.x * 0.8 - camera.position.x) * 0.03;
        camera.lookAt(0, -0.9, -8);
        renderer.render(scene, camera);
      };

      if (still) {
        frame();
      } else {
        renderer.setAnimationLoop(() => {
          if (visible) frame();
        });
      }

      cleanup = () => {
        renderer.setAnimationLoop(null);
        io.disconnect();
        ro.disconnect();
        themeObserver.disconnect();
        scheme.removeEventListener("change", readTheme);
        window.removeEventListener("pointermove", onMove);
        furrowGeo.dispose();
        stalkGeo.dispose();
        tipGeo.dispose();
        furrowMat.dispose();
        stalkMat.dispose();
        tipMat.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [progress]);

  return (
    <div
      ref={host}
      aria-hidden
      className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,#000_18%,#000_82%,transparent)] [&>canvas]:h-full [&>canvas]:w-full"
    />
  );
}
