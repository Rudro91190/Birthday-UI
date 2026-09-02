import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Particles } from "./Particles";
import { PHOTOS } from "./photos";
import { Lotus } from "./Lotus";

/**
 * Chapter 3 — The Lotus Train of Memories.
 * A cinematic midnight journey: a glowing vintage train glides on light-tracks
 * above a black mirror lake of lotuses, beneath a giant moon.
 */
export function SceneSky() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // Smooth progress for cinematic feel
  const p = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.6 });

  // Sequence:
  // 0.00–0.10  ticket forms from a memory photo
  // 0.10–0.22  ticket drifts forward, darkness, fog, distant whistle
  // 0.22–0.45  train emerges & glides past, windows hold memories
  // 0.45–0.62  lotus tunnel
  // 0.62–0.90  endless lotus ocean under giant moon
  // 0.90–1.00  slowdown + closing whisper

  const ticketY      = useTransform(p, [0, 0.18], ["10vh", "-10vh"]);
  const ticketScale  = useTransform(p, [0, 0.08, 0.18], [0.4, 1, 1.6]);
  const ticketOpacity= useTransform(p, [0, 0.04, 0.16, 0.22], [0, 1, 1, 0]);
  const photoOpacity = useTransform(p, [0, 0.05, 0.10], [0.85, 0.4, 0]);

  const darkOpacity  = useTransform(p, [0.18, 0.26, 0.62, 0.68], [0, 1, 1, 0]);
  const fogOpacity   = useTransform(p, [0.20, 0.30, 0.55, 0.62], [0, 0.55, 0.55, 0.2]);

  const trainX       = useTransform(p, [0.22, 0.45, 0.62, 0.90, 1], ["-120vw", "-10vw", "0vw", "8vw", "30vw"]);
  const trainOpacity = useTransform(p, [0.22, 0.30, 0.60, 0.66], [0, 1, 1, 0]);

  const tunnelOpacity= useTransform(p, [0.42, 0.50, 0.60, 0.66], [0, 1, 1, 0]);
  const tunnelScale  = useTransform(p, [0.42, 0.55, 0.66], [0.6, 1, 1.6]);

  const moonScale    = useTransform(p, [0.55, 0.80], [0.7, 1.15]);
  const moonY        = useTransform(p, [0.55, 1], ["8vh", "-4vh"]);
  const moonOpacity  = useTransform(p, [0, 0.12, 0.22, 0.50, 0.66, 1], [0.25, 0.15, 0, 0, 1, 1]);
  const lakeOpacity  = useTransform(p, [0, 0.18, 0.22, 0.55, 0.66], [0.2, 0.1, 0, 0.3, 1]);
  const ambienceOpacity = useTransform(p, [0, 0.18, 0.22, 0.62, 0.68], [0.5, 0.2, 0, 0, 1]);

  const whisper1Op   = useTransform(p, [0.05, 0.10, 0.20, 0.24], [0, 1, 1, 0]);
  const whisper2Op   = useTransform(p, [0.88, 0.93, 0.98, 1], [0, 1, 1, 0.6]);
  const headingOp    = useTransform(p, [0, 0.06, 0.12], [1, 1, 0]);

  // Cursor parallax for lanterns / petals
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const h = (e: MouseEvent) =>
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  return (
    <section ref={ref} className="relative" style={{ minHeight: "520vh" }}>
      {/* Sticky cinematic canvas */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Base sky → lake gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 35%, oklch(0.20 0.06 305) 0%, oklch(0.10 0.04 290) 55%, oklch(0.05 0.02 285) 100%)",
          }}
        />

        {/* Distant dreamy mountains */}
        <svg
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
          className="absolute inset-x-0 top-[42%] h-[22vh] w-full opacity-60"
        >
          <defs>
            <linearGradient id="mtn" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.30 0.08 305)" />
              <stop offset="100%" stopColor="oklch(0.10 0.03 290)" />
            </linearGradient>
          </defs>
          <path d="M0 240 L120 160 L260 220 L420 130 L580 210 L740 150 L900 220 L1080 140 L1240 210 L1440 170 L1440 400 L0 400 Z" fill="url(#mtn)" />
        </svg>

        {/* Aurora wash */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[55vh] opacity-50"
          style={{
            background:
              "radial-gradient(ellipse at 30% 40%, oklch(0.72 0.14 175 / 0.30) 0%, transparent 55%), radial-gradient(ellipse at 75% 30%, oklch(0.78 0.16 320 / 0.32) 0%, transparent 60%)",
            filter: "blur(50px)",
          }}
        />

        {/* Giant moon (grows as lotus ocean reveals) */}
        <motion.div
          style={{ scale: moonScale, y: moonY, opacity: moonOpacity }}
          className="absolute left-1/2 top-[6vh] -translate-x-1/2"
        >
          <div
            className="rounded-full"
            style={{
              width: "min(60vw, 520px)",
              height: "min(60vw, 520px)",
              background:
                "radial-gradient(circle at 38% 38%, oklch(0.98 0.02 90) 0%, oklch(0.92 0.05 70) 45%, oklch(0.72 0.10 30 / 0.4) 80%, transparent 100%)",
              boxShadow:
                "0 0 120px oklch(0.95 0.04 70 / 0.5), 0 0 240px oklch(0.86 0.08 0 / 0.35)",
            }}
          />
        </motion.div>

        {/* Stars */}
        <Particles count={120} />

        {/* Reflective black lotus lake (bottom half) */}
        <motion.div
          style={{ opacity: lakeOpacity }}
          className="absolute inset-x-0 bottom-0 h-[55vh]"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, oklch(0.06 0.02 285) 25%, oklch(0.03 0.01 285) 100%)",
            }}
          />
          {/* Moon reflection ripple */}
          <div
            className="absolute left-1/2 top-2 h-[30vh] w-[40vw] -translate-x-1/2 opacity-50"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, oklch(0.95 0.04 70 / 0.45), transparent 70%)",
              filter: "blur(20px)",
              transform: `translateX(calc(-50% + ${mouse.x * 8}px))`,
            }}
          />
          {/* Floating lotuses on the water */}
          {LOTUS_POSITIONS.map((l, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ left: l.left, bottom: l.bottom, width: l.size }}
              animate={{ y: [0, -4, 0], rotate: [0, l.rot, 0] }}
              transition={{ duration: 6 + (i % 5), repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
            >
              <MiniLotus />
            </motion.div>
          ))}
        </motion.div>

        {/* Glowing light tracks above the lake */}
        <div className="pointer-events-none absolute inset-x-0 top-[58%] h-[2px]">
          <div
            className="absolute inset-x-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, oklch(0.92 0.10 60 / 0.9) 50%, transparent 100%)",
              boxShadow: "0 0 18px oklch(0.86 0.13 50 / 0.8)",
            }}
          />
          <div
            className="absolute inset-x-0 top-3 h-px opacity-60"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, oklch(0.92 0.10 60 / 0.7) 50%, transparent 100%)",
            }}
          />
        </div>

        {/* Fog */}
        <motion.div
          style={{ opacity: fogOpacity }}
          className="pointer-events-none absolute inset-0"
        >
          <div
            className="absolute inset-x-0 top-[40%] h-[40vh]"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, oklch(0.85 0.03 320 / 0.45) 0%, transparent 70%)",
              filter: "blur(30px)",
            }}
          />
        </motion.div>

        {/* Floating lanterns + petals — fade in only after the train passes */}
        <motion.div style={{ opacity: ambienceOpacity }} className="pointer-events-none absolute inset-0">
          {LANTERNS.map((l, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: l.left,
                top: l.top,
                transform: `translate(${mouse.x * (8 + i * 2)}px, ${mouse.y * (6 + i * 2)}px)`,
                transition: "transform 0.8s ease-out",
              }}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 7 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
            >
              <Lantern />
            </motion.div>
          ))}

          {PETALS.map((pt, i) => (
            <motion.span
              key={i}
              className="absolute block rounded-full"
              style={{
                left: pt.left,
                top: pt.top,
                width: pt.size,
                height: pt.size * 1.4,
                background: "linear-gradient(180deg, oklch(0.92 0.08 0 / 0.9), oklch(0.78 0.14 5 / 0.7))",
                filter: "blur(0.5px)",
                boxShadow: "0 0 12px oklch(0.86 0.08 0 / 0.5)",
              }}
              animate={{
                x: [0, 30 + (i % 3) * 10, 0],
                y: [0, 60, 120],
                rotate: [0, 180, 360],
                opacity: [0, 0.9, 0],
              }}
              transition={{ duration: 12 + (i % 4) * 2, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" }}
            />
          ))}
        </motion.div>

        {/* === STAGE 1: Memory photo → glowing ticket === */}
        <motion.div
          style={{ y: ticketY, scale: ticketScale, opacity: ticketOpacity }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <Ticket />
        </motion.div>
        <motion.div
          style={{ opacity: photoOpacity }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div
            className="rounded-[3px] p-2 pb-5"
            style={{
              background: "linear-gradient(180deg, oklch(0.96 0.03 80), oklch(0.90 0.05 70))",
              boxShadow: "0 20px 40px -10px oklch(0 0 0 / 0.7)",
            }}
          >
            <img src={PHOTOS[7]} alt="" className="block h-[120px] w-[120px] object-cover" />
          </div>
        </motion.div>

        {/* === STAGE 2: Darkness veil === */}
        <motion.div
          style={{ opacity: darkOpacity }}
          className="pointer-events-none absolute inset-0 bg-black"
        />

        {/* === STAGE 3: The Train === */}
        <motion.div
          style={{ x: trainX, opacity: trainOpacity }}
          className="absolute left-0 top-[48%] w-[140vw]"
        >
          <Train />
          {/* Train interior memory windows (photos blended) */}
          <div className="absolute left-[18%] top-[8%] flex gap-[2.2vw]">
            {WINDOW_PHOTOS.map((idx, i) => (
              <div
                key={i}
                className="relative h-[7vh] w-[5.5vw] overflow-hidden rounded-sm"
                style={{
                  background: "oklch(0.18 0.04 290)",
                  boxShadow: "inset 0 0 18px oklch(0.92 0.13 60 / 0.5), 0 0 24px oklch(0.86 0.13 50 / 0.4)",
                }}
              >
                <img
                  src={PHOTOS[idx]}
                  alt=""
                  className="h-full w-full object-cover"
                  style={{ opacity: 0.75, filter: "brightness(1.05) saturate(0.9)" }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, oklch(0.92 0.13 60 / 0.35), transparent 40%, oklch(0.06 0.02 285 / 0.5) 100%)",
                  }}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* === STAGE 4: Lotus tunnel === */}
        <motion.div
          style={{ opacity: tunnelOpacity, scale: tunnelScale }}
          className="pointer-events-none absolute inset-0"
        >
          {Array.from({ length: 26 }).map((_, i) => {
            const a = (i / 26) * Math.PI * 2;
            const r = 30 + (i % 3) * 6;
            return (
              <div
                key={i}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `translate(-50%, -50%) translate(${Math.cos(a) * r}vw, ${Math.sin(a) * r}vh)`,
                }}
              >
                <MiniLotus glow />
              </div>
            );
          })}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, transparent 30%, oklch(0.06 0.02 285 / 0.8) 80%)",
            }}
          />
        </motion.div>

        {/* === Whispered quotes === */}
        <motion.p
          style={{ opacity: whisper1Op }}
          className="absolute left-1/2 top-[32%] w-[88vw] max-w-2xl -translate-x-1/2 text-center font-display text-[clamp(1.1rem,2.6vw,2rem)] italic text-[var(--cream)]/90"
        >
          Some memories are too beautiful to stay still…
        </motion.p>

        <motion.p
          style={{ opacity: whisper2Op }}
          className="absolute left-1/2 bottom-[18%] w-[88vw] max-w-2xl -translate-x-1/2 text-center font-display text-[clamp(1.1rem,2.6vw,2rem)] italic text-[var(--cream)]/90"
        >
          Every beautiful journey eventually leads to a feeling…
        </motion.p>

        {/* Chapter heading (fades after entrance) */}
        <motion.div
          style={{ opacity: headingOp }}
          className="absolute inset-x-0 top-20 z-10 text-center px-6"
        >
          <p className="text-[10px] font-light uppercase tracking-[0.5em] text-[var(--lavender)]">
            Chapter Three
          </p>
          <h2 className="mt-3 font-display text-[clamp(1.8rem,5vw,3.6rem)] font-light text-gold-shine animate-shimmer">
            The Lotus Train of Memories
          </h2>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- decorative bits ---------- */

const LOTUS_POSITIONS = [
  { left: "6%",  bottom: "8%",  size: 38, rot: 4 },
  { left: "14%", bottom: "20%", size: 28, rot: -3 },
  { left: "24%", bottom: "12%", size: 44, rot: 5 },
  { left: "36%", bottom: "26%", size: 30, rot: -4 },
  { left: "44%", bottom: "10%", size: 50, rot: 3 },
  { left: "55%", bottom: "22%", size: 32, rot: -5 },
  { left: "66%", bottom: "8%",  size: 42, rot: 4 },
  { left: "76%", bottom: "24%", size: 28, rot: -3 },
  { left: "86%", bottom: "14%", size: 46, rot: 5 },
  { left: "92%", bottom: "28%", size: 26, rot: -4 },
];

const LANTERNS = [
  { left: "8%",  top: "22%" },
  { left: "22%", top: "38%" },
  { left: "72%", top: "28%" },
  { left: "88%", top: "44%" },
  { left: "55%", top: "18%" },
];

const PETALS = Array.from({ length: 14 }).map((_, i) => ({
  left: `${(i * 7.3) % 100}%`,
  top:  `${(i * 11) % 60}%`,
  size: 5 + (i % 4) * 2,
}));

const WINDOW_PHOTOS = [0, 2, 4, 6, 8, 10, 12, 14, 16];

function MiniLotus({ glow = false }: { glow?: boolean }) {
  return <Lotus size="100%" glow={glow} className="w-full h-full" />;
}

function Lantern() {
  return (
    <div className="relative">
      <div
        className="h-6 w-5 rounded-sm"
        style={{
          background: "linear-gradient(180deg, oklch(0.94 0.12 65), oklch(0.70 0.18 30))",
          boxShadow: "0 0 20px oklch(0.86 0.13 50 / 0.95), 0 0 50px oklch(0.86 0.13 50 / 0.55)",
        }}
      />
      <div className="mx-auto h-3 w-px bg-[oklch(0.6_0.05_30)]" />
    </div>
  );
}

function Ticket() {
  return (
    <div
      className="relative flex h-[80px] w-[220px] items-center justify-between rounded-md px-3"
      style={{
        background: "linear-gradient(135deg, oklch(0.95 0.05 80), oklch(0.88 0.10 55))",
        boxShadow:
          "0 0 40px oklch(0.92 0.13 60 / 0.9), 0 0 90px oklch(0.86 0.13 50 / 0.6), inset 0 0 20px oklch(1 0 0 / 0.4)",
        border: "1px dashed oklch(0.40 0.10 30 / 0.6)",
      }}
    >
      <div className="text-left">
        <p className="font-display text-[10px] uppercase tracking-[0.3em] text-[oklch(0.30_0.10_30)]">
          Dream Line
        </p>
        <p className="font-display text-[18px] leading-none text-[oklch(0.25_0.10_25)]">
          To: Oishi
        </p>
        <p className="text-[8px] uppercase tracking-[0.25em] text-[oklch(0.35_0.10_30)]">
          Lotus Ocean · 11:11 pm
        </p>
      </div>
      <div className="h-full border-l border-dashed border-[oklch(0.40_0.10_30/0.6)] pl-2 text-center">
        <p className="font-display text-[24px] leading-none text-[oklch(0.25_0.10_25)]">∞</p>
        <p className="text-[7px] uppercase tracking-[0.2em] text-[oklch(0.35_0.10_30)]">one way</p>
      </div>
    </div>
  );
}

function Train() {
  // Long elegant vintage train: locomotive + 4 carriages
  return (
    <div className="relative h-[18vh] w-full">
      {/* Smoke */}
      <div
        className="absolute left-[6%] top-[-8vh] h-[10vh] w-[20vw] opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 30% 80%, oklch(0.85 0.03 320 / 0.6), transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Locomotive */}
      <div className="absolute left-[2%] bottom-0 flex h-full items-end">
        <div
          className="relative h-[14vh] w-[16vw] rounded-l-2xl rounded-r-md"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.30 0.06 30) 0%, oklch(0.18 0.05 25) 60%, oklch(0.10 0.03 20) 100%)",
            border: "1px solid oklch(0.78 0.12 60 / 0.6)",
            boxShadow:
              "0 0 40px oklch(0.86 0.13 50 / 0.5), inset 0 4px 14px oklch(0.92 0.10 60 / 0.25)",
          }}
        >
          {/* gold trim */}
          <div className="absolute inset-x-2 top-2 h-px bg-[oklch(0.86_0.13_60/0.8)]" />
          <div className="absolute inset-x-2 bottom-3 h-px bg-[oklch(0.86_0.13_60/0.8)]" />
          {/* headlight */}
          <div
            className="absolute right-[-2vw] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full"
            style={{
              background: "oklch(0.98 0.05 80)",
              boxShadow:
                "0 0 30px oklch(0.95 0.10 70), 0 0 90px oklch(0.92 0.13 60 / 0.8), 0 0 200px oklch(0.86 0.13 50 / 0.5)",
            }}
          />
          {/* chimney */}
          <div
            className="absolute -top-3 left-[18%] h-3 w-3 rounded-sm"
            style={{ background: "oklch(0.22 0.05 30)", border: "1px solid oklch(0.78 0.12 60 / 0.7)" }}
          />
          {/* lotus engraving */}
          <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 opacity-80">
            <MiniLotus glow />
          </div>
        </div>
      </div>

      {/* Carriages */}
      {[0, 1, 2, 3].map((c) => (
        <div
          key={c}
          className="absolute bottom-0 flex h-full items-end"
          style={{ left: `${20 + c * 18}%` }}
        >
          <div
            className="relative h-[12vh] w-[16vw] rounded-md"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.26 0.06 30) 0%, oklch(0.14 0.04 25) 100%)",
              border: "1px solid oklch(0.78 0.12 60 / 0.55)",
              boxShadow: "0 0 30px oklch(0.86 0.13 50 / 0.35)",
            }}
          >
            <div className="absolute inset-x-2 top-1 h-px bg-[oklch(0.86_0.13_60/0.7)]" />
            <div className="absolute inset-x-2 bottom-2 h-px bg-[oklch(0.86_0.13_60/0.7)]" />
            {/* small bottom glow */}
            <div
              className="absolute -bottom-1 inset-x-2 h-2 rounded-full"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 0%, oklch(0.92 0.13 60 / 0.5), transparent 70%)",
                filter: "blur(6px)",
              }}
            />
          </div>
        </div>
      ))}

      {/* Wheels suggestion (glowing dots) */}
      {Array.from({ length: 14 }).map((_, i) => (
        <div
          key={i}
          className="absolute bottom-[-6px] h-1.5 w-1.5 rounded-full"
          style={{
            left: `${4 + i * 6.5}%`,
            background: "oklch(0.92 0.13 60)",
            boxShadow: "0 0 10px oklch(0.86 0.13 50)",
          }}
        />
      ))}
    </div>
  );
}
