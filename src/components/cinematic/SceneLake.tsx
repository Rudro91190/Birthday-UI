import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Petals } from "./Petals";
import { Particles } from "./Particles";
import { Lotus } from "./Lotus";

/**
 * Hero — dream lake at night with giant moon, floating lotuses, fireflies,
 * lantern lights, and cinematic mouse parallax.
 */
export function SceneLake() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouse({ x, y });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  const title = "Happy Birthday Oishi";

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* sky gradient */}
      <div className="absolute inset-0" style={{ background: "var(--gradient-night)" }} />
      {/* far stars */}
      <Particles count={120} />

      {/* drifting fog clouds */}
      <div
        className="absolute inset-x-0 top-[10%] h-40 opacity-30"
        style={{
          background: "radial-gradient(ellipse at center, var(--cream) 0%, transparent 70%)",
          animation: "drift-cloud 40s ease-in-out infinite alternate",
          filter: "blur(40px)",
        }}
      />

      {/* MOON */}
      <motion.div
        className="absolute"
        style={{
          top: "8%",
          left: "62%",
          width: "min(36vw, 360px)",
          height: "min(36vw, 360px)",
          transform: `translate(${mouse.x * -20}px, ${mouse.y * -10}px)`,
          transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, oklch(0.99 0.02 90) 0%, oklch(0.92 0.04 80) 45%, oklch(0.78 0.08 50) 100%)",
            boxShadow: "var(--glow-moon)",
          }}
        />
        {/* moon reflection on water */}
      </motion.div>

      {/* distant mountains silhouette */}
      <svg
        viewBox="0 0 1440 200"
        className="absolute inset-x-0 bottom-[44%] w-full opacity-60"
        preserveAspectRatio="none"
      >
        <path
          d="M0 200 L0 140 L160 90 L320 130 L520 60 L720 110 L900 70 L1100 120 L1280 80 L1440 130 L1440 200 Z"
          fill="oklch(0.16 0.05 305)"
        />
      </svg>

      {/* LAKE */}
      <div
        className="absolute inset-x-0 bottom-0 h-[46%]"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.20 0.06 310) 0%, oklch(0.10 0.04 290) 80%)",
        }}
      >
        {/* moon reflection */}
        <motion.div
          className="absolute left-[58%] top-0 h-full w-[8%] opacity-50"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.95 0.03 80 / 0.7) 0%, transparent 70%)",
            filter: "blur(4px)",
            transform: `translateX(${mouse.x * -10}px)`,
            transition: "transform 0.6s",
          }}
        />
        {/* ripples */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border opacity-30"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 25}%`,
              width: 60,
              height: 18,
              borderColor: "oklch(0.86 0.08 0 / 0.4)",
              animation: `ripple ${5 + i}s ease-out ${i * 0.8}s infinite`,
            }}
          />
        ))}
        {/* floating lotuses on water */}
        {[
          { l: "12%", t: "20%", s: 70, d: 0 },
          { l: "30%", t: "55%", s: 50, d: 1.2 },
          { l: "50%", t: "35%", s: 85, d: 0.6 },
          { l: "72%", t: "60%", s: 60, d: 2 },
          { l: "85%", t: "28%", s: 45, d: 1.5 },
          { l: "8%", t: "70%", s: 40, d: 0.3 },
        ].map((lt, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: lt.l, top: lt.t }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: lt.d }}
          >
            <Lotus size={lt.s} />
          </motion.div>
        ))}

        {/* fireflies */}
        <Particles count={40} color="oklch(0.92 0.12 90)" />
      </div>

      {/* drifting lanterns in sky */}
      {[
        { l: "15%", t: "30%", d: 0 },
        { l: "40%", t: "18%", d: 2 },
        { l: "78%", t: "40%", d: 1.4 },
      ].map((lt, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: lt.l, top: lt.t }}
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6 + i * 1.5, repeat: Infinity, ease: "easeInOut", delay: lt.d }}
        >
          <div
            className="h-5 w-4 rounded-sm"
            style={{
              background: "linear-gradient(180deg, oklch(0.92 0.13 60) 0%, oklch(0.7 0.18 35) 100%)",
              boxShadow: "0 0 20px oklch(0.84 0.13 50 / 0.8), 0 0 50px oklch(0.84 0.13 50 / 0.4)",
            }}
          />
        </motion.div>
      ))}

      <Petals count={18} />

      {/* TITLE */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.5em" }}
          animate={{ opacity: 0.6, letterSpacing: "0.4em" }}
          transition={{ duration: 2, delay: 0.5 }}
          className="mb-4 text-xs font-light uppercase text-[var(--lotus)]/80"
        >
          A little universe for
        </motion.p>

        <h1
          className="font-display text-[clamp(1.8rem,6.5vw,4.5rem)] font-light leading-[1.05] flex flex-wrap justify-center gap-x-3 gap-y-1.5 px-4"
          style={{ textShadow: "0 0 60px oklch(0.86 0.08 0 / 0.5)" }}
        >
          {title.split(" ").map((word, wordIdx) => {
            const prevCharsCount = title.split(" ").slice(0, wordIdx).join(" ").length + (wordIdx > 0 ? 1 : 0);
            return (
              <span key={wordIdx} className="inline-block whitespace-nowrap">
                {word.split("").map((char, charIdx) => {
                  const globalIdx = prevCharsCount + charIdx;
                  return (
                    <motion.span
                      key={charIdx}
                      initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
                      transition={{ duration: 1.2, delay: 0.8 + globalIdx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                      className="inline-block text-gold-shine animate-shimmer"
                    >
                      {char}
                    </motion.span>
                  );
                })}
              </span>
            );
          })}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ duration: 1.6, delay: 2.4 }}
          className="mt-8 max-w-2xl font-display text-base font-light italic text-[var(--cream)]/85 md:text-xl"
        >
          A story written softly between dreams, books, memories, and emotions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6, y: [0, 8, 0] }}
          transition={{ opacity: { delay: 4, duration: 1 }, y: { delay: 4, duration: 2, repeat: Infinity } }}
          className="absolute bottom-10 flex flex-col items-center gap-2 text-xs font-light tracking-[0.4em] text-[var(--cream)]/60"
        >
          SCROLL TO BEGIN
          <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
            <path d="M7 1V18M7 18L1 12M7 18L13 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
