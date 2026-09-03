import { useMemo } from "react";

interface PetalsProps {
  count?: number;
  className?: string;
  /** 0-1; how slow petals fall */
  slow?: number;
}

/**
 * Cinematic lotus petals — GPU-composited.
 * Shared SVG gradient via <defs> in a hidden sprite to avoid per-petal gradient recalc.
 */
export function Petals({ count = 14, className = "", slow = 1 }: PetalsProps) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const effectiveCount = isMobile ? Math.min(count, 8) : Math.min(count, 14);

  const petals = useMemo(
    () =>
      Array.from({ length: effectiveCount }).map((_, i) => {
        const size = 16 + Math.random() * 24;
        const left = Math.random() * 100;
        const delay = -Math.random() * 28;
        const duration = (18 + Math.random() * 18) * slow;
        const drift = -80 + Math.random() * 160;
        const depth = Math.random();
        const isLotus = Math.random() > 0.5;
        const opacity = 0.3 + depth * 0.45;
        return { i, size, left, delay, duration, drift, opacity, isLotus };
      }),
    [effectiveCount, slow],
  );

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {/* Shared SVG defs — single gradient definition reused by all petals via CSS */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <radialGradient id="petal-lotus" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="var(--lotus)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--lotus)" stopOpacity="0.5" />
          </radialGradient>
          <radialGradient id="petal-rose" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="var(--rose-gold)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--rose-gold)" stopOpacity="0.5" />
          </radialGradient>
        </defs>
      </svg>

      {petals.map((p) => (
        <div
          key={p.i}
          className="absolute top-0"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            transform: "translateZ(0)",
            animation: `float-petal ${p.duration}s linear ${p.delay}s infinite`,
            ["--drift" as string]: `${p.drift}px`,
          }}
        >
          <svg viewBox="0 0 32 32" className="h-full w-full">
            <path
              d="M16 2 C 22 8, 26 14, 24 22 C 22 28, 18 30, 16 30 C 14 30, 10 28, 8 22 C 6 14, 10 8, 16 2 Z"
              fill={`url(#petal-${p.isLotus ? "lotus" : "rose"})`}
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
