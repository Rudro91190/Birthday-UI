import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useRef } from "react";
import { Petals } from "./Petals";
import { Particles } from "./Particles";
import { Lotus } from "./Lotus";
import { FloatingPhotos } from "./FloatingPhotos";
import { PHOTOS } from "./photos";

/** Chapter 5 — magical lotus garden + interactive birthday cake. */
export function SceneFinale() {
  const isMobile = useRef(typeof window !== "undefined" && window.innerWidth < 768).current;
  const [blown, setBlown] = useState(false);
  const confetti = useMemo(
    () =>
      Array.from({ length: 80 }).map((_, i) => ({
        i,
        cx: (Math.random() - 0.5) * 800,
        cy: -(200 + Math.random() * 500),
        color: ["var(--lotus)", "var(--rose-gold)", "var(--lavender)", "var(--cream)"][i % 4],
        size: 4 + Math.random() * 8,
        delay: Math.random() * 0.3,
      })),
    [],
  );

  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 50% 70%, oklch(0.30 0.10 320) 0%, oklch(0.15 0.06 295) 60%, oklch(0.08 0.03 285) 100%)",
      }} />

      {/* fireworks bursts — desktop only, too expensive on mobile */}
      {!isMobile && [20, 75, 50].map((l, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${l}%`, top: `${15 + i * 5}%` }}
          animate={{ scale: [0, 1.4, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 3, delay: i * 1.2, repeat: Infinity, repeatDelay: 4 }}
        >
          <div className="relative h-2 w-2">
            {Array.from({ length: 12 }).map((_, s) => (
              <span key={s} className="absolute left-1/2 top-1/2 h-px w-12 origin-left"
                style={{
                  background: "linear-gradient(90deg, var(--lotus), transparent)",
                  transform: `rotate(${s * 30}deg)`,
                  boxShadow: "0 0 8px var(--lotus)",
                }}
              />
            ))}
          </div>
        </motion.div>
      ))}

      <Particles count={isMobile ? 16 : 120} color="oklch(0.92 0.10 60)" />
      <Petals count={isMobile ? 6 : 28} />

      <FloatingPhotos
        photos={[
          { src: PHOTOS[10], left: "3%",  top: "18%", rotate: -7, caption: "make a wish" },
          { src: PHOTOS[11], left: "85%", top: "16%", rotate: 8, hideMobile: true, caption: "stardust spark" },
          { src: PHOTOS[12], left: "6%",  top: "70%", rotate: 5, caption: "dream catcher" },
          { src: PHOTOS[13], left: "84%", top: "72%", rotate: -6, hideMobile: true, caption: "forever glowing" },
        ]}
      />


      {/* heading */}
      <div className="relative z-10 pt-24 text-center px-6">
        <p className="text-xs font-light uppercase tracking-[0.5em] text-[var(--rose-gold)]">Chapter Four</p>
        <h2 className="mt-4 font-display text-[clamp(2rem,6vw,4.5rem)] font-light text-lotus-shine">
          The Birthday Finale
        </h2>
        <p className="mx-auto mt-4 max-w-md font-display text-sm italic text-[var(--cream)]/75 md:text-base">
          {blown ? "make every wish, my dear." : "tap the cake — make a wish."}
        </p>
      </div>

      {/* cake */}
      <div className="relative z-10 mx-auto mt-16 flex w-full max-w-md flex-col items-center px-6 pb-24">
        <motion.button
          onClick={() => setBlown(true)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="relative cursor-pointer"
          style={{ filter: "drop-shadow(0 30px 60px oklch(0.86 0.08 0 / 0.4))" }}
        >
          <Cake blown={blown} isMobile={isMobile} />
        </motion.button>

        {/* surrounding lotuses */}
        <div className="mt-6 flex justify-center gap-2 sm:gap-4 opacity-90">
          {[32, 44, 38, 48, 36].filter((_, i) => !isMobile || i < 3).map((s, i) => (
            <motion.div key={i} animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}>
              <Lotus size={s} />
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {blown && (
            <>
              {/* confetti burst */}
              <div className="pointer-events-none absolute left-1/2 top-[55%] -translate-x-1/2">
                {confetti.map((c) => (
                  <span key={c.i}
                    className="absolute rounded-sm"
                    style={{
                      width: c.size, height: c.size, background: c.color,
                      boxShadow: `0 0 12px ${c.color}`,
                      animation: `confetti-burst 2.5s cubic-bezier(0.22,1,0.36,1) ${c.delay}s forwards`,
                      ["--cx" as string]: `${c.cx}px`,
                      ["--cy" as string]: `${c.cy}px`,
                    }}
                  />
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 1.6 }}
                className="mt-12 text-center"
              >
                <p className="font-display text-[clamp(1.6rem,4vw,2.6rem)] font-light italic text-gold-shine animate-shimmer">
                  Thank you for existing, Oishi.
                </p>
                <p className="mt-3 font-display text-[clamp(1.4rem,3.5vw,2.2rem)] font-light text-[var(--cream)]/90">
                  Happy Birthday.
                </p>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Cake({ blown, isMobile = false }: { blown: boolean; isMobile?: boolean }) {
  return (
    <div className="relative" style={{ width: 260 }}>
      <svg viewBox="0 0 200 220" width="100%">
        <defs>
          <linearGradient id="tier1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.96 0.04 0)" />
            <stop offset="100%" stopColor="oklch(0.84 0.10 5)" />
          </linearGradient>
          <linearGradient id="tier2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.95 0.06 320)" />
            <stop offset="100%" stopColor="oklch(0.78 0.10 305)" />
          </linearGradient>
          <linearGradient id="plate" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.92 0.04 80)" />
            <stop offset="100%" stopColor="oklch(0.65 0.08 50)" />
          </linearGradient>
        </defs>
        {/* plate */}
        <ellipse cx="100" cy="200" rx="90" ry="10" fill="url(#plate)" />
        {/* tier bottom */}
        <rect x="25" y="135" width="150" height="60" rx="6" fill="url(#tier2)" />
        {/* drip */}
        <path d="M25 145 Q35 165 45 145 Q55 170 65 145 Q75 168 85 145 Q95 167 105 145 Q115 170 125 145 Q135 165 145 145 Q155 168 165 145 Q170 155 175 145 L175 195 L25 195 Z"
          fill="oklch(0.78 0.14 5)" opacity="0.85" />
        {/* tier top */}
        <rect x="55" y="85" width="90" height="55" rx="5" fill="url(#tier1)" />
        {/* decorations */}
        {[60, 80, 100, 120, 140].map((cx, i) => (
          <circle key={i} cx={cx} cy="92" r="3" fill="oklch(0.84 0.09 55)" opacity="0.9" />
        ))}
        {/* candles */}
        {[80, 100, 120].map((cx, i) => (
          <g key={i}>
            <rect x={cx - 2} y="60" width="4" height="28" rx="1" fill="oklch(0.85 0.05 70)" />
            {!blown && (
              <ellipse cx={cx} cy="55" rx="3" ry="6" fill="oklch(0.95 0.18 80)"
                style={{ filter: "drop-shadow(0 0 6px oklch(0.85 0.18 60))", transformOrigin: `${cx}px 60px`, animation: `candle-flicker ${1.2 + i * 0.2}s ease-in-out infinite` }}
              />
            )}
            {blown && (
              <path d={`M${cx - 3} 56 Q${cx} 40 ${cx + 3} 56`} stroke="oklch(0.7 0.02 280)" strokeWidth="1" fill="none" opacity="0.5" />
            )}
          </g>
        ))}
      </svg>
      {!blown && (
        <div className="pointer-events-none absolute inset-0 rounded-full"
          style={{ background: "radial-gradient(circle at 50% 30%, oklch(0.85 0.18 60 / 0.5) 0%, transparent 50%)",
                   ...(isMobile ? {} : { filter: "blur(20px)" }) }} />
      )}
    </div>
  );
}
