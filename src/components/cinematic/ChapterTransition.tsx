import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * Transparent interlude — no more gradient blocks. The global DreamVoid
 * carries the visual continuity, so transitions are just a quiet whisper
 * floating in the same starlit dust that runs through every chapter.
 */
export function ChapterTransition({ whisper }: { from?: string; to?: string; whisper?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0.15, 0.5, 0.85], [0, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const letter = useTransform(scrollYProgress, [0.2, 0.5, 0.8], ["0.5em", "0.18em", "0.05em"]);

  return (
    <section
      ref={ref}
      aria-hidden={whisper ? undefined : true}
      className="relative flex h-[42vh] w-full items-center justify-center px-6"
    >
      {whisper && (
        <motion.p
          className="font-display text-center text-[clamp(1.1rem,2.6vw,1.9rem)] font-light italic text-[var(--cream)]/85"
          style={{
            opacity,
            y,
            letterSpacing: letter,
            textShadow: "0 0 40px oklch(0.86 0.08 0 / 0.5), 0 0 80px oklch(0.84 0.09 55 / 0.3)",
          }}
        >
          {whisper}
        </motion.p>
      )}
    </section>
  );
}

export function ChapterReveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
