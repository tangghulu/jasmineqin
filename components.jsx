const { useState, useEffect, useRef } = React;

// Extra UI: status bar, now-playing widget, ascii pet, terminal notes,
// dividers. Kept separate from app.jsx so the main file stays readable.

// ─────────────────────────────────────────────────────────────
// STATUS BAR — top sliver, terminal-style
// ─────────────────────────────────────────────────────────────

function StatusBar() {
  const [t, setT] = useState(new Date());
  const [blink, setBlink] = useState(true);
  useEffect(() => {
    const i = setInterval(() => setT(new Date()), 1000);
    const j = setInterval(() => setBlink(b => !b), 600);
    return () => { clearInterval(i); clearInterval(j); };
  }, []);
  const time = t.toLocaleTimeString("en-GB", { hour12: false });

  return (
    <div className="statusbar">
      <div className="statusbar-cell">
        <span className={`status-dot ${blink ? "on" : "off"}`} />
        <span className="mono">SYS::ONLINE</span>
        <span className="mono dim">// 系统·在线</span>
      </div>
      <div className="statusbar-cell">
        <span className="mono dim">UPTIME</span>
        <span className="mono">{time}</span>
      </div>
      <div className="statusbar-cell">
        <span className="mono dim">CONN</span>
        <span className="mono">●●●●○ 4/5</span>
      </div>
      <div className="statusbar-cell statusbar-cell--right">
        <span className="mono dim">v1.0.0 · BUILD {new Date().toISOString().slice(2,10).replace(/-/g,"")}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// NOW PLAYING — floating terminal card
// ─────────────────────────────────────────────────────────────

const TRACKS = [
  { artist: "Noah Kahan",        title: "Maine",        bpm: 150, mood: "(๑˃ᴗ˂)ﻭ" },
  { artist: "Malcolm Todd",      title: "Breathe",      bpm: 78,  mood: "(´｡• ᵕ •｡`)" },
  { artist: "Backseat Lovers",   title: "Maple Syrup",  bpm: 140, mood: "✧･ﾟ: *✧" },
  { artist: "Ichiko Aoba",       title: "Bouquet",      bpm: 72,  mood: "( ◜‿◝ )♡" },
  { artist: "The Marias",        title: "Sienna",       bpm: 88,  mood: "₍ᐢ. .ᐢ₎" },
];

function NowPlaying() {
  const [idx, setIdx] = useState(0);
  const [pos, setPos] = useState(38);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const i = setInterval(() => setPos(p => (p >= 100 ? 0 : p + 0.7)), 240);
    return () => clearInterval(i);
  }, []);
  const t = TRACKS[idx];
  const bars = 18;
  const filled = Math.round((pos / 100) * bars);

  if (!visible) return null;

  return (
    <aside className="now-playing">
      <div className="np-head">
        <span className="mono">┌─ NOW PLAYING ──────────</span>
        <button className="np-close" aria-label="close" onClick={() => setVisible(false)}>
          <span className="mono">[ ✕ ]</span>
        </button>
      </div>
      <div className="np-body">
        <div className="np-eq" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="np-eq-bar" style={{ animationDelay: `${i * 0.08}s` }} />
          ))}
        </div>
        <div className="np-track">
          <div className="np-title">{t.title}</div>
          <div className="np-artist mono">— {t.artist}</div>
        </div>
      </div>
      <div className="np-progress mono">
        <span className="np-bar">
          {"━".repeat(filled)}<span className="np-bar-head">◆</span>{"─".repeat(Math.max(0, bars - filled - 1))}
        </span>
      </div>
      <div className="np-foot mono">
        <span>{Math.floor(pos / 100 * 234)}s / 3:54</span>
        <span className="np-mood">{t.mood}</span>
        <span>{t.bpm} BPM</span>
      </div>
      <div className="mono dim np-bottom">└────────────────────────</div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────
// ASCII PET — kawaii mascot, idle animation
// ─────────────────────────────────────────────────────────────

const PET_FRAMES = [
  [
    "  ／＞ 　 ﾌ ",
    "  | 　_　_| ",
    " ／` ミ＿xノ ",
    " /　　　　 |",
    "/　 ヽ　　 ﾉ",
    "│　　|　|　|",
    "￣|　|￣|￣|",
  ],
  [
    "  ／＞ 　 ﾌ ",
    "  | 　-　-| ",
    " ／` ミ＿xノ ",
    " /　　　　 |",
    "/　 ヽ　　 ﾉ",
    "│　　|　|　|",
    "￣|　|￣|￣|",
  ],
  [
    "  ／＞ 　 ﾌ ✦",
    "  | 　^　^| ",
    " ／` ミ＿xノ ",
    " /　　　　 |",
    "/　 ヽ　　 ﾉ",
    "│　　|　|　|",
    "￣|　|￣|￣|",
  ],
];

function AsciiPet() {
  const [frame, setFrame] = useState(0);
  const [speech, setSpeech] = useState(null);
  const messages = [
    "nǐ hǎo (•‿•)",
    "i like grids",
    "type-set in love",
    "ʕ•ᴥ•ʔ ✦",
    "scroll slowly",
    "the ASCII is fine",
    "喵~",
    "jasmine.exe",
  ];

  useEffect(() => {
    let cancelled = false;
    const loop = async () => {
      while (!cancelled) {
        setFrame(0);
        await wait(2200 + Math.random() * 1500);
        setFrame(1);
        await wait(140);
        setFrame(0);
        await wait(1200);
        if (Math.random() < 0.4) {
          setFrame(2);
          setSpeech(messages[Math.floor(Math.random() * messages.length)]);
          await wait(2400);
          setSpeech(null);
        }
      }
    };
    loop();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="ascii-pet" onClick={() => {
      setFrame(2);
      setSpeech(messages[Math.floor(Math.random() * messages.length)]);
      setTimeout(() => setSpeech(null), 2200);
    }}>
      {speech && <div className="pet-speech mono">{speech}</div>}
      <pre className="pet-art">{PET_FRAMES[frame].join("\n")}</pre>
      <div className="mono pet-label">PET.SH // 猫</div>
    </div>
  );
}
function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─────────────────────────────────────────────────────────────
// ASCII DIVIDER
// ─────────────────────────────────────────────────────────────

function AsciiDivider({ label, sublabel }) {
  return (
    <div className="ascii-divider">
      <span className="divider-rule" aria-hidden="true" />
      {label && (
        <div className="divider-label-wrap">
          <span className="mono divider-label">{label}</span>
          {sublabel && <span className="mono divider-sublabel">{sublabel}</span>}
        </div>
      )}
      <span className="divider-rule" aria-hidden="true" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TERMINAL NOTE — boxed callout
// ─────────────────────────────────────────────────────────────

function TerminalNote({ title, children, kao }) {
  return (
    <div className="terminal-note">
      <div className="tn-head mono">
        <span>┌─ {title}</span>
        {kao && <span className="tn-kao">{kao}</span>}
      </div>
      <div className="tn-body">{children}</div>
      <div className="tn-foot mono">└─</div>
    </div>
  );
}

Object.assign(window, {
  StatusBar, NowPlaying, AsciiPet, AsciiDivider, TerminalNote
});
