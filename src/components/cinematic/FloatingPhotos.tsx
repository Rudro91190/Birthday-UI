import { motion } from "framer-motion";
import { useRef } from "react";

export interface FloatingPhotoSpec {
  src: string;
  left: string; // e.g. "12%"
  top: string;  // e.g. "30%"
  size?: number; // kept in interface for compatibility, but we now use responsive tailwind widths
  rotate?: number; // deg
  delay?: number;
  caption?: string;
  hideMobile?: boolean; // new prop to prevent mobile clutter
}

/**
 * Soft polaroid-style photo cards that drift in the background of a scene.
 * CSS-driven sizing & visibility guarantees zero hydration flashes.
 */
export function FloatingPhotos({ photos }: { photos: FloatingPhotoSpec[] }) {
  const isMobile = useRef(typeof window !== "undefined" && window.innerWidth < 768).current;
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      {photos.map((p, i) => {
        const rot = p.rotate ?? (i % 2 === 0 ? -6 : 6);
        return (
          <motion.div
            key={i}
            className={`absolute w-24 sm:w-28 md:w-32 ${p.hideMobile ? "hidden md:block" : ""}`}
            style={{ left: p.left, top: p.top }}
            initial={{ opacity: 0, y: 30, rotate: rot, scale: 0.9 }}
            whileInView={{ opacity: 0.85, y: 0, rotate: rot, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.4, delay: (p.delay ?? 0) + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
            animate={isMobile ? {} : { y: [0, -10, 0], rotate: [rot, rot + 1.5, rot] }}
              transition={{ duration: 7 + (i % 4), repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
              className="rounded-[3px] p-1.5 pb-4 md:p-2 md:pb-6"
              style={{
                background: "linear-gradient(180deg, oklch(0.96 0.03 80) 0%, oklch(0.90 0.05 70) 100%)",
                boxShadow:
                  "0 20px 40px -10px oklch(0 0 0 / 0.7), 0 0 30px oklch(0.86 0.08 0 / 0.18)",
                border: "1px solid oklch(0.84 0.09 55 / 0.45)",
              }}
            >
              <div className="relative w-full overflow-hidden rounded-[2px]" style={{ aspectRatio: "1 / 1" }}>
                <img
                  src={p.src}
                  alt={p.caption ?? "memory of oishi"}
                  loading="lazy"
                  className="h-full w-full object-cover"
                  style={{ filter: "saturate(0.95) contrast(0.98)" }}
                />
                <div className="absolute inset-0" style={{
                  background: "radial-gradient(ellipse at 50% 50%, transparent 50%, oklch(0.20 0.05 30 / 0.35) 100%)",
                }} />
              </div>
              {p.caption && (
                <p className="mt-1 text-center font-display font-medium text-[10px] md:text-[12px] leading-tight text-[oklch(0.22_0.06_30)] truncate px-0.5">
                  {p.caption}
                </p>
              )}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

