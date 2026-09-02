import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Petals } from "./Petals";
import { Particles } from "./Particles";
import { Lotus } from "./Lotus";
import { MusicButton } from "./MusicPlayer";

interface LoadingSceneProps {
  onComplete: () => void;
}

/**
 * Opening cinematic — dark → particles → text → magical book → enter universe.
 * Pure CSS/SVG, no WebGL, runs smoothly on mobile.
 */
export function LoadingScene({ onComplete }: LoadingSceneProps) {
  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 800),   // particles
      setTimeout(() => setStep(2), 2400),  // first line
      setTimeout(() => setStep(3), 5600),  // book appears
      setTimeout(() => setStep(4), 8200),  // second line
      setTimeout(() => setStep(5), 11200), // book opens
      setTimeout(() => setExiting(true), 12600),
      setTimeout(() => onComplete(), 13800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const skip = () => {
    setExiting(true);
    setTimeout(onComplete, 900);
  };

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.08, filter: "blur(20px)" }}
          transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
          className="fixed inset-0 z-[100] overflow-hidden bg-[var(--night)]"
        >
          {/* layered atmosphere */}
          <div
            className="absolute inset-0 opacity-90"
            style={{ background: "var(--gradient-night)" }}
          />

          {/* Music Controller in Loading Screen */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 safe-top safe-right">
            <MusicButton />
          </div>

          {step >= 1 && <Particles count={80} />}
          {step >= 1 && <Petals count={14} slow={1.3} />}

          {/* Floating book */}
          <AnimatePresence>
            {step >= 3 && step < 5 && (
              <motion.div
                key="book"
                initial={{ opacity: 0, scale: 0.4, y: 60 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <MagicalBook open={false} />
              </motion.div>
            )}
            {step >= 5 && (
              <motion.div
                key="book-open"
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 1, scale: 1.4, rotateY: 25 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <MagicalBook open={true} />
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 4, 8] }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                  className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    background: "radial-gradient(circle, var(--cream) 0%, var(--lotus) 40%, transparent 70%)",
                    filter: "blur(8px)",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lines of poetry */}
          <div className="pointer-events-none absolute inset-x-0 top-[18%] flex flex-col items-center px-6 text-center">
            <AnimatePresence mode="wait">
              {step === 2 && (
                <motion.p
                  key="line1"
                  initial={{ opacity: 0, y: 12, letterSpacing: "0.4em" }}
                  animate={{ opacity: 1, y: 0, letterSpacing: "0.08em" }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display text-[clamp(1.1rem,2.6vw,1.9rem)] font-extralight italic text-[var(--cream)]/90 max-w-2xl"
                  style={{ textShadow: "0 0 30px oklch(0.86 0.08 0 / 0.4)" }}
                >
                  Every beautiful soul deserves a universe of its own&hellip;
                </motion.p>
              )}
              {step === 4 && (
                <motion.div
                  key="line2"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display text-[clamp(1.2rem,2.8vw,2.1rem)] font-extralight text-[var(--cream)]/95 max-w-2xl"
                >
                  <span className="italic">And tonight&hellip;</span>
                  <br />
                  <span className="text-lotus-shine">this little universe belongs to you.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Subtle skip */}
          <button
            onClick={skip}
            className="absolute bottom-6 right-6 text-xs font-light tracking-[0.3em] text-[var(--cream)]/40 transition hover:text-[var(--cream)]/80"
          >
            ENTER →
          </button>

          {/* corner lotus signature */}
          <div className="absolute bottom-6 left-6 opacity-50">
            <Lotus size={32} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MagicalBook({ open }: { open: boolean }) {
  return (
    <div
      className="relative"
      style={{
        width: "min(58vw, 280px)",
        aspectRatio: "1 / 1.35",
        perspective: "1200px",
        filter: "drop-shadow(0 0 60px oklch(0.84 0.09 55 / 0.55))",
      }}
    >
      {/* halo */}
      <div
        className="absolute -inset-12 rounded-full opacity-70 animate-pulse-soft"
        style={{
          background: "radial-gradient(circle, oklch(0.84 0.09 55 / 0.4) 0%, transparent 65%)",
        }}
      />

      {/* book body */}
      <div
        className="absolute inset-0 animate-float-slow"
        style={{ transformStyle: "preserve-3d", transform: open ? "rotateY(-25deg)" : "rotateY(-15deg) rotateX(8deg)" }}
      >
        {/* cover */}
        <div
          className="absolute inset-0 rounded-r-md rounded-l-sm"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.32 0.08 320) 0%, oklch(0.22 0.06 305) 100%)",
            boxShadow: "inset 0 0 60px oklch(0.84 0.09 55 / 0.3), 0 20px 60px oklch(0 0 0 / 0.6)",
            border: "1px solid oklch(0.84 0.09 55 / 0.5)",
          }}
        >
          {/* engraved lotus */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="opacity-80" style={{ filter: "drop-shadow(0 0 12px oklch(0.84 0.09 55 / 0.9))" }}>
              <Lotus size={120} glow={false} />
            </div>
          </div>
          {/* gold border */}
          <div
            className="absolute inset-2 rounded-sm"
            style={{
              border: "1px solid oklch(0.84 0.09 55 / 0.6)",
              boxShadow: "inset 0 0 12px oklch(0.84 0.09 55 / 0.4)",
            }}
          />
        </div>

        {/* opened glow pages */}
        {open && (
          <div
            className="absolute inset-x-[6%] inset-y-[8%]"
            style={{
              background: "radial-gradient(ellipse at center, var(--cream) 0%, var(--lotus) 60%, transparent 100%)",
              filter: "blur(6px)",
              opacity: 0.9,
            }}
          />
        )}
      </div>

      {/* orbiting petals around book */}
      {open === false &&
        Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 origin-center"
            style={{
              animation: `spin-slow ${20 + i * 4}s linear infinite`,
              transform: `translate(-50%,-50%) rotate(${i * 60}deg)`,
            }}
          >
            <div style={{ transform: `translateY(-${110 + i * 10}px)` }}>
              <Lotus size={18} />
            </div>
          </div>
        ))}
    </div>
  );
}
