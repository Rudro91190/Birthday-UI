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

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // three parallax dust layers for depth (lightweight density for thermal cooling)
  const layers = useMemo(
    () => {
      const scale = isMobile ? 0.3 : 0.55;
      return [
        { count: Math.round(70 * scale), size: [1, 2], speed: 1, opacity: 0.45, color: "var(--cream)" },
        { count: Math.round(50 * scale), size: [1.5, 2.5], speed: 0.6, opacity: 0.6, color: "var(--lotus)" },
        { count: Math.round(30 * scale), size: [2, 3], speed: 0.3, opacity: 0.75, color: "var(--rose-gold)" },
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
      }));
    },
    [isMobile],
  );

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[5] overflow-hidden"
      style={{ mixBlendMode: "screen" }}
      aria-hidden
    >
      {/* slow rotating lotus core — feathered softly with gradient stops instead of expensive GPU blur filter */}
      <motion.div
        className="absolute left-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 rounded-full"
        style={{
          top: orbY,
          scale: orbScale,
          rotate: useTransform(smooth, [0, 1], [0, 240]),
          background:
            "radial-gradient(circle at 50% 50%, oklch(0.86 0.12 0 / 0.28) 0%, oklch(0.84 0.09 55 / 0.15) 35%, oklch(0.82 0.08 305 / 0.06) 60%, transparent 80%)",
          opacity: 0.85,
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, oklch(0.96 0.03 80 / 0.3) 0%, transparent 40%)",
          }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.6, 0.9, 0.6] }}
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
                  boxShadow: `0 0 ${p.s * 2}px ${layer.color}`,
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
