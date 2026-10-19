/**
 * Point-cloud shapes for the story field. Every builder returns exactly
 * `count` points, so any two shapes can be blended point for point.
 * Coordinates sit roughly in -1..1; the field scales and places them.
 */

// A point, plus where it sits along the shape's "flow" (0-1), or -1 if it is
// not on a path. Flow is what the living pulses travel along: the scan
// across the code glyph, data down the chip's pins, signals through the net.
export type Vec = [number, number, number, number?];
export type Shape = { pos: Float32Array; accent: Float32Array; flow: Float32Array };
export type Part = { weight: number; accent?: boolean; sample: () => Vec };

export const rnd = (a: number, b: number) => a + Math.random() * (b - a);

/** Distribute `count` points over parts, proportional to each part's weight. */
export function fill(count: number, parts: Part[]): Shape {
  const pos = new Float32Array(count * 3);
  const accent = new Float32Array(count);
  const flow = new Float32Array(count);
  const total = parts.reduce((s, p) => s + p.weight, 0);
  let i = 0;
  parts.forEach((part, k) => {
    const n = k === parts.length - 1 ? count - i : Math.round((part.weight / total) * count);
    for (let j = 0; j < n && i < count; j++, i++) {
      const [x, y, z, f = -1] = part.sample();
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      accent[i] = part.accent ? 1 : 0;
      flow[i] = f;
    }
  });
  return shuffle({ pos, accent, flow }, count);
}

/** Shuffle so point i in one shape is unrelated to point i in the next. */
function shuffle(s: Shape, count: number): Shape {
  const swap = (arr: Float32Array, a: number, b: number) => {
    const t = arr[a];
    arr[a] = arr[b];
    arr[b] = t;
  };
  for (let i = count - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    for (let c = 0; c < 3; c++) swap(s.pos, i * 3 + c, j * 3 + c);
    swap(s.accent, i, j);
    swap(s.flow, i, j);
  }
  return s;
}

/** A thick stroke from a to b, sampled through its volume. Flow runs left to right. */
export function stroke(a: Vec, b: Vec, thick: number, depth: number): Part {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const nx = -(b[1] - a[1]) / len;
  const ny = (b[0] - a[0]) / len;
  return {
    weight: len,
    sample: (): Vec => {
      const t = Math.random();
      const o = rnd(-thick, thick);
      const x = a[0] + (b[0] - a[0]) * t + nx * o;
      return [x, a[1] + (b[1] - a[1]) * t + ny * o, rnd(-depth, depth), (x + 0.95) / 1.9];
    },
  };
}

export function softwareShape(count: number): Shape {
  const T = 0.075;
  const D = 0.16;
  return fill(count, [
    stroke([-0.32, 0.5, 0], [-0.88, 0, 0], T, D),
    stroke([-0.88, 0, 0], [-0.32, -0.5, 0], T, D),
    stroke([0.32, 0.5, 0], [0.88, 0, 0], T, D),
    stroke([0.88, 0, 0], [0.32, -0.5, 0], T, D),
    { ...stroke([0.2, 0.66, 0], [-0.2, -0.66, 0], T, D), accent: true },
  ]);
}

export function chipShape(count: number): Shape {
  const H = 0.56; // half-width of the package
  const Z = 0.09; // half-thickness
  const L = 0.26; // pin length
  const pins = 7;
  const pinParts: Part[] = [];
  for (let side = 0; side < 4; side++) {
    for (let k = 0; k < pins; k++) {
      const along = -H + ((k + 0.5) / pins) * 2 * H;
      pinParts.push({
        weight: 0.07,
        sample: (): Vec => {
          const out = rnd(H, H + L);
          const w = rnd(-0.035, 0.035);
          const z = rnd(-0.025, 0.025);
          // Data flows in from the pin tip toward the package.
          const f = 1 - (out - H) / L;
          // Rotate the same pin template onto each side.
          if (side === 0) return [along + w, out, z, f];
          if (side === 1) return [out, along + w, z, f];
          if (side === 2) return [along + w, -out, z, f];
          return [-out, along + w, z, f];
        },
      });
    }
  }
  return fill(count, [
    // Package: top and bottom faces plus the edge band.
    { weight: 1.6, sample: (): Vec => [rnd(-H, H), rnd(-H, H), Math.random() < 0.7 ? Z : -Z] },
    {
      weight: 0.5,
      sample: (): Vec => {
        const e = Math.floor(Math.random() * 4);
        const a = rnd(-H, H);
        const z = rnd(-Z, Z);
        return e === 0 ? [a, H, z] : e === 1 ? [H, a, z] : e === 2 ? [a, -H, z] : [-H, a, z];
      },
    },
    // Die, raised a touch above the package; it pulses as the data arrives.
    { weight: 0.45, accent: true, sample: (): Vec => [rnd(-0.2, 0.2), rnd(-0.2, 0.2), Z + 0.05, 1] },
    // Pin-one mark.
    {
      weight: 0.04,
      accent: true,
      sample: (): Vec => {
        const r = Math.sqrt(Math.random()) * 0.05;
        const t = Math.random() * Math.PI * 2;
        return [-H + 0.13 + Math.cos(t) * r, H - 0.13 + Math.sin(t) * r, Z + 0.01];
      },
    },
    ...pinParts,
  ]);
}

export function networkShape(count: number): Shape {
  const layers = [4, 6, 6, 3];
  const xs = [-0.95, -0.32, 0.32, 0.95];
  const R = [0.42, 0.62, 0.62, 0.32];
  const span = layers.length - 1;
  const nodes: Vec[][] = layers.map((n, l) =>
    Array.from({ length: n }, (_, k) => {
      // Each layer's nodes sit on a ring in the y-z plane, so the net has
      // depth and parallax when it turns.
      const a = (k / n) * Math.PI * 2 + l * 0.4;
      return [xs[l], Math.cos(a) * R[l], Math.sin(a) * R[l]] as Vec;
    })
  );
  const parts: Part[] = [];
  nodes.forEach((layer, l) =>
    layer.forEach((c) =>
      parts.push({
        weight: 0.11,
        accent: l === layers.length - 1,
        sample: (): Vec => {
          const r = Math.cbrt(Math.random()) * 0.075;
          const u = rnd(-1, 1);
          const t = Math.random() * Math.PI * 2;
          const s = Math.sqrt(1 - u * u);
          // Nodes light up as a signal reaches their layer.
          return [c[0] + r * s * Math.cos(t), c[1] + r * s * Math.sin(t), c[2] + r * u, l / span];
        },
      })
    )
  );
  for (let l = 0; l < span; l++) {
    for (const a of nodes[l]) {
      for (const b of nodes[l + 1]) {
        parts.push({
          weight: 0.028,
          sample: (): Vec => {
            const t = Math.random();
            const j = 0.006;
            return [
              a[0] + (b[0] - a[0]) * t + rnd(-j, j),
              a[1] + (b[1] - a[1]) * t + rnd(-j, j),
              a[2] + (b[2] - a[2]) * t + rnd(-j, j),
              (l + t) / span, // signals run input to output
            ];
          },
        });
      }
    }
  }
  return fill(count, parts);
}


// --- Helpers for the story shapes -------------------------------------------

type V3 = [number, number, number];

/** A point inside a ball. */
function ball(c: V3, r: number): V3 {
  const rr = Math.cbrt(Math.random()) * r;
  const u = rnd(-1, 1);
  const t = Math.random() * Math.PI * 2;
  const s = Math.sqrt(1 - u * u);
  return [c[0] + rr * s * Math.cos(t), c[1] + rr * s * Math.sin(t), c[2] + rr * u];
}

/** A point on the segment a-b, jittered by j, with its position t along it. */
function along(a: V3, b: V3, j: number): [V3, number] {
  const t = Math.random();
  return [
    [a[0] + (b[0] - a[0]) * t + rnd(-j, j), a[1] + (b[1] - a[1]) * t + rnd(-j, j), a[2] + (b[2] - a[2]) * t + rnd(-j, j)],
    t,
  ];
}

/** A point on triangle a-b-c. */
function tri(a: V3, b: V3, c: V3): V3 {
  let r1 = Math.random();
  let r2 = Math.random();
  if (r1 + r2 > 1) {
    r1 = 1 - r1;
    r2 = 1 - r2;
  }
  return [0, 1, 2].map((k) => a[k] + r1 * (b[k] - a[k]) + r2 * (c[k] - a[k])) as V3;
}

function rotX([x, y, z]: V3, a: number): V3 {
  return [x, y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
}

function rotY([x, y, z]: V3, a: number): V3 {
  return [x * Math.cos(a) + z * Math.sin(a), y, -x * Math.sin(a) + z * Math.cos(a)];
}

const fractional = (v: number) => v - Math.floor(v);

const withFlow = (p: V3, f = -1): Vec => [p[0], p[1], p[2], f];

// --- Story shapes -------------------------------------------------------------

/** Loose dust in a flattened shell: the field at rest. */
export function dustShape(count: number): Shape {
  return fill(count, [
    {
      weight: 1,
      sample: () => {
        const p = ball([0, 0, 0], 1);
        const n = Math.hypot(p[0], p[1], p[2]) || 1;
        const r = rnd(1.4, 2.6);
        return withFlow([(p[0] / n) * r, (p[1] / n) * r * 0.6, (p[2] / n) * r]);
      },
    },
  ]);
}

/** Furrows of a terraced field seen from above, with sensor posts. */
export function groundShape(count: number): Shape {
  const height = (x: number, z: number) => {
    const s = (0.9 * Math.sin(x * 0.9 + z * 0.4) + 0.6 * Math.cos(z * 1.1 - x * 0.3)) * 1.6;
    return (Math.floor(s) + Math.min(1, Math.max(0, fractional(s) * 2 - 0.5))) * 0.07;
  };
  const ROWS = 26;
  const posts: [number, number][] = [
    [-1.9, -0.4], [-0.9, -1.4], [0.3, -0.2], [1.3, -1.1], [2.1, 0.1], [-0.2, -2.0], [-2.3, -1.7], [1.0, 0.6],
  ];
  return fill(count, [
    {
      weight: 0.86,
      sample: () => {
        const row = Math.floor(Math.random() * ROWS);
        const z = -2.3 + (row / (ROWS - 1)) * 3.3 + rnd(-0.008, 0.008);
        const x = rnd(-2.7, 2.7);
        return withFlow([x, -0.9 + height(x, z), z]);
      },
    },
    ...posts.map(
      ([x, z]): Part => ({
        weight: 0.0175,
        accent: true,
        sample: () => {
          const base = -0.9 + height(x, z);
          const t = Math.random();
          // A thin mast with a denser bead at the top: the sensor head.
          if (Math.random() < 0.4) return withFlow(ball([x, base + 0.5, z], 0.045), 1);
          return withFlow([x + rnd(-0.008, 0.008), base + t * 0.48, z + rnd(-0.008, 0.008)], t);
        },
      })
    ),
  ]);
}

/** A winding path with milestones: the experience chapter. */
export function pathShape(count: number): Shape {
  const at = (u: number): V3 => [-1.3 + 2.6 * u, 0.34 * Math.sin(u * Math.PI * 2.2), 0.42 * Math.cos(u * Math.PI * 2.2)];
  const stones = [0.07, 0.36, 0.64, 0.93];
  return fill(count, [
    {
      weight: 0.8,
      sample: () => {
        const u = Math.random();
        return withFlow(ball(at(u), 0.035), u);
      },
    },
    ...stones.map(
      (u): Part => ({
        weight: 0.05,
        accent: true,
        sample: () => withFlow(ball(at(u), 0.09), u),
      })
    ),
  ]);
}

/** A browser window with a layered page inside: full-stack web. */
export function browserShape(count: number): Shape {
  const W = 1.0;
  const H = 0.66;
  const scan = (x: number) => (x + W) / (2 * W);
  const rect = (x0: number, y0: number, x1: number, y1: number, z: number, weight: number, accent = false): Part => ({
    weight,
    accent,
    sample: () => {
      const x = rnd(x0, x1);
      return withFlow([x, rnd(y0, y1), z + rnd(-0.01, 0.01)], scan(x));
    },
  });
  const edge = (a: V3, b: V3, weight: number): Part => ({
    weight,
    sample: () => {
      const [p] = along(a, b, 0.008);
      return withFlow(p, scan(p[0]));
    },
  });
  const dot = (x: number, accent: boolean): Part => ({
    weight: 0.03,
    accent,
    sample: () => withFlow(ball([x, H - 0.065, 0.02], 0.03)),
  });
  return fill(count, [
    // Frame.
    edge([-W, H, 0], [W, H, 0], 0.5),
    edge([-W, -H, 0], [W, -H, 0], 0.5),
    edge([-W, -H, 0], [-W, H, 0], 0.32),
    edge([W, -H, 0], [W, H, 0], 0.32),
    // Title bar and its three dots.
    rect(-W, H - 0.13, W, H, 0, 0.35),
    dot(-W + 0.09, true),
    dot(-W + 0.18, false),
    dot(-W + 0.27, false),
    // The page, lifted off the window in layers.
    rect(-0.88, 0.32, 0.1, 0.4, 0.1, 0.12, true),
    rect(-0.88, 0.18, 0.45, 0.22, 0.1, 0.08),
    rect(-0.88, 0.08, 0.3, 0.12, 0.1, 0.07),
    rect(-0.88, -0.56, -0.08, -0.06, 0.2, 0.4),
    rect(0.04, -0.56, 0.88, -0.06, 0.2, 0.4),
    rect(0.2, 0.06, 0.88, 0.42, 0.14, 0.3),
  ]);
}

/** Three stacked database drums: backend and systems. */
export function databaseShape(count: number): Shape {
  const R = 0.62;
  const H = 0.3;
  const centres = [0.52, 0, -0.52];
  const up = (y: number) => (y + 0.9) / 1.8;
  const parts: Part[] = [];
  centres.forEach((cy, k) => {
    parts.push({
      weight: 1,
      sample: () => {
        const a = Math.random() * Math.PI * 2;
        const y = cy + rnd(-H / 2, H / 2);
        return withFlow([Math.sin(a) * R, y, Math.cos(a) * R], up(y));
      },
    });
    parts.push({
      weight: 0.28,
      accent: k === 0,
      sample: () => {
        const a = Math.random() * Math.PI * 2;
        const y = cy + H / 2;
        return withFlow([Math.sin(a) * R, y + rnd(-0.01, 0.01), Math.cos(a) * R], up(y));
      },
    });
  });
  parts.push({
    weight: 0.6,
    sample: () => {
      const a = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * R;
      return withFlow([Math.sin(a) * r, centres[0] + H / 2, Math.cos(a) * r], 1);
    },
  });
  return fill(count, parts);
}

/** A node with a mast and radio arcs: IoT, hardware, and ML in the field. */
export function signalShape(count: number): Shape {
  const tip: V3 = [0, 0.32, 0];
  const parts: Part[] = [
    { weight: 0.5, sample: () => withFlow([rnd(-0.38, 0.38), rnd(-0.72, -0.62), rnd(-0.28, 0.28)]) },
    {
      weight: 0.12,
      sample: () => {
        const [p, t] = along([0, -0.62, 0], tip, 0.01);
        return withFlow(p, t * 0.2);
      },
    },
    { weight: 0.05, accent: true, sample: () => withFlow(ball(tip, 0.06), 0) },
  ];
  [0.32, 0.56, 0.8].forEach((r, k) => {
    for (const side of [-1, 1]) {
      parts.push({
        weight: 0.1 * (k + 1),
        sample: () => {
          const a = rnd(-0.85, 0.85);
          return withFlow([tip[0] + side * Math.cos(a) * r, tip[1] + Math.sin(a) * r, rnd(-0.02, 0.02)], r / 0.8);
        },
      });
    }
  });
  return fill(count, parts);
}

/** A git history with a feature branch: engineering practice. */
export function branchShape(count: number): Shape {
  const mainX = -0.32;
  const bx = 0.38;
  const bz = 0.28;
  const curve = (a: V3, b: V3) => (t: number): V3 => {
    const e = t * t * (3 - 2 * t);
    return [a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * e];
  };
  const line = (fn: (t: number) => V3, weight: number): Part => ({
    weight,
    sample: () => {
      const p = fn(Math.random());
      return withFlow([p[0] + rnd(-0.01, 0.01), p[1] + rnd(-0.01, 0.01), p[2] + rnd(-0.01, 0.01)], (p[1] + 1) / 2);
    },
  });
  const commit = (c: V3, accent = false): Part => ({
    weight: 0.05,
    accent,
    sample: () => withFlow(ball(c, 0.075), (c[1] + 1) / 2),
  });
  return fill(count, [
    line((t) => [mainX, -0.95 + 1.9 * t, 0], 0.6),
    line(curve([mainX, -0.62, 0], [bx, -0.28, bz]), 0.25),
    line((t) => [bx, -0.28 + 0.58 * t, bz], 0.2),
    line(curve([bx, 0.3, bz], [mainX, 0.64, 0]), 0.25),
    commit([mainX, -0.82, 0]),
    commit([mainX, -0.36, 0]),
    commit([mainX, 0.1, 0]),
    commit([mainX, 0.82, 0]),
    commit([bx, -0.12, bz], true),
    commit([bx, 0.18, bz], true),
    commit([mainX, 0.64, 0], true),
  ]);
}

/** A folded paper plane: the closing chapter. */
export function planeShape(count: number): Shape {
  const nose: V3 = [1.1, 0.05, 0];
  const tail: V3 = [-0.9, 0.1, 0];
  const wingL: V3 = [-1.0, 0.2, 0.74];
  const wingR: V3 = [-1.0, 0.2, -0.74];
  const keel: V3 = [-0.9, -0.28, 0];
  // Turned so its top faces the reader and the wings read as wings.
  const pose = (p: V3) => rotY(rotX(p, 0.95), -0.45);
  const face = (a: V3, b: V3, c: V3, weight: number): Part => ({
    weight,
    sample: () => {
      const p = tri(a, b, c);
      return withFlow(pose(p), (p[0] + 1) / 2.1);
    },
  });
  return fill(count, [
    face(nose, wingL, tail, 1),
    face(nose, tail, wingR, 1),
    face(nose, tail, keel, 0.45),
    {
      weight: 0.08,
      accent: true,
      sample: () => {
        const [p, t] = along(nose, tail, 0.006);
        return withFlow(pose(p), 1 - t);
      },
    },
  ]);
}
