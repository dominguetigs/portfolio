/**
 * The splash ends by tearing: its paper rips open from the centre and the
 * painting shows through.
 *
 * The hole is where |p - c| + roughness(p) < R, R growing with time. The
 * roughness is a noise field fixed on the screen, so the edge keeps a paper's
 * scale of ragged detail however large the hole gets, and grows the way a
 * tear does (pockets catch, then give). It is traced along rays from the
 * centre, cut out of the paper with a clip-path, and a canvas over the paper
 * draws what a real tear shows: a pale band where the fibres inside the sheet
 * are exposed, loose fibres reaching into the hole, and the paper's soft
 * shadow on the page below.
 */

const TEAR_MS = 1500;
/** Ragged detail, px: lumps, wobble, grain, fibre. */
const ROUGH = [
  { amp: 64, size: 240 },
  { amp: 20, size: 58 },
  { amp: 6, size: 15 },
  { amp: 1.6, size: 4.5 },
];
const ROUGH_MAX = ROUGH.reduce((sum, o) => sum + o.amp, 0);
/** The paper's shadow on the page: how far it reaches (twice, px), in steps. */
const SHADOW_WIDTH = 30;
const SHADOW_STEPS = 10;
/** How much further the tear runs along its quickest lines (1 / (1 - RUN)). */
const RUN = 0.22;
/** How far each ray steps while tracing the edge, px. */
const STEP = 3;

function hash(x: number, y: number, seed: number) {
  let h =
    Math.imul(x, 374761393) +
    Math.imul(y, 668265263) +
    Math.imul(seed, 982451653);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** Smooth value noise, -1..1. */
function noise(x: number, y: number, seed: number) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const u = fx * fx * (3 - 2 * fx);
  const v = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy, seed);
  const b = hash(ix + 1, iy, seed);
  const c = hash(ix, iy + 1, seed);
  const d = hash(ix + 1, iy + 1, seed);
  return (a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v) * 2 - 1;
}

function roughness(x: number, y: number) {
  let sum = 0;
  ROUGH.forEach(({ amp, size }, i) => {
    sum += amp * noise(x / size, y / size, i + 1);
  });
  return sum;
}

/** The pale band's width where the edge passes, px. */
function bandWidth(x: number, y: number) {
  return (
    0.9 +
    4.2 * Math.max(0, noise(x / 34, y / 34, 11)) +
    1.4 * Math.max(0, noise(x / 8, y / 8, 12))
  );
}

/** Whether `clip-path: path()` works here: without it the splash fades. */
export function canTear() {
  return (
    typeof CSS !== 'undefined' && CSS.supports('clip-path', 'path("M0 0H1V1Z")')
  );
}

const COLORS = {
  light: {
    band: 'rgb(252, 247, 236)',
    fibre: 'rgba(252, 247, 236, 0.7)',
    shadow: 'rgb(70, 48, 22)',
    shadowAlpha: 0.16,
  },
  dark: {
    band: 'rgb(72, 82, 108)',
    fibre: 'rgba(110, 122, 152, 0.7)',
    shadow: 'rgb(0, 0, 0)',
    shadowAlpha: 0.45,
  },
};

/** Paper's pace: a puncture, a slow start, then the rip. */
function radiusAt(t: number, end: number) {
  const puncture = Math.min(1, t / 0.1);
  return (
    end * (0.035 * puncture * puncture * (3 - 2 * puncture) + 0.965 * t * t)
  );
}

/**
 * Tears `paper` open over TEAR_MS, drawing the edge on `edge` (a canvas over
 * it, the size of the screen). Calls `onEnd` once the hole covers the screen;
 * returns a function that stops it.
 */
export function tearPaper(
  paper: HTMLElement,
  edge: HTMLCanvasElement,
  onEnd: () => void,
) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  edge.width = Math.round(width * dpr);
  edge.height = Math.round(height * dpr);
  const ctx = edge.getContext('2d');
  const colors = document.documentElement.classList.contains('dark')
    ? COLORS.dark
    : COLORS.light;

  const cx = width / 2;
  const cy = height / 2;
  const end = Math.hypot(cx, cy) + ROUGH_MAX + 24;
  const rays = Math.max(
    720,
    Math.min(2000, Math.round((2 * Math.PI * end) / 3.5)),
  );
  const cos = new Float32Array(rays);
  const sin = new Float32Array(rays);
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2;
    cos[i] = Math.cos(a);
    sin[i] = Math.sin(a);
  }
  const radius = new Float32Array(rays);
  const xs = new Float32Array(rays);
  const ys = new Float32Array(rays);
  // Each visit tears differently: somewhere else in the noise, and along
  // other lines (a tear runs faster one way than another).
  const ox = Math.random() * 4096;
  const oy = Math.random() * 4096;
  const phases = [Math.random(), Math.random(), Math.random()].map(
    a => a * Math.PI * 2,
  );
  const slowness = new Float32Array(rays);
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2;
    const runs =
      0.5 * Math.sin(2 * a + phases[0]) +
      0.3 * Math.sin(3 * a + phases[1]) +
      0.2 * Math.sin(5 * a + phases[2]);
    slowness[i] = 1 - RUN * (0.5 + 0.5 * runs);
  }
  // The tear starts at the centre, and starts round: the roughness comes in
  // over the first 90 px.
  const base = roughness(cx + ox, cy + oy);
  const reach = (i: number, r: number) =>
    r * slowness[i] +
    (roughness(cx + ox + cos[i] * r, cy + oy + sin[i] * r) - base) *
      Math.min(1, r / 90);

  function trace(R: number) {
    for (let i = 0; i < rays; i++) {
      let r = radius[i];
      if (reach(i, r) < R) {
        let inside = r;
        while (r < (end + ROUGH_MAX) / (1 - RUN)) {
          inside = r;
          r += STEP;
          if (reach(i, r) >= R) break;
        }
        // Narrow it down between the last point inside and the first out.
        let outside = r;
        for (let k = 0; k < 3; k++) {
          const mid = (inside + outside) / 2;
          if (reach(i, mid) < R) inside = mid;
          else outside = mid;
        }
        r = (inside + outside) / 2;
        radius[i] = r;
      }
      xs[i] = cx + cos[i] * r;
      ys[i] = cy + sin[i] * r;
    }
  }

  function clip() {
    // The screen, less the hole (wound the other way, and evenodd, so it is
    // a hole under either fill rule).
    let d = `M0 0H${width}V${height}H0Z M${xs[0].toFixed(1)} ${ys[0].toFixed(1)}`;
    for (let i = rays - 1; i > 0; i--) {
      d += `L${xs[i].toFixed(1)} ${ys[i].toFixed(1)}`;
    }
    paper.style.clipPath = `path(evenodd, "${d}Z")`;
  }

  function draw() {
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const hole = new Path2D();
    hole.moveTo(xs[0], ys[0]);
    for (let i = 1; i < rays; i++) hole.lineTo(xs[i], ys[i]);
    hole.closePath();

    // The paper's shadow on the page, just inside the hole (lit from above).
    ctx.save();
    ctx.clip(hole);
    ctx.translate(0, 2.5);
    // Strokes narrowing to the edge pile up into a smooth gradient.
    ctx.strokeStyle = colors.shadow;
    ctx.lineJoin = 'round';
    ctx.globalAlpha = colors.shadowAlpha / SHADOW_STEPS;
    for (let k = 0; k < SHADOW_STEPS; k++) {
      ctx.lineWidth = SHADOW_WIDTH * (1 - k / SHADOW_STEPS);
      ctx.stroke(hole);
    }
    ctx.restore();

    // The pale band along the edge, on the paper.
    const band = new Path2D();
    band.moveTo(xs[0], ys[0]);
    for (let i = 1; i < rays; i++) band.lineTo(xs[i], ys[i]);
    band.lineTo(xs[0], ys[0]);
    for (let i = rays - 1; i >= 0; i--) {
      const w = bandWidth(xs[i], ys[i]);
      band.lineTo(xs[i] + cos[i] * w, ys[i] + sin[i] * w);
    }
    band.closePath();
    ctx.fillStyle = colors.band;
    ctx.fill(band);

    // Loose fibres, reaching into the hole. Each ray keeps its own, so they
    // ride the edge instead of flickering.
    const fibres = new Path2D();
    for (let i = 0; i < rays; i += 2) {
      if (hash(i, 0, 21) > 0.28) continue;
      // Mostly along the edge, as torn fibres lie, a few straight out.
      const turn = (hash(i, 1, 21) - 0.5) * 2.6;
      const length = 1 + 5 * hash(i, 2, 21) ** 2;
      const bend = (hash(i, 3, 21) - 0.5) * 2.4;
      const dx = -(cos[i] * Math.cos(turn) - sin[i] * Math.sin(turn));
      const dy = -(sin[i] * Math.cos(turn) + cos[i] * Math.sin(turn));
      const x0 = xs[i] - dx * 0.5;
      const y0 = ys[i] - dy * 0.5;
      fibres.moveTo(x0, y0);
      fibres.quadraticCurveTo(
        x0 + dx * length * 0.5 - dy * bend,
        y0 + dy * length * 0.5 + dx * bend,
        x0 + dx * length,
        y0 + dy * length,
      );
    }
    ctx.strokeStyle = colors.fibre;
    ctx.lineWidth = 0.55;
    ctx.lineCap = 'round';
    ctx.stroke(fibres);
  }

  let frame = 0;
  let start = -1;
  const tick = (now: number) => {
    if (start < 0) start = now;
    const t = Math.min(1, (now - start) / TEAR_MS);
    trace(radiusAt(t, end));
    clip();
    draw();
    if (t < 1) {
      frame = requestAnimationFrame(tick);
    } else {
      onEnd();
    }
  };
  frame = requestAnimationFrame(tick);

  return () => cancelAnimationFrame(frame);
}
