import { useMemo } from "react";

interface ParticlesProps {
  count?: number;
  className?: string;
  color?: string;
}

/**
 * Tiny glowing magical dust — GPU-composited for smooth scrolling.
 * Uses will-change + transform3d so animations never trigger layout/paint.
 */
export function Particles({ count = 40, className = "", color = "var(--cream)" }: ParticlesProps) {
  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const size = 1.5 + Math.random() * 2.5;
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const delay = Math.random() * 6;
        const duration = 3 + Math.random() * 4;
        const intensity = 0.4 + Math.random() * 0.5;
        return { i, size, top, left, delay, duration, intensity };
      }),
    [count],
  );

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`}>
      {items.map((p) => (
        <span
          key={p.i}
          className="absolute rounded-full"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: color,
            opacity: p.intensity,
            // Single glow only — double glow was causing expensive repaints
            boxShadow: `0 0 ${p.size * 3}px ${color}`,
            // GPU layer — keeps animation off main thread
            willChange: "transform, opacity",
            transform: "translateZ(0)",
            animation: `twinkle ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
