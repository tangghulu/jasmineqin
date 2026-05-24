const { useState, useEffect, useRef } = React;

// ─────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────

const TWEAK_DEFAULTS = {
  accent:    "cobalt",
  density:   "medium",
  grain:     true,
  scanlines: false,
  katakana:  true,
};

const ACCENT_MAP = {
  cobalt: "oklch(0.53 0.17 252)",
  azure:  "oklch(0.58 0.16 240)",
  ink:    "oklch(0.40 0.16 258)",
  neon:   "oklch(0.68 0.18 230)",
};

const POP_MAP = {
  cobalt: "oklch(0.38 0.18 258)",
  azure:  "oklch(0.42 0.17 245)",
  ink:    "oklch(0.28 0.14 260)",
  neon:   "oklch(0.50 0.20 230)",
};

// ─────────────────────────────────────────────────────────────
// SMALL UI ATOMS
// ─────────────────────────────────────────────────────────────

const Mono = ({ children, style, ...rest }) => (
  <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", letterSpacing: "0.02em", ...style }} {...rest}>{children}</span>
);

const Label = ({ children, style }) => (
  <Mono style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--ink-60)", lineHeight: 1.4, ...style }}>{children}</Mono>
);

// ─────────────────────────────────────────────────────────────
// TOP BAR
// ─────────────────────────────────────────────────────────────

function TopBar({ section, sectionJp, sectionIdx, total }) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      // TODO: update timezone to your own city
      const opts = { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Toronto" };
      setTime(d.toLocaleTimeString("en-GB", opts));
    };
    fmt();
    const id = setInterval(fmt, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-cell">
        {/* TODO: update your role/descriptor */}
        <Label>STUDENT <Mono className="jp">// 学生</Mono></Label>
        <Label>CS · DESIGN</Label>
      </div>
      <div className="topbar-cell topbar-cell--center">
        <Label>{section.toUpperCase()}</Label>
        <Label className="jp">{sectionJp}</Label>
      </div>
      <div className="topbar-cell topbar-cell--right">
        <Label>SECTION</Label>
        <Label>{String(sectionIdx).padStart(2, "0")} / {String(total).padStart(2, "0")}</Label>
      </div>
      <div className="topbar-cell topbar-cell--farright">
        {/* TODO: update city name */}
        <Label>TORONTO <Mono className="jp">// 多伦多</Mono></Label>
        <Label>{time}</Label>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────

function Hero() {
  const cloudRef = useRef(null);

  useEffect(() => {
    if (!cloudRef.current) return;
    const inst = new window.AsciiArt.CloudHalftoneCanvas(cloudRef.current, {
      cellPx:    4,
      dotPx:     2,
      color:     "#7BA6DD",
      speed:     0.04,
      scale:     0.020,
      cloudGain: 1.75,
    });
    return () => cancelAnimationFrame(inst._raf);
  }, []);

  return (
    <section className="hero" data-screen-label="01 Hero">
      <canvas ref={cloudRef} className="ascii-clouds" aria-hidden="true" />
      <div className="hero-veil" aria-hidden="true" />

      <div className="hero-inner">
        <div className="hero-meta">
          <div className="hero-meta-left">
            <Mono className="page-num">/ 01 — INDEX <span className="jp">索引</span></Mono>
          </div>
          <div className="hero-meta-right">
            {/* TODO: update coordinates to your city */}
            <Mono className="hero-coord">43.6532° N, 79.3832° W</Mono>
            <Mono className="hero-coord dim">多伦多 · TORONTO</Mono>
          </div>
        </div>

        {/* TODO: update headline to your own words */}
        <h1 className="hero-headline">
          Jasmine Qin<br/>
          <span className="hero-headline-accent">— building things,<br/>learning everything.</span>
        </h1>

        <div className="hero-footer">
          <div className="hero-footer-col">
            <Label>NOW <span className="jp">// 现在</span></Label>
            {/* TODO: update current role/school */}
            <div className="hero-footer-line">Student · CS & Design</div>
            <div className="hero-footer-line muted">Building things on the internet.</div>
          </div>
          <div className="hero-footer-col hero-footer-col--mid">
            <Label>RUNNING <span className="jp">// 运行中</span></Label>
            {/* TODO: update your tools */}
            <Mono className="hero-running">▸ figma · vscode · arc</Mono>
            <Mono className="hero-running dim">▸ always in the terminal</Mono>
          </div>
          <div className="hero-footer-col hero-footer-col--right">
            <Label>SCROLL <span className="jp">// 向下</span></Label>
            <Mono className="scroll-indicator">↓ ↓ ↓</Mono>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// ABOUT
// ─────────────────────────────────────────────────────────────

function About() {
  return (
    <section className="about" data-screen-label="02 About">
      <window.AsciiDivider label="ABOUT" sublabel="关于 · A SHORT BIOGRAPHY" />

      <div className="section-head">
        <Mono className="page-num">/ 02 — ABOUT <span className="jp">关于</span></Mono>
        <Label>WHO IS THIS PERSON <span className="kaomoji-inline">(´・ω・`)</span></Label>
      </div>

      <div className="about-grid">
        <div className="about-headline">
          {/* TODO: update your personal tagline */}
          <h2>
            Curious about how<br/>
            things <em>work</em> — then<br/>
            making them better.
          </h2>
          <Mono className="about-headline-caption">— a working rule ✦</Mono>
        </div>

        <div className="about-body">
          {/* TODO: write your bio */}
          <p>
            I'm <strong>Jasmine Qin</strong>, a student interested in the intersection
            of code and design. I like building things that feel considered — interfaces
            that are fast, honest, and a little bit playful.
          </p>
          <p>
            Currently studying and working on side projects that probably have too many
            features. Always looking for the simplest version of a complex idea.
          </p>
          <p>
            I'm drawn to systems that are both rigorous and expressive. <span className="kaomoji-inline">٩(◕‿◕)۶</span>
          </p>
        </div>

        <div className="about-side">
          {/* TODO: update each field */}
          <div className="kv">
            <Label>BASED</Label>
            <Mono>Toronto · CA</Mono>
          </div>
          <div className="kv">
            <Label>STUDYING</Label>
            <Mono>CS · Design</Mono>
          </div>
          <div className="kv">
            <Label>INTERESTS</Label>
            <Mono>Systems, interfaces</Mono>
          </div>
          <div className="kv">
            <Label>READS</Label>
            <Mono>Docs, long essays</Mono>
          </div>
          <div className="kv">
            <Label>TYPE</Label>
            <Mono>JetBrains Mono</Mono>
          </div>
          <div className="kv">
            <Label>VIBE</Label>
            <Mono>ASCII clouds ✦</Mono>
          </div>
        </div>
      </div>

      <window.TerminalNote title="NOTES.TXT" kao="(｡◕‿◕｡)">
        {/* TODO: update your own manifesto / values */}
        <p>
          <strong>1.</strong> Simplicity over cleverness. <strong>2.</strong> Monospace is honest.
          <strong>3.</strong> Animation should explain, not distract. <strong>4.</strong> Design
          is craft. <strong>5.</strong> Cute is not unserious.
        </p>
      </window.TerminalNote>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// WORK — project list with hover states
// ─────────────────────────────────────────────────────────────

// TODO: replace with your own projects
const PROJECTS = [
  {
    idx: "001", year: "2025",
    title: "Project One",
    client: "Personal",
    role: "Design + Engineering",
    tags: ["web", "design"],
    blurb: "TODO: describe this project in one or two sentences. What problem did it solve? What was interesting about it?",
  },
  {
    idx: "002", year: "2025",
    title: "Project Two",
    client: "Coursework",
    role: "Developer",
    tags: ["systems", "research"],
    blurb: "TODO: describe this project in one or two sentences.",
  },
  {
    idx: "003", year: "2024",
    title: "Project Three",
    client: "Self-initiated",
    role: "Designer",
    tags: ["interface", "experiment"],
    blurb: "TODO: describe this project in one or two sentences.",
  },
];

function Work() {
  const [hover, setHover] = useState(null);
  return (
    <section className="work" data-screen-label="03 Work">
      <window.AsciiDivider label="SELECTED WORK" sublabel="精选作品 · PROJECTS" />
      <div className="section-head">
        <Mono className="page-num">/ 03 — SELECTED WORK <span className="jp">精选</span></Mono>
        <Label>A LIST OF THINGS <span className="kaomoji-inline">⌐■_■</span></Label>
      </div>

      <ol className="project-list">
        {PROJECTS.map((p, i) => (
          <li
            key={p.idx}
            className={`project-row ${hover === i ? "is-hover" : ""} ${hover != null && hover !== i ? "is-dim" : ""}`}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <div className="project-row-inner">
              <Mono className="project-idx">{p.idx}</Mono>
              <Mono className="project-year">{p.year}</Mono>
              <div className="project-title">
                <h3>{p.title}</h3>
                <Mono className="project-client">{p.client} · {p.role}</Mono>
              </div>
              <div className="project-tags">
                {p.tags.map(t => <Mono key={t} className="tag">[{t}]</Mono>)}
              </div>
              <Mono className="project-arrow">→</Mono>
            </div>
            <div className="project-expand">
              <div className="project-expand-inner">
                <p>{p.blurb}</p>
                <div className="project-expand-meta">
                  <Mono>VIEW PROJECT ↗</Mono>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// CONTACT / FOOTER
// ─────────────────────────────────────────────────────────────

function Contact() {
  const fieldRef = useRef(null);
  useEffect(() => {
    if (!fieldRef.current) return;
    const canvas = new window.AsciiArt.AsciiCanvas(fieldRef.current, {
      cols: 120, rows: 22,
      ramp: " ····:::+=*#",
      generator: (x, y, t) => {
        const u = x / 120, v = y / 22;
        return 0.15 + Math.sin(u * 8 + v * 3 + t * 0.0008) * 0.12;
      }
    });
    return () => cancelAnimationFrame(canvas._raf);
  }, []);

  const [copied, setCopied] = useState(false);
  const EMAIL = "siqiqin6@gmail.com"; // TODO: update to your public email
  const copyMail = () => {
    navigator.clipboard?.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="contact" data-screen-label="04 Contact">
      <pre ref={fieldRef} className="ascii-field-bottom" aria-hidden="true" />

      <window.AsciiDivider label="CONTACT" sublabel="联系 · GET IN TOUCH" />
      <div className="section-head">
        <Mono className="page-num">/ 04 — CONTACT <span className="jp">联系</span></Mono>
        <Label>END OF DOCUMENT <span className="kaomoji-inline">(*ﾟ▽ﾟ)ﾉ</span></Label>
      </div>

      <div className="contact-grid">
        <h2 className="contact-headline">
          Say hello —<br/>
          I don't bite.<br/>
          <span style={{ fontSize: "0.55em", color: "var(--ink-60)", fontWeight: 400 }}>usually.</span>
        </h2>

        <div className="contact-side">
          <button className="contact-mail" onClick={copyMail}>
            <Mono className="contact-mail-label">{copied ? "COPIED ✓" : "EMAIL ↗ CLICK TO COPY"}</Mono>
            <span className="contact-mail-addr">{EMAIL}</span>
          </button>
          <div className="contact-links">
            {/* TODO: fill in your actual links */}
            <a href="https://github.com/tangghulu" target="_blank"><Mono>↗ GITHUB / TANGGHULU</Mono></a>
            <a href="#"><Mono>↗ LINKEDIN / TODO</Mono></a>
            <a href="#"><Mono>↗ READ.CV / TODO</Mono></a>
          </div>
        </div>
      </div>

      <div className="colophon">
        <div className="colophon-col">
          <Label>COLOPHON</Label>
          <Mono>Set in JetBrains Mono + Noto Sans SC. Built by hand. ASCII art generated client-side at runtime.</Mono>
        </div>
        <div className="colophon-col">
          <Label>LAST UPDATED</Label>
          <Mono>{new Date().toISOString().slice(0,10)}</Mono>
        </div>
        <div className="colophon-col">
          <Label>© 2026</Label>
          <Mono>JASMINE QIN ✦</Mono>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// SIDE RAIL
// ─────────────────────────────────────────────────────────────

function SideRail() {
  const [scroll, setScroll] = useState(0);
  useEffect(() => {
    const onS = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScroll(Math.min(1, Math.max(0, window.scrollY / max)));
    };
    onS();
    window.addEventListener("scroll", onS, { passive: true });
    return () => window.removeEventListener("scroll", onS);
  }, []);

  const ticks = 24;
  const active = Math.floor(scroll * ticks);

  return (
    <aside className="side-rail">
      <Mono className="side-rail-glyph">J·Q</Mono>
      <div className="side-rail-ticks">
        {Array.from({ length: ticks }).map((_, i) => (
          <span key={i} className={`tick ${i <= active ? "tick--on" : ""}`}>
            {i === active ? "▶" : i < active ? "│" : "·"}
          </span>
        ))}
      </div>
      <Mono className="side-rail-pct">{String(Math.round(scroll * 100)).padStart(3, "0")}</Mono>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────────────────────

const SECTIONS = [
  { sel: ".hero",    name: "Index",   jp: "索引", idx: 1 },
  { sel: ".about",   name: "About",   jp: "关于", idx: 2 },
  { sel: ".work",    name: "Work",    jp: "精选", idx: 3 },
  { sel: ".contact", name: "Contact", jp: "联系", idx: 4 },
];

function App() {
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", ACCENT_MAP[t.accent] || ACCENT_MAP.cobalt);
    document.documentElement.style.setProperty("--pop",    POP_MAP[t.accent]    || POP_MAP.cobalt);
    document.documentElement.dataset.grain     = t.grain     ? "on" : "off";
    document.documentElement.dataset.scanlines = t.scanlines ? "on" : "off";
    document.documentElement.dataset.katakana  = t.katakana  ? "on" : "off";
    document.documentElement.dataset.density   = t.density;
  }, [t]);

  const [currentSection, setCurrentSection] = useState(SECTIONS[0]);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + 200;
      let cur = SECTIONS[0];
      for (const s of SECTIONS) {
        const el = document.querySelector(s.sel);
        if (el && el.offsetTop <= y) cur = s;
      }
      setCurrentSection(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <window.StatusBar />
      <TopBar
        section={currentSection.name}
        sectionJp={currentSection.jp}
        sectionIdx={currentSection.idx}
        total={SECTIONS.length}
      />
      <SideRail />
      <window.NowPlaying />
      <window.AsciiPet />
      <main className="doc">
        <Hero />
        <About />
        <Work />
        <Contact />
      </main>

      <window.TweaksPanel title="Tweaks ✦">
        <window.TweakSection label="Accent" />
        <window.TweakColor
          label="Hue"
          value={ACCENT_MAP[t.accent]}
          options={[ACCENT_MAP.cobalt, ACCENT_MAP.azure, ACCENT_MAP.ink, ACCENT_MAP.neon]}
          onChange={(v) => {
            const name = Object.keys(ACCENT_MAP).find(k => ACCENT_MAP[k] === v) || "cobalt";
            setTweak("accent", name);
          }}
        />
        <window.TweakSection label="ASCII" />
        <window.TweakRadio
          label="Density"
          value={t.density}
          options={["sparse", "medium", "dense"]}
          onChange={(v) => setTweak("density", v)}
        />
        <window.TweakToggle label="Chinese labels" value={t.katakana} onChange={(v) => setTweak("katakana", v)} />
        <window.TweakSection label="FX" />
        <window.TweakToggle label="Paper grain"    value={t.grain}     onChange={(v) => setTweak("grain", v)} />
        <window.TweakToggle label="Scanlines (CRT)" value={t.scanlines} onChange={(v) => setTweak("scanlines", v)} />
      </window.TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
