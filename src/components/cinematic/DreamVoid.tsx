import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useMemo } from "react";

/**
 * Global cinematic "void" layer — sits above every scene's background
 * but below its content (mix-blend-screen). It carries a single drifting
 * particle field + a slow rotating lotus-glow orb across the entire scroll,
 * so every chapter feels like the same room seen from a moving camera.
 *
 * Inspired by textura.us — but tinted to the Oishi romantic palette
 * (lotus pink + cream + rose-gold) instead of cold green.
 */
export function DreamVoid() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 24, mass: 0.6 });

  // camera glides through the dust as the page scrolls
  const dustY = useTransform(smooth, [0, 1], ["0%", "-40%"]);
  const orbY = useTransform(smooth, [0, 1], ["10%", "70%"]);
  const orbScale = useTransform(smooth, [0, 0.5, 1], [0.8, 1.4, 0.9]);
  const orbHue = useTransform(smooth, [0, 0.5, 1], [0, 30, -10]);

  // three parallax dust layers for depth
  const layers = useMemo(
    () =>
      [
        { count: 70, size: [1, 2], speed: 1, opacity: 0.5, color: "var(--cream)" },
        { count: 50, size: [1.5, 3], speed: 0.6, opacity: 0.7, color: "var(--lotus)" },
        { count: 30, size: [2, 4], speed: 0.3, opacity: 0.9, color: "var(--rose-gold)" },
      ].map((layer) => ({
        ...layer,
        particles: Array.from({ length: layer.count }).map((_, i) => ({
          i,
          x: Math.random() * 100,
          y: Math.random() * 200, // spread across 2 viewports
          s: layer.size[0] + Math.random() * (layer.size[1] - layer.size[0]),
          d: Math.random() * 8,
          dur: 4 + Math.random() * 6,
        })),
      })),
    [],
  );

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[5] overflow-hidden"
      style={{ mixBlendMode: "screen" }}
      aria-hidden
    >
      {/* slow rotating lotus core — the textura "orb" reimagined as a soft pink nebula */}
      <motion.div
        className="absolute left-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 rounded-full"
        style={{
          top: orbY,
          scale: orbScale,
          rotate: useTransform(smooth, [0, 1], [0, 240]),
          background:
            "radial-gradient(circle at 50% 50%, oklch(0.86 0.12 0 / 0.35) 0%, oklch(0.84 0.09 55 / 0.22) 30%, oklch(0.82 0.08 305 / 0.10) 55%, transparent 75%)",
          filter: "blur(40px)",
          opacity: 0.85,
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, oklch(0.96 0.03 80 / 0.4) 0%, transparent 35%)",
            filter: `hue-rotate(${orbHue.get()}deg)`,
          }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* drifting parallax dust */}
      <motion.div className="absolute inset-0" style={{ y: dustY }}>
        {layers.map((layer, li) => (
          <div key={li} className="absolute inset-0">
            {layer.particles.map((p) => (
              <span
                key={p.i}
                className="absolute rounded-full"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.s,
                  height: p.s,
                  background: layer.color,
                  opacity: layer.opacity,
                  boxShadow: `0 0 ${p.s * 6}px ${layer.color}, 0 0 ${p.s * 14}px ${layer.color}`,
                  animation: `twinkle ${p.dur}s ease-in-out ${p.d}s infinite`,
                }}
              />
            ))}
          </div>
        ))}
      </motion.div>

      {/* faint vignette so edges stay cinematic */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 40%, oklch(0.08 0.03 285 / 0.55) 100%)",
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}
