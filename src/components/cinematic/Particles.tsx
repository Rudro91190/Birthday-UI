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
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const effectiveCount = isMobile ? Math.min(count, 22) : Math.min(count, 55);

  const items = useMemo(
    () =>
      Array.from({ length: effectiveCount }).map((_, i) => {
        const size = 1.5 + Math.random() * 2;
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const delay = Math.random() * 6;
        const duration = 3 + Math.random() * 4;
        const intensity = 0.35 + Math.random() * 0.45;
        return { i, size, top, left, delay, duration, intensity };
      }),
    [effectiveCount],
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
            boxShadow: p.size > 2.2 ? `0 0 3px ${color}` : undefined,
            transform: "translateZ(0)",
            animation: `twinkle ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
