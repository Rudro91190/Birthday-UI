import React from "react";

interface LotusProps {
  size?: number | string;
  glow?: boolean;
  className?: string;
}

/**
 * Premium, hand-crafted 3D perspective SVG lotus flower.
 * Features realistic overlapping petal layers, glowing stamens, and fine gold trims.
 * Fully responsive, self-contained, and blends perfectly on any background.
 */
export function Lotus({ size = 80, glow = true, className = "" }: LotusProps) {
  return (
    <svg
      viewBox="0 0 120 100"
      width={size}
      height={size}
      className={className}
      style={{
        filter: glow ? "drop-shadow(0 0 20px oklch(0.86 0.08 0 / 0.8))" : undefined,
        overflow: "visible",
      }}
    >
      <defs>
        {/* Back Petals Gradient: Rich rose-gold pink with deeper tips */}
        <linearGradient id="lotus-petal-back" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="oklch(0.97 0.03 80)" />
          <stop offset="60%" stopColor="oklch(0.85 0.12 355)" />
          <stop offset="100%" stopColor="oklch(0.68 0.16 5)" />
        </linearGradient>

        {/* Middle Petals Gradient: Soft pink with yellow-cream base */}
        <linearGradient id="lotus-petal-mid" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="oklch(0.98 0.05 85)" />
          <stop offset="45%" stopColor="oklch(0.90 0.09 350)" />
          <stop offset="100%" stopColor="oklch(0.80 0.14 5)" />
        </linearGradient>

        {/* Front Petals Gradient: Bright glowing cream base to soft pink */}
        <linearGradient id="lotus-petal-front" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="oklch(0.99 0.03 90)" />
          <stop offset="50%" stopColor="oklch(0.93 0.08 355)" />
          <stop offset="100%" stopColor="oklch(0.86 0.12 5)" />
        </linearGradient>

        {/* Sepals/Leaves Gradient: Deep jade/emerald to gold */}
        <linearGradient id="lotus-sepal" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="oklch(0.35 0.08 150)" />
          <stop offset="100%" stopColor="oklch(0.75 0.12 110)" />
        </linearGradient>

        {/* Gold Trim/Outline: Shiny metallic highlight */}
        <linearGradient id="lotus-gold-trim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.88 0.12 70)" />
          <stop offset="50%" stopColor="oklch(0.96 0.05 85)" />
          <stop offset="100%" stopColor="oklch(0.78 0.15 60)" />
        </linearGradient>

        {/* Golden Pistil Core */}
        <radialGradient id="lotus-pistil" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.96 0.16 95)" />
          <stop offset="70%" stopColor="oklch(0.88 0.14 80)" />
          <stop offset="100%" stopColor="oklch(0.78 0.18 70)" />
        </radialGradient>
      </defs>

      {/* Layer 1: Sepals (Green/gold base) */}
      <g stroke="url(#lotus-gold-trim)" strokeWidth="0.4" strokeLinejoin="round">
        <path d="M 60 75 C 50 78, 30 78, 36 88 C 42 86, 52 82, 60 75" fill="url(#lotus-sepal)" />
        <path d="M 60 75 C 70 78, 90 78, 84 88 C 78 86, 68 82, 60 75" fill="url(#lotus-sepal)" />
        <path d="M 60 75 C 55 80, 50 90, 60 94 C 70 90, 65 80, 60 75" fill="url(#lotus-sepal)" />
      </g>

      {/* Layer 2: Back Petals (Pointing up & out) */}
      <g stroke="url(#lotus-gold-trim)" strokeWidth="0.4" strokeLinejoin="round" opacity="0.95">
        {/* Far Left Back */}
        <path d="M 60 75 C 35 65, 12 48, 18 34 C 26 36, 42 52, 60 75 Z" fill="url(#lotus-petal-back)" />
        {/* Far Right Back */}
        <path d="M 60 75 C 85 65, 108 48, 102 34 C 94 36, 78 52, 60 75 Z" fill="url(#lotus-petal-back)" />
        {/* Mid Left Back */}
        <path d="M 60 75 C 42 58, 28 35, 38 20 C 48 25, 52 50, 60 75 Z" fill="url(#lotus-petal-back)" />
        {/* Mid Right Back */}
        <path d="M 60 75 C 78 58, 92 35, 82 20 C 72 25, 68 50, 60 75 Z" fill="url(#lotus-petal-back)" />
        {/* Center Back */}
        <path d="M 60 75 C 50 55, 45 25, 60 12 C 75 25, 70 55, 60 75 Z" fill="url(#lotus-petal-back)" />
      </g>

      {/* Layer 3: Middle Petals (Cupped, shaping the walls) */}
      <g stroke="url(#lotus-gold-trim)" strokeWidth="0.4" strokeLinejoin="round" opacity="0.98">
        {/* Left Side Outer */}
        <path d="M 60 75 C 38 72, 22 55, 26 44 C 34 46, 46 58, 60 75 Z" fill="url(#lotus-petal-mid)" />
        {/* Right Side Outer */}
        <path d="M 60 75 C 82 72, 98 55, 94 44 C 86 46, 74 58, 60 75 Z" fill="url(#lotus-petal-mid)" />
        {/* Left Mid Inner */}
        <path d="M 60 75 C 44 64, 34 40, 46 28 C 54 34, 54 52, 60 75 Z" fill="url(#lotus-petal-mid)" />
        {/* Right Mid Inner */}
        <path d="M 60 75 C 76 64, 86 40, 74 28 C 66 34, 66 52, 60 75 Z" fill="url(#lotus-petal-mid)" />
      </g>

      {/* Layer 4: Pistil & Radiating Golden Stamens */}
      <g>
        {/* Central pistil head */}
        <ellipse cx="60" cy="62" rx="7" ry="4" fill="url(#lotus-pistil)" />
        {/* Stamens radiating out */}
        {Array.from({ length: 22 }).map((_, i) => {
          const angle = (i / 22) * 360 * (Math.PI / 180);
          const rx = 12;
          const ry = 7;
          const sx = 60 + Math.cos(angle) * 4;
          const sy = 62 + Math.sin(angle) * 2;
          const ex = 60 + Math.cos(angle) * rx;
          const ey = 62 + Math.sin(angle) * ry - 3; // slight upward tilt
          const mx = (sx + ex) / 2 + Math.cos(angle + 0.3) * 2;
          const my = (sy + ey) / 2 - 1.5;
          return (
            <g key={`stamen-${i}`}>
              <path
                d={`M ${sx} ${sy} Q ${mx} ${my}, ${ex} ${ey}`}
                stroke="oklch(0.92 0.16 85)"
                strokeWidth="0.5"
                fill="none"
                opacity="0.9"
              />
              <circle
                cx={ex}
                cy={ey}
                r="0.9"
                fill="oklch(0.96 0.18 90)"
                style={{ filter: "drop-shadow(0 0 1px oklch(0.96 0.18 90))" }}
              />
            </g>
          );
        })}
      </g>

      {/* Layer 5: Front Petals (overlapping stamen and cup) */}
      <g stroke="url(#lotus-gold-trim)" strokeWidth="0.4" strokeLinejoin="round">
        {/* Left Front */}
        <path d="M 60 75 C 42 75, 26 62, 34 52 C 44 54, 52 64, 60 75 Z" fill="url(#lotus-petal-front)" />
        {/* Right Front */}
        <path d="M 60 75 C 78 75, 94 62, 86 52 C 76 54, 68 64, 60 75 Z" fill="url(#lotus-petal-front)" />
        {/* Center Cup Front-Left */}
        <path d="M 60 75 C 48 68, 38 52, 50 44 C 58 50, 58 64, 60 75 Z" fill="url(#lotus-petal-front)" />
        {/* Center Cup Front-Right */}
        <path d="M 60 75 C 72 68, 82 52, 70 44 C 62 50, 62 64, 60 75 Z" fill="url(#lotus-petal-front)" />
        {/* Front Bottom-Most */}
        <path d="M 60 75 C 48 76, 42 86, 60 92 C 78 86, 72 76, 60 75 Z" fill="url(#lotus-petal-front)" />
      </g>

      {/* Layer 6: Glowing Stardust Particles (rising from core) */}
      <g>
        {Array.from({ length: 8 }).map((_, i) => {
          const x = 60 + Math.sin(i * 45) * (14 + i * 2);
          const y = 54 - i * 4.5 - Math.cos(i * 45) * 4;
          const size = 0.7 + (i % 3) * 0.4;
          return (
            <circle
              key={`dust-${i}`}
              cx={x}
              cy={y}
              r={size}
              fill="oklch(0.96 0.10 85)"
              opacity={0.35 + (i % 2) * 0.45}
              style={{
                filter: `drop-shadow(0 0 ${size * 1.5}px oklch(0.96 0.16 85))`,
              }}
            />
          );
        })}
      </g>
    </svg>
  );
}


