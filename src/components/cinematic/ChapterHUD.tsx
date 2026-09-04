import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { MusicButton } from "./MusicPlayer";

const CHAPTERS = [
  { label: "I · LAKE", progress: 0.04 },
  { label: "II · LIBRARY", progress: 0.20 },
  { label: "III · GALLERY", progress: 0.37 },
  { label: "IV · REEL", progress: 0.54 },
  { label: "V · LETTER", progress: 0.70 },
  { label: "VI · WISH", progress: 0.86 },
  { label: "VII · DREAM", progress: 0.96 },
];

/**
 * micro-HUD pinned at the top of the viewport with chapter jumping.
 * Mobile: tap outside dropdown to close; dropdown shifts left on small screens.
 */
export function ChapterHUD() {
  const { scrollYProgress } = useScroll();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const idx = useTransform(scrollYProgress, (v) => {
    let i = 0;
    if (v < 0.12) i = 0;
    else if (v < 0.28) i = 1;
    else if (v < 0.45) i = 2;
    else if (v < 0.62) i = 3;
    else if (v < 0.78) i = 4;
    else if (v < 0.92) i = 5;
    else i = 6;
    return CHAPTERS[i].label;
  });

  const num = useTransform(scrollYProgress, (v) => {
    let i = 1;
    if (v < 0.12) i = 1;
    else if (v < 0.28) i = 2;
    else if (v < 0.45) i = 3;
    else if (v < 0.62) i = 4;
    else if (v < 0.78) i = 5;
    else if (v < 0.92) i = 6;
    else i = 7;
    return String(i).padStart(2, "0");
  });

  const pct = useTransform(scrollYProgress, (v) => `${Math.round(v * 100)}%`);
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Close dropdown on outside tap/click
  useEffect(() => {
    if (!menuOpen) return;
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [menuOpen]);

  const jumpTo = (targetProgress: number) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: maxScroll * targetProgress,
      behavior: "smooth",
    });
    setMenuOpen(false);
  };

  return (
    <div className="fixed inset-x-0 top-0 z-[60] flex flex-col safe-top">
      <div className="flex items-center justify-between gap-2 px-3 py-2 font-mono text-[8px] uppercase tracking-[0.25em] text-[var(--cream)]/80 mix-blend-screen sm:px-5 sm:py-3 sm:text-[10px] sm:tracking-[0.3em]">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--lotus)] shadow-[0_0_10px_var(--lotus)]" />
          <span className="truncate">oishi · a little universe</span>
        </div>

        {/* Right side controls: Music button + Clickable chapter switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <MusicButton />

          <div ref={menuRef} className="pointer-events-auto relative flex shrink-0 items-center gap-1.5 sm:gap-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-1.5 rounded-full border border-[var(--rose-gold)]/30 bg-black/40 px-2.5 py-1 text-[var(--cream)] transition-all hover:border-[var(--rose-gold)] hover:bg-black/60 active:scale-95"
            title="Click to jump to a chapter"
            aria-expanded={menuOpen}
            aria-label="Chapter menu"
          >
            <motion.span>{num}</motion.span>
            <span className="opacity-40">/</span>
            <motion.span>{idx}</motion.span>
            <span className="text-[9px] text-[var(--rose-gold)]">{menuOpen ? "▴" : "▾"}</span>
          </button>
          <span className="hidden opacity-40 sm:inline">·</span>
          <motion.span className="hidden tabular-nums sm:inline">{pct}</motion.span>

          {/* Dropdown Menu — anchored to keep inside screen on mobile */}
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-[var(--rose-gold)]/40 bg-[oklch(0.16_0.05_295/0.97)] p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md"
              style={{
                // Ensure dropdown doesn't go off-screen on very small phones
                maxWidth: "calc(100vw - 20px)",
                right: 0,
              }}
            >
              <div className="px-2 py-1 text-[8px] tracking-widest text-[var(--rose-gold)]/70">
                JUMP TO CHAPTER
              </div>
              {CHAPTERS.map((ch, i) => (
                <button
                  key={ch.label}
                  onClick={() => jumpTo(ch.progress)}
                  className="w-full text-left rounded-lg px-2 py-2 text-[10px] tracking-wider text-[var(--cream)]/90 hover:bg-[var(--rose-gold)]/20 hover:text-white transition-colors flex items-center justify-between active:bg-[var(--rose-gold)]/30"
                >
                  <span>{ch.label}</span>
                  <span className="text-[8px] opacity-40">CH {i + 1}</span>
                </button>
              ))}
            </motion.div>
          )}
          </div>
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
