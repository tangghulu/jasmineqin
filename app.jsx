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
        <Label>COMMUNITY MGR <Mono className="jp">// 社区</Mono></Label>
        <Label>BACKBOARD.IO</Label>
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
            <Mono className="hero-coord">43.6532° N, 79.3832° W</Mono>
            <Mono className="hero-coord dim">多伦多 · TORONTO</Mono>
          </div>
        </div>

        <h1 className="hero-headline">
          Jasmine Qin<br/>
          <span className="hero-headline-accent">strategy, systems,<br/>and the people in between.</span>
        </h1>

        <div className="hero-footer">
          <div className="hero-footer-col">
            <Label>NOW <span className="jp">// 现在</span></Label>
            <div className="hero-footer-line">Community Manager · Backboard.io</div>
            <div className="hero-footer-line muted">Computing (Hons) · Queen's '28 · 3.77 GPA</div>
          </div>
          <div className="hero-footer-col hero-footer-col--mid">
            <Label>SEEKING <span className="jp">// 目标</span></Label>
            <Mono className="hero-running">▸ consulting internship · 2027</Mono>
            <Mono className="hero-running dim">▸ open to: strategy · ops · tech</Mono>
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
        <Label>WHO IS THIS PERSON</Label>
      </div>

      <div className="about-grid">
        <div className="about-headline">
          <h2>
            I find the problem<br/>
            before building<br/>
            the <em>solution.</em>
          </h2>
          <Mono className="about-headline-caption">— computing student, strategy-first ✦</Mono>
        </div>

        <div className="about-body">
          <p>
            I'm <strong>Jasmine Qin</strong> — a Computing (Honours) student at Queen's University
            (3.77 GPA, Dean's List) interested in the intersection of technology and business strategy.
            I'm bilingual in English and Mandarin and targeting consulting for Summer 2027.
          </p>
          <p>
            I've co-led go-to-market strategy at a tech startup, relaunched a dormant entrepreneurship
            summit, built outreach infrastructure engaging 100+ organizations, and shipped production
            features used by real people — all before my second year.
          </p>
          <p>
            I'm drawn to structured problem-solving: the kind of work where clarity is the
            deliverable and the details are what separate a good answer from the right one.
          </p>
        </div>

        <div className="about-side">
          <div className="kv">
            <Label>BASED</Label>
            <Mono>Toronto · CA</Mono>
          </div>
          <div className="kv">
            <Label>STUDYING</Label>
            <Mono>Computing · Queen's '28</Mono>
          </div>
          <div className="kv">
            <Label>GPA</Label>
            <Mono>3.77 · Dean's List</Mono>
          </div>
          <div className="kv">
            <Label>LANGUAGES</Label>
            <Mono>English · Mandarin</Mono>
          </div>
          <div className="kv">
            <Label>TOOLS</Label>
            <Mono>Figma · Next.js · Jira</Mono>
          </div>
          <div className="kv">
            <Label>SEEKING</Label>
            <Mono>Consulting '27 ✦</Mono>
          </div>
        </div>
      </div>

      <window.TerminalNote title="NOTES.TXT">
        <p>
          <strong>1.</strong> Structure before speed. <strong>2.</strong> Data tells a story — find the narrative.
          <strong>3.</strong> Clear communication is a competitive advantage. <strong>4.</strong> Leadership
          is infrastructure. <strong>5.</strong> Details compound.
        </p>
      </window.TerminalNote>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// WORK — project list with hover states
// ─────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    idx: "001", year: "2026",
    title: "Backboard.io",
    client: "Remote",
    role: "Community Manager",
    tags: ["strategy", "GTM", "ops"],
    blurb: "Managed 8 engineering interns across concurrent workstreams while co-leading go-to-market strategy with senior leadership. Synthesized developer feedback into positioning frameworks and delivered live product demos to external audiences.",
  },
  {
    idx: "002", year: "2025",
    title: "Kingston AI Collective",
    client: "Kingston, ON",
    role: "Director of Outreach & Logistics",
    tags: ["outreach", "partnerships", "events"],
    blurb: "Built outreach infrastructure from scratch — CRM tracker, email pipelines, and engagement strategy — engaging 100+ companies, researchers, and policymakers. Secured 10+ strategic partnerships and directed large-scale event execution across a 7-person team.",
  },
  {
    idx: "003", year: "2025",
    title: "Queen's Startup Summit",
    client: "Queen's University",
    role: "Co-Chair",
    tags: ["leadership", "entrepreneurship"],
    blurb: "Relaunched QSS after a year of inactivity, rebuilding the founding team and restoring relationships with investors and mentors. Managed a cross-functional director team across 5 departments from sponsorship to day-of execution.",
  },
  {
    idx: "004", year: "2025",
    title: "Queen's Women in Computing",
    client: "Queen's University",
    role: "Web Developer",
    tags: ["next.js", "tailwind", "design"],
    blurb: "Proposed, designed, and shipped 3 features — events page, photo gallery, and Meet the Team — using Next.js and Tailwind CSS. Translated club requirements into mobile-optimized components, improving usability and engagement.",
  },
  {
    idx: "005", year: "2025",
    title: "Sophena Marketing",
    client: "Aurora, ON",
    role: "Technology Intern",
    tags: ["marketing", "figma", "strategy"],
    blurb: "Developed and executed a scalable social media and branding strategy, driving growth in impressions across client platforms. Designed client-facing presentations in Figma, translating data insights into clear visual narratives.",
  },
];

function Work() {
  const [hover, setHover] = useState(null);
  return (
    <section className="work" data-screen-label="03 Work">
      <window.AsciiDivider label="SELECTED WORK" sublabel="精选作品 · EXPERIENCE & LEADERSHIP" />
      <div className="section-head">
        <Mono className="page-num">/ 03 — SELECTED WORK <span className="jp">精选</span></Mono>
        <Label>A LIST OF THINGS</Label>
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
  const EMAIL = "jasmine.qin@queensu.ca";
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
        <Label>END OF DOCUMENT</Label>
      </div>

      <div className="contact-grid">
        <h2 className="contact-headline">
          I love meeting<br/>
          new people,<br/>
          <span className="hero-headline-accent">come say hi!</span>
        </h2>

        <div className="contact-side">
          <button className="contact-mail" onClick={copyMail}>
            <Mono className="contact-mail-label">{copied ? "COPIED ✓" : "EMAIL ↗ CLICK TO COPY"}</Mono>
            <span className="contact-mail-addr">{EMAIL}</span>
          </button>
          <div className="contact-links">
            <a href="https://x.com/tangghulu" target="_blank"><Mono>↗ X / @TANGGHULU</Mono></a>
            <a href="https://github.com/tangghulu" target="_blank"><Mono>↗ GITHUB / TANGGHULU</Mono></a>
          </div>
        </div>
      </div>

      <div className="colophon">
        <div className="colophon-col"></div>
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
