// Procedural ASCII art generator
// Renders text-based imagery using density-mapped characters

const ASCII_RAMP = " .'`,:;-~+*=#%@";
const ASCII_RAMP_DENSE = " ·:¡;+=*#%@█";
const DOT_RAMP = " ·•●";

// Generate a halftone-style ASCII portrait silhouette
function generatePortraitAscii(cols = 60, rows = 30) {
  const lines = [];
  const cx = cols / 2;
  const cy = rows * 0.55;
  const rxHead = cols * 0.18;
  const ryHead = rows * 0.28;
  const rxShoulder = cols * 0.38;
  const ryShoulder = rows * 0.45;

  for (let y = 0; y < rows; y++) {
    let line = "";
    for (let x = 0; x < cols; x++) {
      // Head (ellipse)
      const dxH = (x - cx) / rxHead;
      const dyH = (y - cy + ryHead * 0.7) / ryHead;
      const head = dxH * dxH + dyH * dyH;

      // Shoulders (ellipse below)
      const dxS = (x - cx) / rxShoulder;
      const dyS = (y - cy - ryShoulder * 0.5) / ryShoulder;
      const shoulder = dxS * dxS + dyS * dyS;

      const inHead = head < 1;
      const inShoulder = shoulder < 1 && y > cy - 1;

      if (inHead || inShoulder) {
        // Dithered density based on noise + distance from center
        const dist = Math.min(head, shoulder);
        const noise = (Math.sin(x * 0.7) * Math.cos(y * 0.9) + Math.sin(x * 1.3 + y * 0.5)) * 0.5;
        const density = (1 - dist) * 0.7 + noise * 0.3 + 0.1;
        const idx = Math.max(0, Math.min(DOT_RAMP.length - 1, Math.floor(density * DOT_RAMP.length)));
        line += DOT_RAMP[idx];
      } else {
        // background scatter
        const bg = Math.random();
        line += bg > 0.985 ? "·" : " ";
      }
    }
    lines.push(line);
  }
  return lines.join("\n");
}

// Generate a globe/world wireframe ascii
function generateGlobeAscii(cols = 40, rows = 20) {
  const lines = [];
  const cx = cols / 2;
  const cy = rows / 2;
  const r = Math.min(cols, rows * 2) * 0.42;

  for (let y = 0; y < rows; y++) {
    let line = "";
    for (let x = 0; x < cols; x++) {
      const dx = (x - cx) / 2;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > r) {
        line += " ";
        continue;
      }
      // sphere surface — compute lat/lon
      const nz = Math.sqrt(1 - (dist / r) * (dist / r));
      const lat = Math.asin(dy / r);
      const lon = Math.atan2(dx / r, nz);
      // wireframe: meridians and parallels
      const meridian = Math.abs(Math.sin(lon * 6)) < 0.12;
      const parallel = Math.abs(Math.sin(lat * 6)) < 0.12;
      const edge = dist > r * 0.94;
      if (edge) line += "·";
      else if (meridian || parallel) line += ":";
      else line += " ";
    }
    lines.push(line);
  }
  return lines.join("\n");
}

// Generate dithered mountain landscape (like the blue reference)
function generateLandscapeAscii(cols = 100, rows = 28) {
  const lines = [];
  // multiple noise-based ridges
  const ridges = [
    { amp: 6, freq: 0.08, offset: 0.35, char: "▓" },
    { amp: 4, freq: 0.13, offset: 0.55, char: "▒" },
    { amp: 3, freq: 0.21, offset: 0.7, char: "░" },
  ];

  const heightAt = (x) => {
    let total = 0;
    for (const r of ridges) {
      total = Math.max(total,
        (Math.sin(x * r.freq) + Math.sin(x * r.freq * 2.3 + 1) * 0.4 + Math.sin(x * r.freq * 5 + 2) * 0.2)
          * r.amp + r.offset * rows
      );
    }
    return total;
  };

  for (let y = 0; y < rows; y++) {
    let line = "";
    for (let x = 0; x < cols; x++) {
      // Sky dithering
      const skyDensity = 1 - (y / rows) * 0.6;
      const sky = Math.random() < skyDensity * 0.35;

      // Ground: dotted dense at top of mountain, sparse below
      let topRidge = 0;
      for (const r of ridges) {
        const h = (Math.sin(x * r.freq) + Math.sin(x * r.freq * 2.3 + 1) * 0.4 + Math.sin(x * r.freq * 5 + 2) * 0.2) * r.amp + r.offset * rows;
        if (y > rows - h) {
          topRidge = Math.max(topRidge, h - (rows - y));
        }
      }

      if (topRidge > 0) {
        // closer to top edge = denser
        const d = Math.min(1, topRidge / 6);
        if (Math.random() < d * 0.95) line += "·";
        else line += " ";
      } else if (sky && y < rows * 0.5) {
        line += "·";
      } else {
        line += " ";
      }
    }
    lines.push(line);
  }
  return lines.join("\n");
}

// Live, mouse-disturbable ASCII canvas
class AsciiCanvas {
  constructor(el, opts = {}) {
    this.el = el;
    this.cols = opts.cols || 80;
    this.rows = opts.rows || 30;
    this.ramp = opts.ramp || DOT_RAMP;
    this.generator = opts.generator || ((x, y, t, mx, my) => {
      const dx = x - this.cols / 2;
      const dy = y - this.rows / 2;
      const d = Math.sqrt(dx * dx + dy * dy);
      const v = Math.sin(d * 0.3 - t * 0.001) * 0.5 + 0.5;
      return v;
    });
    this.mouse = { x: -999, y: -999, active: false };
    this.t0 = performance.now();
    this.bindMouse();
    this.tick();
  }
  bindMouse() {
    const rect = () => this.el.getBoundingClientRect();
    window.addEventListener("mousemove", (e) => {
      const r = rect();
      this.mouse.x = ((e.clientX - r.left) / r.width) * this.cols;
      this.mouse.y = ((e.clientY - r.top) / r.height) * this.rows;
      this.mouse.active = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    });
  }
  render() {
    const t = performance.now() - this.t0;
    let out = "";
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        let v = this.generator(x, y, t, this.mouse.x, this.mouse.y);
        // mouse disturbance
        if (this.mouse.active) {
          const dx = (x - this.mouse.x);
          const dy = (y - this.mouse.y);
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 8) {
            v += (1 - d / 8) * 0.8;
          }
        }
        v = Math.max(0, Math.min(0.999, v));
        const idx = Math.floor(v * this.ramp.length);
        out += this.ramp[idx] || " ";
      }
      out += "\n";
    }
    this.el.textContent = out;
  }
  tick() {
    this.render();
    this._raf = requestAnimationFrame(() => this.tick());
  }
}

// ───────────────────────────────────────────────────────────────────
// CLOUD HALFTONE — Bayer-dithered fractal noise, animated
// Produces a generator(x, y, t) → density 0..1 suitable for AsciiCanvas
// Renders with single-char ramp [" ", "·"] for the classic dot look.
// ───────────────────────────────────────────────────────────────────

// 4x4 Bayer matrix (normalised)
const BAYER_4 = [
  [ 0, 8, 2,10],
  [12, 4,14, 6],
  [ 3,11, 1, 9],
  [15, 7,13, 5],
].map(row => row.map(v => v / 16));

// Hashed-gradient value noise (fast, smooth-ish, tile-able-enough)
function hash2(x, y) {
  let h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return h - Math.floor(h);
}
function vnoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi,        yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi,     yi    );
  const b = hash2(xi + 1, yi    );
  const c = hash2(xi,     yi + 1);
  const d = hash2(xi + 1, yi + 1);
  return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
}
function fbm(x, y) {
  let v = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < 5; i++) {
    v += amp * vnoise(x * freq, y * freq);
    freq *= 2.05;
    amp  *= 0.5;
  }
  return v;
}

// Generator factory. Returns a fn(x, y, t) → density 0..1.
// At the surface: dense at top (sky), thinning down through cloud edges,
// then a faint floor halftone at the bottom.
function makeCloudHalftoneGenerator(cols, rows, opts = {}) {
  const speed     = opts.speed     ?? 0.00006;   // horizontal drift
  const scale     = opts.scale     ?? 0.018;     // noise zoom
  const horizon   = opts.horizon   ?? 0.45;      // 0..1 vertical line where clouds tend to sit
  const cloudGain = opts.cloudGain ?? 1.6;       // contrast of cloud mass
  const floorGain = opts.floorGain ?? 0.55;      // density of haze under clouds

  return function generator(x, y, t) {
    const vy = y / rows;
    // Drift: clouds move horizontally over time
    const u = (x + t * speed * 14000) * scale;
    const v = y * scale * 1.3;

    // Two FBM layers (parallax)
    const back  = fbm(u * 0.55, v * 0.9 + 1.7);
    const front = fbm(u * 1.05 + 3.3, v * 1.15 - 0.4);
    let cloudMass = back * 0.55 + front * 0.55;

    // "Sky pressure": top of image has stronger sky (less clouds reach there)
    // Bottom-right of reference is also mostly blue, so we BIAS clouds to a band.
    // We want a smooth gradient density where clouds carve white areas in the
    // middle, leaving hard halftone fades at the edges (just like reference).
    const bandCenter = 0.45;
    const bandWidth  = 0.42;
    const dist = Math.abs(vy - bandCenter) / bandWidth;
    // Probability that this row supports a cloud (1 = full, 0 = none)
    const bandWeight = Math.max(0, 1 - dist * dist);

    // cloudFloat in [0,1]: 1 = solid cloud (white), 0 = solid sky (blue)
    let cloudFloat = (cloudMass - 0.40) * 2.2;        // contrast curve
    cloudFloat = Math.max(0, Math.min(1, cloudFloat));
    cloudFloat *= bandWeight * cloudGain;
    cloudFloat = Math.min(1, cloudFloat);

    // Sky density at this row: top is SOLID blue, rest still very dense.
    // The very top (vy<0.05) is locked to 1.0 to get that solid-blue band.
    let sky;
    if (vy < 0.05) sky = 1.0;
    else           sky = 0.95 - Math.pow(vy - 0.05, 1.2) * 0.25;

    // Combine: density = sky energy carved by clouds
    let density = sky * (1 - cloudFloat);

    // Halftone fade at bottom — keeps some texture in the lower stripe.
    density = Math.max(density, (vy > 0.82 ? (vy - 0.82) * 2 * floorGain : 0));

    // Ordered Bayer dither (4×4 tiled). Hard threshold → dot or space.
    const bx = ((x % 4) + 4) % 4;
    const by = ((y % 4) + 4) % 4;
    const thresh = BAYER_4[by][bx];
    const dot = density > thresh;

    return dot ? 0.99 : 0.0;
  };
}

window.AsciiArt = {
  generatePortraitAscii,
  generateGlobeAscii,
  generateLandscapeAscii,
  AsciiCanvas,
  makeCloudHalftoneGenerator,
  CloudHalftoneCanvas,
  RAMPS: { ASCII_RAMP, ASCII_RAMP_DENSE, DOT_RAMP }
};

// ───────────────────────────────────────────────────────────────────
// CloudHalftoneCanvas — pixel-perfect halftone clouds on <canvas>.
// Matches the reference image: tight square grid, small filled dots,
// solid blue band at top, hard cloud edges, animated drift.
// ───────────────────────────────────────────────────────────────────

function CloudHalftoneCanvas(canvasEl, opts = {}) {
  this.el = canvasEl;
  this.ctx = canvasEl.getContext("2d");
  this.cellPx   = opts.cellPx   ?? 5;       // grid spacing in px
  this.dotPx    = opts.dotPx    ?? 2;       // dot diameter in px
  this.color    = opts.color    ?? "#2E6FC9";
  this.speed    = opts.speed    ?? 0.04;    // drift cells per frame
  this.scale    = opts.scale    ?? 0.018;   // noise zoom
  this.cloudGain= opts.cloudGain ?? 1.3;

  this.t0 = performance.now();
  this.resize();
  window.addEventListener("resize", () => this.resize());
  this.tick();
}

CloudHalftoneCanvas.prototype.resize = function() {
  const r = this.el.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  this.el.width  = Math.floor(r.width  * dpr);
  this.el.height = Math.floor(r.height * dpr);
  this.el.style.width  = r.width  + "px";
  this.el.style.height = r.height + "px";
  this.dpr = dpr;
  this.cols = Math.floor(r.width  / this.cellPx);
  this.rows = Math.floor(r.height / this.cellPx);
};

CloudHalftoneCanvas.prototype.render = function() {
  const ctx = this.ctx;
  const dpr = this.dpr;
  const cell = this.cellPx * dpr;
  const dot  = this.dotPx  * dpr;
  const cols = this.cols, rows = this.rows;
  const t = (performance.now() - this.t0) * 0.001;

  ctx.clearRect(0, 0, this.el.width, this.el.height);
  ctx.fillStyle = this.color;

  // Drift offset (clouds move horizontally)
  const drift = t * 8.0; // grid units / sec

  for (let y = 0; y < rows; y++) {
    const vy = y / rows;
    // Vertical sky weighting + cloud-band weighting.
    // Sky is uniformly dense across the whole frame (no taper) so the
    // halftone "fill" looks consistent — like the reference image.
    let sky;
    if (vy < 0.08) sky = 1.0;
    else           sky = 0.98;

    // Cloud band — broad, peaks around vy=0.45. Clouds carve white
    // holes through the dense sky everywhere except very top edge.
    const bandCenter = 0.50, bandWidth = 0.70;
    const dist = Math.abs(vy - bandCenter) / bandWidth;
    const bandWeight = Math.max(0, 1 - dist * dist);

    for (let x = 0; x < cols; x++) {
      const u = (x + drift) * this.scale;
      const v = y * this.scale * 1.3;

      const back  = fbm(u * 0.55, v * 0.9 + 1.7);
      const front = fbm(u * 1.05 + 3.3, v * 1.15 - 0.4);
      const cloudMass = back * 0.55 + front * 0.55;

      // Contrast curve — pushes cloud cores hard to 1.0 (pure white)
      // and sky cores hard to 0 (full halftone fill), giving sharper
      // cloud silhouettes against dense halftone sky.
      let cloudFloat = (cloudMass - 0.38) * 3.2;
      cloudFloat = cloudFloat < 0 ? 0 : (cloudFloat > 1 ? 1 : cloudFloat);
      cloudFloat = Math.min(1, cloudFloat * bandWeight * this.cloudGain);

      const density = sky * (1 - cloudFloat);

      // 4×4 ordered (Bayer) dither
      const bx = ((x % 4) + 4) % 4;
      const by = ((y % 4) + 4) % 4;
      if (density > BAYER_4[by][bx]) {
        // pixel-perfect dot, centered in cell
        const cx = x * cell + cell / 2;
        const cy = y * cell + cell / 2;
        ctx.fillRect(cx - dot / 2, cy - dot / 2, dot, dot);
      }
    }
  }
};

CloudHalftoneCanvas.prototype.tick = function() {
  this.render();
  this._raf = requestAnimationFrame(() => this.tick());
};
