import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Petals } from "./Petals";
import { Particles } from "./Particles";
import { Lotus } from "./Lotus";

import img2021 from "@/assets/oishi/library_2021.jpg";
import img2022 from "@/assets/oishi/library_2022.jpg";
import img2023 from "@/assets/oishi/library_2023.jpg";
import img2024 from "@/assets/oishi/library_2024.jpg";
import img2025 from "@/assets/oishi/library_2025.jpg";
import img2026 from "@/assets/oishi/library_2026.jpg";

interface LibraryMemory {
  year: string;
  subtitle: string;
  src: string;
  reflection: string;
  imgPosition?: string;
}

const MEMORIES: LibraryMemory[] = [
  {
    year: "2021",
    subtitle: "Endless Skies",
    src: img2024,
    reflection:
      "In 2021, with a tender white flower tucked behind your ear beneath the open azure sky, gentle and breathtakingly fearless. A reminder that each year adds greater beauty to your story, and the best is yet to come.",
    imgPosition: "object-top",
  },
  {
    year: "2022",
    subtitle: "Royal Blooms",
    src: img2023,
    reflection:
      "In 2022, enveloped in royal purple amidst cascading floral blooms, sitting like royalty with quiet poise. Your joyful laughter brought warmth to every soul, echoing with purest elegance.",
    imgPosition: "object-top",
  },
  {
    year: "2023",
    subtitle: "Boundless Horizons",
    src: img2022,
    reflection:
      "In 2023, wearing serene sky blue with your campus lanyard and sparkling eyes, you walked forward into your dreams—brilliant, determined, and illuminating the paths of everyone fortunate enough to know you.",
    imgPosition: "object-top",
  },
  {
    year: "2024",
    subtitle: "Golden Grace",
    src: img2021,
    reflection:
      "In 2024, draped in radiant yellow and bathed in soft afternoon light, you held a calm, effortless grace. With that gentle smile and timeless charm, you turned every passing second into poetry.",
    imgPosition: "object-top",
  },
  {
    year: "2025",
    subtitle: "Sweet Chapters",
    src: img2025,
    reflection:
      "In 2025, glowing in radiant pink amidst baskets of books, memories, and handwritten dreams. A heart that cherishes every small joy and turns every quiet celebration into pure magic.",
    imgPosition: "object-[center_20%]",
  },
  {
    year: "2026",
    subtitle: "Written in Wishes",
    src: img2026,
    reflection:
      "In 2026, resting softly before a wall of a thousand heartfelt wishes, timeless in burgundy and calm contemplation. The world around you may write countless dreams, but none shine as brightly as yours.",
    imgPosition: "object-[center_35%]",
  },
];

/** Chapter 1 — floating fantasy library above a lotus lake. */
export function SceneLibrary() {
  const isMobile = useRef(typeof window !== "undefined" && window.innerWidth < 768).current;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  const [hovered, setHovered] = useState<number | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<LibraryMemory | null>(null);

  return (
    <section ref={ref} className="relative min-h-[120vh] overflow-hidden">
      {/* warm library background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, oklch(0.30 0.07 50) 0%, oklch(0.18 0.05 320) 60%, oklch(0.10 0.04 290) 100%)",
        }}
      />

      {/* god rays — no blur on mobile */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "conic-gradient(from 200deg at 50% -10%, transparent 0deg, oklch(0.84 0.09 55 / 0.4) 30deg, transparent 60deg, transparent 360deg)",
          mixBlendMode: "screen",
          ...(isMobile ? {} : { filter: "blur(8px)" }),
        }}
      />

      <Particles count={35} color="oklch(0.84 0.09 55)" />
      <Petals count={isMobile ? 5 : 12} />

      {/* chapter heading */}
      <motion.div style={{ y }} className="relative z-10 pt-28 text-center px-6">
        <p className="text-xs font-light uppercase tracking-[0.5em] text-[var(--rose-gold)]/70">Chapter One</p>
        <h2 className="mt-4 font-display text-[clamp(2rem,6vw,4.5rem)] font-light text-gold-shine animate-shimmer">
          The Lotus Library
        </h2>
        <p className="mx-auto mt-4 max-w-xl font-display text-sm italic text-[var(--cream)]/70 md:text-base">
          where each chapter captures a year of grace, dreams, and memories.
        </p>
      </motion.div>

      {/* Photo cards grid — compact sizing */}
      <div className="relative z-10 mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-x-6 gap-y-12 px-6 pb-28 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
        {MEMORIES.map((mem, i) => (
          <motion.div
            key={mem.year}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, delay: (i % 3) * 0.12, ease: [0.22, 1, 0.36, 1] }}
            onHoverStart={() => setHovered(i)}
            onHoverEnd={() => setHovered(null)}
            onClick={() => setSelectedMemory(mem)}
            className="group relative cursor-pointer flex flex-col items-center w-full max-w-[210px]"
            style={{ perspective: "1200px" }}
          >
            {/* Compact Photo card wrapper with 3D float */}
            <motion.div
              animate={isMobile ? {} : {
                y: hovered === i ? -10 : [0, -5, 0],
                rotateY: hovered === i ? -4 : 0,
                rotateX: hovered === i ? 2 : 0,
              }}
              transition={{
                y: hovered === i
                  ? { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
                  : { duration: 5 + (i % 3) * 0.8, repeat: Infinity, ease: "easeInOut" },
                rotateY: { duration: 0.4 },
                rotateX: { duration: 0.4 },
              }}
              className="relative w-full max-w-[185px] aspect-[3/4]"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Outer frame / polaroid border */}
              <div
                className="absolute inset-0 rounded-xl overflow-hidden transition-all duration-500"
                style={{
                  padding: "6px 6px 24px 6px",
                  background: "linear-gradient(160deg, oklch(0.28 0.06 310) 0%, oklch(0.16 0.04 290) 100%)",
                  boxShadow: hovered === i
                    ? "0 24px 48px -10px oklch(0 0 0 / 0.8), 0 0 0 1.5px oklch(0.84 0.09 55 / 0.9), 0 0 35px oklch(0.84 0.09 55 / 0.4)"
                    : "0 16px 32px -8px oklch(0 0 0 / 0.65), 0 0 0 1px oklch(0.84 0.09 55 / 0.35)",
                }}
              >
                {/* Photo inside the frame */}
                <div className="relative w-full h-full rounded-lg overflow-hidden bg-neutral-900">
                  <motion.img
                    src={mem.src}
                    alt={`Memory ${mem.year}`}
                    className={`absolute inset-0 w-full h-full object-cover ${mem.imgPosition || "object-top"}`}
                    animate={{ scale: hovered === i ? 1.06 : 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  />

                  {/* Dreamy color overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                    style={{
                      background: "linear-gradient(to bottom, oklch(0.84 0.09 55 / 0.05) 0%, oklch(0.10 0.05 310 / 0.4) 100%)",
                      opacity: hovered === i ? 0.25 : 0.55,
                    }}
                  />

                  {/* Lotus top badge */}
                  <div className="absolute top-2 left-0 right-0 flex justify-center z-10">
                    <motion.div
                      animate={{ opacity: hovered === i ? 1 : 0.8, scale: hovered === i ? 1.15 : 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Lotus size={18} glow={hovered === i} />
                    </motion.div>
                  </div>
                </div>

                {/* Year label in the polaroid bottom strip */}
                <div className="absolute bottom-0.5 left-0 right-0 h-[22px] flex items-center justify-between px-3">
                  <span
                    className="font-display text-[9px] uppercase tracking-[0.3em] font-semibold"
                    style={{ color: "oklch(0.84 0.09 55 / 0.95)" }}
                  >
                    Year · {mem.year}
                  </span>
                  <span
                    className="font-mono text-[8px] uppercase tracking-[0.15em] opacity-60 text-[var(--cream)]"
                  >
                    Vol. 0{i + 1}
                  </span>
                </div>
              </div>

              {/* Ambient glow halo */}
              <motion.div
                animate={{ opacity: hovered === i ? 1 : 0 }}
                transition={{ duration: 0.35 }}
                className="pointer-events-none absolute -inset-2.5 rounded-xl"
                style={{
                  background: "radial-gradient(ellipse at 50% 50%, oklch(0.84 0.09 55 / 0.35) 0%, transparent 70%)",
                  ...(isMobile ? {} : { filter: "blur(14px)" }),
                }}
              />
            </motion.div>

            {/* Year title & Thoughtful Text below the photo */}
            <div className="mt-4 w-full flex flex-col items-center text-center px-1">
              <motion.div
                animate={{
                  scale: hovered === i ? 1.04 : 1,
                  color: hovered === i ? "oklch(0.92 0.12 75)" : "oklch(0.84 0.09 55)",
                }}
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-[0.18em] uppercase font-display border border-[var(--lotus)]/30 bg-[var(--night)]/40 mb-1.5"
              >
                <span>{mem.year}</span>
                <span className="opacity-40">·</span>
                <span className="text-[9px] tracking-[0.12em] opacity-85 text-[var(--cream)]">{mem.subtitle}</span>
              </motion.div>

              <motion.p
                initial={false}
                animate={{
                  opacity: hovered === i ? 1 : 0.75,
                  y: hovered === i ? 0 : 2,
                }}
                transition={{ duration: 0.3 }}
                className="font-display text-[0.78rem] leading-relaxed italic max-w-[250px]"
                style={{
                  color: hovered === i ? "oklch(0.96 0.04 80)" : "oklch(0.88 0.04 65 / 0.8)",
                  textShadow: hovered === i ? "0 0 14px oklch(0.84 0.09 55 / 0.5)" : "none",
                  transition: "color 0.3s ease, text-shadow 0.3s ease",
                }}
              >
                "{mem.reflection}"
              </motion.p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Enlarged Photo Modal / Lightbox */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-[var(--night)]/85 backdrop-blur-xl p-4 sm:p-6"
            onClick={() => setSelectedMemory(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 15, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-md w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[oklch(0.24_0.06_310)] to-[oklch(0.14_0.04_290)] p-5 sm:p-6 border border-[oklch(0.84_0.09_55/0.4)] shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_var(--lotus)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedMemory(null)}
                className="absolute top-3.5 right-3.5 z-20 text-[10px] tracking-[0.2em] uppercase text-[var(--cream)]/70 hover:text-[var(--cream)] bg-black/40 px-2.5 py-1 rounded-full border border-white/10 transition"
              >
                Close ✕
              </button>

              <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden shadow-2xl mb-4 bg-neutral-900">
                <img
                  src={selectedMemory.src}
                  alt={`Memory ${selectedMemory.year}`}
                  className={`w-full h-full object-cover ${selectedMemory.imgPosition || "object-top"}`}
                />
              </div>

              <div className="text-center">
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium tracking-[0.2em] uppercase text-[var(--lotus)] border border-[var(--lotus)]/40 bg-[var(--night)]/50 mb-2.5">
                  <span>Year · {selectedMemory.year}</span>
                  <span className="opacity-40">·</span>
                  <span className="text-[var(--cream)]/90">{selectedMemory.subtitle}</span>
                </div>
                <p className="font-display text-sm sm:text-base italic leading-relaxed text-[var(--cream)]">
                  "{selectedMemory.reflection}"
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
