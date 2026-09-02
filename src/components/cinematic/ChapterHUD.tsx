import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";

const CHAPTERS = [
  { label: "I · LAKE", progress: 0.05 },
  { label: "II · LIBRARY", progress: 0.23 },
  { label: "III · GALLERY", progress: 0.40 },
  { label: "IV · LETTER", progress: 0.58 },
  { label: "V · WISH", progress: 0.78 },
  { label: "VI · DREAM", progress: 0.95 },
];

/**
 * micro-HUD pinned at the top of the viewport with chapter jumping.
 */
export function ChapterHUD() {
  const { scrollYProgress } = useScroll();
  const [menuOpen, setMenuOpen] = useState(false);

  const idx = useTransform(scrollYProgress, (v) => {
    let i = 0;
    if (v < 0.15) i = 0;
    else if (v < 0.33) i = 1;
    else if (v < 0.51) i = 2;
    else if (v < 0.69) i = 3;
    else if (v < 0.89) i = 4;
    else i = 5;
    return CHAPTERS[i].label;
  });

  const num = useTransform(scrollYProgress, (v) => {
    let i = 1;
    if (v < 0.15) i = 1;
    else if (v < 0.33) i = 2;
    else if (v < 0.51) i = 3;
    else if (v < 0.69) i = 4;
    else if (v < 0.89) i = 5;
    else i = 6;
    return String(i).padStart(2, "0");
  });

  const pct = useTransform(scrollYProgress, (v) => `${Math.round(v * 100)}%`);
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const jumpTo = (targetProgress: number) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: maxScroll * targetProgress,
      behavior: "smooth",
    });
    setMenuOpen(false);
  };

  return (
    <div className="fixed inset-x-0 top-0 z-[60] flex flex-col">
      <div className="flex items-center justify-between gap-2 px-3 py-2 font-mono text-[8px] uppercase tracking-[0.25em] text-[var(--cream)]/80 mix-blend-screen sm:px-5 sm:py-3 sm:text-[10px] sm:tracking-[0.3em]">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--lotus)] shadow-[0_0_10px_var(--lotus)]" />
          <span className="truncate">oishi · a little universe</span>
        </div>

        {/* Clickable chapter switcher */}
        <div className="pointer-events-auto relative flex shrink-0 items-center gap-1.5 sm:gap-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-1.5 rounded-full border border-[var(--rose-gold)]/30 bg-black/40 px-2.5 py-1 text-[var(--cream)] transition-all hover:border-[var(--rose-gold)] hover:bg-black/60"
            title="Click to jump to a chapter"
          >
            <motion.span>{num}</motion.span>
            <span className="opacity-40">/</span>
            <motion.span>{idx}</motion.span>
            <span className="text-[9px] text-[var(--rose-gold)]">▾</span>
          </button>
          <span className="hidden opacity-40 sm:inline">·</span>
          <motion.span className="hidden tabular-nums sm:inline">{pct}</motion.span>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 rounded-lg border border-[var(--rose-gold)]/40 bg-[oklch(0.16_0.05_295/0.95)] p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md">
              <div className="px-2 py-1 text-[8px] tracking-widest text-[var(--rose-gold)]/70">
                JUMP TO CHAPTER
              </div>
              {CHAPTERS.map((ch, i) => (
                <button
                  key={ch.label}
                  onClick={() => jumpTo(ch.progress)}
                  className="w-full text-left rounded px-2 py-1.5 text-[9px] tracking-wider text-[var(--cream)]/90 hover:bg-[var(--rose-gold)]/20 hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>{ch.label}</span>
                  <span className="text-[8px] opacity-40">CH {i + 1}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* progress hairline */}
      <motion.div
        className="h-px origin-left bg-gradient-to-r from-[var(--lotus)] via-[var(--rose-gold)] to-[var(--lavender)]"
        style={{ scaleX: barScale, opacity: 0.7 }}
      />
    </div>
  );
}
