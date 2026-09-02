import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";
import { Petals } from "./Petals";
import { Particles } from "./Particles";

import p01 from "@/assets/oishi/p01.png";
import p02 from "@/assets/oishi/p02.png";
import p03 from "@/assets/oishi/p03.png";
import p04 from "@/assets/oishi/p04.png";
import p05 from "@/assets/oishi/p05.png";
import p06 from "@/assets/oishi/p06.png";
import p07 from "@/assets/oishi/p07.png";
import p08 from "@/assets/oishi/p08.png";
import p09 from "@/assets/oishi/p09.png";
import p10 from "@/assets/oishi/p10.png";
import p11 from "@/assets/oishi/p11.png";
import p12 from "@/assets/oishi/p12.png";
import p13 from "@/assets/oishi/p13.png";
import p14 from "@/assets/oishi/p14.jpg";
import p15 from "@/assets/oishi/p15.jpg";
import p16 from "@/assets/oishi/p16.jpg";
import p17 from "@/assets/oishi/p17.jpg";
import p18 from "@/assets/oishi/p18.jpg";
import p19 from "@/assets/oishi/p19.jpg";
import p20 from "@/assets/oishi/p20.jpg";
import p21 from "@/assets/oishi/p21.jpg";
import p22 from "@/assets/oishi/p22.jpg";
import p23 from "@/assets/oishi/p23.jpg";
import p24 from "@/assets/oishi/p24.jpg";
import p25 from "@/assets/oishi/p25.jpg";
import p26 from "@/assets/oishi/p26.jpg";
import p27 from "@/assets/oishi/p27.jpg";
import p28 from "@/assets/oishi/p28.jpg";
import p29 from "@/assets/oishi/p29.jpg";
import p30 from "@/assets/oishi/p30.jpg";
import p31 from "@/assets/oishi/p31.jpg";
import p32 from "@/assets/oishi/p32.jpg";
import p33 from "@/assets/oishi/p33.jpg";
import p34 from "@/assets/oishi/p34.jpg";
import p35 from "@/assets/oishi/p35.jpg";
import p36 from "@/assets/oishi/p36.jpg";
import p37 from "@/assets/oishi/p37.jpg";
import p38 from "@/assets/oishi/p38.jpg";

const PHOTOS = [
  p01, p02, p03, p04, p05, p06, p07, p08, p09, p10,
  p11, p12, p13, p14, p15, p16, p17, p18, p19,
  p20, p21, p22, p23, p24, p25, p26, p27, p28, p29, p30,
  p31, p32, p33, p34, p35, p36, p37, p38,
];

const CAPTIONS = [
  "soft afternoons under the trees",
  "city light caught in your hair",
  "the night you became poetry",
  "petals on the grass",
  "stillness in green",
  "smile that warms a season",
  "rooftop, golden hour",
  "wind, red, and you",
  "lost inside a chapter",
  "monstera and quiet courage",
  "a rose in your hair",
  "a private kind of peace",
  "playful between the bricks",
  "rain-soft, jasmine-light",
  "laughter held close",
  "campus light, distant dreams",
  "moments shared",
  "rooftop smiles together",
  "warmth in every glance",
  "grace wrapped in blossoms",
  "golden threads of twilight",
  "a gaze that speaks novels",
  "starlit and fearless",
  "sunflower soul, sunset heart",
  "sunlit gaze, flower in your hair",
  "eyes closed in summer peace",
  "indigo glow and gentle thoughts",
  "late night dreams, soft blue glow",
  "eyes that mirror a thousand stories",
  "a wish whispered to the stars",
  "wishes dreaming in the quiet air",
  "framed in glasses, quiet elegance",
  "a gentle glance across the table",
  "quiet thoughts, soft stillness",
  "afternoon walks under green canopies",
  "lost in quiet contemplation",
  "quiet moments in between",
  "blooming under rooftop skies",
];

// Fibonacci sphere point distribution of photos
const SPHERE_POINTS = PHOTOS.map((src, i) => {
  const count = PHOTOS.length;
  const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
  const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);

  return {
    src,
    caption: CAPTIONS[i],
    globalIdx: i,
    x0: Math.sin(phi) * Math.cos(theta),
    y0: Math.sin(phi) * Math.sin(theta),
    z0: Math.cos(phi),
  };
});

// Deterministic golden-angle galaxy dispersion for exploded state
const EXPLODED_POINTS = PHOTOS.map((_, i) => {
  const count = PHOTOS.length;
  const goldenAngle = i * 2.3999632; // ~137.5° in radians
  const rRatio = 0.28 + Math.sqrt((i + 1) / count) * 0.72;
  const jitterX = Math.sin(i * 4.7) * 28;
  const jitterY = Math.cos(i * 3.9) * 28;
  const tilt = Math.sin(i * 2.7) * 18; // -18° to +18° tilt

  return {
    cosAngle: Math.cos(goldenAngle),
    sinAngle: Math.sin(goldenAngle),
    rRatio,
    jitterX,
    jitterY,
    tilt,
  };
});

export function SceneGallery() {
  const [active, setActive] = useState<number | null>(null);
  const [isExploded, setIsExploded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // ── Fix: store angles in refs to avoid stale closure / duplicate-RAF glitch ──
  const angleXRef = useRef(-5);
  const angleYRef = useRef(0);
  const autoRotateRef = useRef(true);
  const isDraggingRef = useRef(false);
  const hoveredRef = useRef<number | null>(null);
  const isExplodedRef = useRef(false);

  // Mirror state → refs so RAF always reads latest value without re-running effect
  const [renderAngles, setRenderAngles] = useState({ x: -5, y: 0 });

  const animRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const dragStartRef = useRef({ x: 0, y: 0, angleX: 0, angleY: 0, time: 0, captured: false });

  // Keep isExploded ref in sync
  useEffect(() => {
    isExplodedRef.current = isExploded;
  }, [isExploded]);

  // Keep hovered ref in sync
  useEffect(() => {
    hoveredRef.current = hoveredIdx;
  }, [hoveredIdx]);

  // Monitor resize for mobile styles — debounced to avoid rapid state spam
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 80);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout);
    };
  }, []);

  // Single persistent RAF loop — never re-created, reads from refs
  useEffect(() => {
    const tick = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05); // cap dt to prevent jumps
      lastTimeRef.current = time;

      if (autoRotateRef.current && !isDraggingRef.current && hoveredRef.current === null && !isExplodedRef.current) {
        angleYRef.current += dt * 10;
        angleXRef.current += Math.sin(time / 2000) * dt * 2;
        setRenderAngles({ x: angleXRef.current, y: angleYRef.current });
      }

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animRef.current);
      lastTimeRef.current = 0;
    };
  }, []); // ← empty deps — one persistent loop, uses refs only

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isExplodedRef.current) return;
      isDraggingRef.current = true;
      autoRotateRef.current = false;
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        angleX: angleXRef.current,
        angleY: angleYRef.current,
        time: Date.now(),
        captured: false,
      };
    },
    [],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingRef.current || isExplodedRef.current) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;

      // If pointer is not yet captured, check if drag is horizontal (rotate) or vertical (scroll page)
      if (!dragStartRef.current.captured) {
        // If movement is predominantly vertical, user is scrolling the page -> don't capture!
        if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 4) {
          isDraggingRef.current = false;
          setIsDragging(false);
          return;
        }

        // If drag is predominantly horizontal, capture pointer to spin sphere
        if (Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy) * 1.1) {
          const target = e.currentTarget as HTMLElement;
          if (target.setPointerCapture) {
            try {
              target.setPointerCapture(e.pointerId);
            } catch (err) {
              // Ignore
            }
          }
          dragStartRef.current.captured = true;
        } else {
          return;
        }
      }

      const sensitivity = isMobile ? 0.35 : 0.22;
      angleYRef.current = dragStartRef.current.angleY - dx * sensitivity;
      if (!isMobile) {
        angleXRef.current = dragStartRef.current.angleX - dy * sensitivity;
      }
      setRenderAngles({ x: angleXRef.current, y: angleYRef.current });
    },
    [isMobile],
  );

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = false;
    setIsDragging(false);
    if (dragStartRef.current.captured) {
      const target = e.currentTarget as HTMLElement;
      if (target.releasePointerCapture) {
        target.releasePointerCapture(e.pointerId);
      }
    }
    const resumeTimeout = setTimeout(() => {
      autoRotateRef.current = true;
      lastTimeRef.current = 0; // reset dt to prevent a jump on resume
    }, 3500);
    return () => clearTimeout(resumeTimeout);
  }, []);

  // Select item only on click (no significant drag movement)
  const handleSelect = useCallback((globalIdx: number, e: React.MouseEvent) => {
    const dx = Math.abs(e.clientX - dragStartRef.current.x);
    const dy = Math.abs(e.clientY - dragStartRef.current.y);
    const dt = Date.now() - dragStartRef.current.time;
    if ((isExplodedRef.current || (dx < 5 && dy < 5 && dt < 280))) {
      setActive(globalIdx);
    }
  }, []);

  // Compute 3D positions mapped to 2D screen coordinate values
  const sphereRadius = isMobile ? 130 : 250;
  const cardW = isMobile ? 78 : 120;
  const cardH = isMobile ? 100 : 155;

  const radX = (renderAngles.x * Math.PI) / 180;
  const radY = (renderAngles.y * Math.PI) / 180;

  const cards = SPHERE_POINTS.map((p) => {
    // 3D rotation math around Y-axis
    const x1 = p.x0 * Math.cos(radY) - p.z0 * Math.sin(radY);
    const z1 = p.x0 * Math.sin(radY) + p.z0 * Math.cos(radY);
    const y1 = p.y0;

    // 3D rotation math around X-axis
    const y2 = y1 * Math.cos(radX) - z1 * Math.sin(radX);
    const z2 = y1 * Math.sin(radX) + z1 * Math.cos(radX);
    const x2 = x1;

    // Project points onto sphere radius
    const px = x2 * sphereRadius;
    const py = y2 * sphereRadius;
    const pz = z2 * sphereRadius;

    // Calculate depth scale and opacity
    const depth = (pz + sphereRadius) / (2 * sphereRadius);
    const scale = 0.55 + depth * 0.48;
    const opacity = 0.3 + depth * 0.7;
    const zIndex = Math.round(depth * 100);

    return {
      ...p,
      px,
      py,
      depth,
      scale,
      opacity,
      zIndex,
    };
  });

  return (
    <section className="relative min-h-screen overflow-hidden py-16">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, oklch(0.28 0.08 320) 0%, oklch(0.14 0.05 295) 50%, oklch(0.10 0.04 290) 100%)",
        }}
      />
      <Particles count={70} />
      <Petals count={14} />

      {/* Heading */}
      <div className="relative z-10 text-center px-4 sm:px-6">
        <p className="text-xs font-light uppercase tracking-[0.5em] text-[var(--lotus)]/70">Chapter Two</p>
        <h2 className="mt-4 font-display text-[clamp(1.8rem,6vw,4.5rem)] font-light text-lotus-shine">
          Memory Gallery
        </h2>
        <p className="mx-auto mt-4 max-w-xl font-display text-sm italic text-[var(--cream)]/70 md:text-base">
          {isMobile ? "drag to spin · tap to reveal · explode to scatter" : "spin the sphere — every memory has a story."}
        </p>

        {/* Explode / Revolve Toggle Button */}
        <div className="mt-5 flex justify-center items-center">
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsExploded((prev) => !prev);
              isExplodedRef.current = !isExplodedRef.current;
            }}
            className="group relative inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-xs font-mono tracking-[0.25em] uppercase transition-all duration-300 backdrop-blur-md cursor-pointer"
            style={{
              background: isExploded
                ? "linear-gradient(135deg, oklch(0.86 0.12 340 / 0.3) 0%, oklch(0.84 0.09 55 / 0.25) 100%)"
                : "linear-gradient(135deg, oklch(0.26 0.07 310 / 0.85) 0%, oklch(0.16 0.04 290 / 0.9) 100%)",
              border: isExploded
                ? "1.5px solid var(--lotus)"
                : "1px solid oklch(0.84 0.09 55 / 0.45)",
              color: "var(--cream)",
              boxShadow: isExploded
                ? "0 0 25px var(--lotus), 0 0 50px oklch(0.84 0.09 55 / 0.35)"
                : "0 8px 24px -4px oklch(0 0 0 / 0.55)",
            }}
          >
            <span className="text-sm leading-none text-[var(--lotus)] transition-transform duration-500 group-hover:rotate-180">
              {isExploded ? "↺" : "✦"}
            </span>
            <span className="font-semibold tracking-[0.2em]">
              {isExploded ? "Revolve Sphere" : "Explode Memories"}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Revolve / Explode Container */}
      <div
        className="relative z-10 mx-auto mt-8 select-none flex justify-center items-center transition-all duration-700"
        style={{
          height: isExploded
            ? isMobile ? "min(75vh, 520px)" : "min(82vh, 680px)"
            : isMobile ? "min(65vh, 440px)" : "min(72vh, 560px)",
          cursor: isExploded ? "default" : isDragging ? "grabbing" : "grab",
          touchAction: "pan-y", // allow natural vertical page scrolling on phone at all times
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* Render 3D billboarded cards */}
        {cards.map((card) => {
          const isHovered = hoveredIdx === card.globalIdx;
          const isAnyHovered = hoveredIdx !== null;
          const isOtherHovered = isAnyHovered && !isHovered;

          // Exploded position calculations
          const exp = EXPLODED_POINTS[card.globalIdx];
          const spreadX = isMobile ? 155 : 460;
          const spreadY = isMobile ? 195 : 255;
          const explodeX = exp.cosAngle * spreadX * exp.rRatio + exp.jitterX;
          const explodeY = exp.sinAngle * spreadY * exp.rRatio + exp.jitterY;
          const explodeZ = Math.round(100 + (card.globalIdx % 12) * 15);
          const explodeRot = exp.tilt;
          const explodeScale = isMobile ? 0.68 : 0.88;

          const currentX = isExploded ? explodeX : card.px;
          const currentY = isExploded ? explodeY : (isHovered ? card.py - 12 : card.py);
          const currentScale = isExploded
            ? isHovered
              ? isMobile ? 1.05 : 1.2
              : explodeScale
            : (isHovered ? 1.2 : card.scale);
          const currentRotate = isExploded ? (isHovered ? 0 : explodeRot) : 0;
          const currentOpacity = isExploded
            ? isHovered
              ? 1.0
              : isOtherHovered
              ? 0.45
              : 0.95
            : (isHovered ? 1.0 : isOtherHovered ? card.opacity * 0.35 : card.opacity);
          const currentZIndex = isHovered ? 500 : isExploded ? explodeZ : card.zIndex;
          const filter = isOtherHovered ? "blur(2.5px) grayscale(0.15)" : "none";

          return (
            <button
              key={card.globalIdx}
              className="pointer-events-auto absolute select-none"
              style={{
                width: cardW,
                height: cardH,
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) translate3d(${currentX}px, ${currentY}px, 0) rotate(${currentRotate}deg) scale(${currentScale})`,
                opacity: currentOpacity,
                zIndex: currentZIndex,
                filter: filter,
                transition: isExploded
                  ? "transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease, filter 0.4s ease"
                  : "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease, filter 0.4s ease",
              }}
              onMouseEnter={() => setHoveredIdx(card.globalIdx)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={(e) => handleSelect(card.globalIdx, e)}
            >
              <div
                className="h-full w-full rounded-[3px] p-1.5 pb-5 transition-all duration-300"
                style={{
                  background: "linear-gradient(180deg, #fdfbf7 0%, #f7f3eb 100%)",
                  boxShadow: isHovered
                    ? "0 25px 50px -12px oklch(0 0 0 / 0.75), 0 0 35px var(--lotus), 0 0 15px var(--rose-gold)"
                    : isExploded
                    ? "0 12px 28px -6px oklch(0 0 0 / 0.6), 0 0 16px oklch(0.86 0.08 0 / 0.15)"
                    : card.depth > 0.65
                    ? "0 12px 25px -8px oklch(0 0 0 / 0.55), 0 0 15px oklch(0.86 0.08 0 / 0.1)"
                    : "0 6px 12px -4px oklch(0 0 0 / 0.4)",
                  border: isHovered
                    ? "1.5px solid var(--lotus)"
                    : isExploded
                    ? "1px solid oklch(0.84 0.09 55 / 0.5)"
                    : "1px solid oklch(0.84 0.09 55 / 0.35)",
                }}
              >
                <div
                  className="w-full overflow-hidden rounded-[2px]"
                  style={{ height: "calc(100% - 20px)" }}
                >
                  <img
                    src={card.src}
                    alt={card.caption}
                    loading="lazy"
                    draggable={false}
                    className="h-full w-full object-cover transition-transform duration-500"
                    style={{
                      transform: isHovered ? "scale(1.08)" : "scale(1)",
                      filter: isHovered
                        ? "saturate(1.1) brightness(1.05)"
                        : isExploded
                        ? "saturate(1) brightness(1)"
                        : card.depth > 0.5
                        ? "saturate(1) brightness(1)"
                        : "saturate(0.75) brightness(0.82)",
                    }}
                  />
                </div>
                <p className="mt-1 text-center font-script text-[10px] leading-none truncate px-0.5 transition-colors duration-300 select-none text-indigo-950 font-bold">
                  {card.caption}
                </p>
              </div>
            </button>
          );
        })}

        {/* Center Glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-700"
          style={{
            width: isExploded ? (isMobile ? 280 : 450) : (isMobile ? 200 : 300),
            height: isExploded ? (isMobile ? 280 : 450) : (isMobile ? 200 : 300),
            background: isExploded
              ? "radial-gradient(circle, oklch(0.86 0.12 340 / 0.18) 0%, oklch(0.84 0.09 55 / 0.08) 50%, transparent 70%)"
              : "radial-gradient(circle, oklch(0.86 0.08 0 / 0.12) 0%, transparent 70%)",
            filter: "blur(45px)",
            opacity: isExploded ? 0.8 : 1,
          }}
        />
      </div>

      {/* Drag Hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.55 }}
        className="relative z-10 mt-2 text-center text-[10px] uppercase tracking-[0.35em] text-[var(--cream)]/60 font-light px-4"
      >
        {isExploded
          ? "✦ scattered galaxy · tap card to view · tap button to revolve"
          : isMobile
          ? "drag to spin · tap to reveal"
          : "drag to spin · hover to focus · click to reveal · explode to scatter"}
      </motion.p>

      {/* Lightbox */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[var(--night)]/85 backdrop-blur-xl px-4 py-8"
            onClick={() => setActive(null)}
          >
            <Petals count={20} />
            <motion.div
              initial={{ scale: 0.85, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, y: 30, opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col justify-center"
              style={{
                maxWidth: "500px",
                width: "90vw",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="rounded-[3px] bg-[#fdfbf7] p-3.5 pb-10 flex flex-col overflow-hidden"
                style={{
                  boxShadow: "0 30px 100px -20px oklch(0 0 0 / 0.85), 0 0 50px var(--lotus)",
                  border: "1px solid oklch(0.9 0.03 80)",
                }}
              >
                <div className="relative overflow-hidden aspect-[4/5] bg-neutral-900 rounded-[1px] flex items-center justify-center">
                  <img
                    src={PHOTOS[active]}
                    alt={CAPTIONS[active]}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p
                  className="mt-6 text-center font-script text-xl sm:text-3xl text-indigo-950 px-2 select-none"
                  style={{
                    textShadow: "0 1px 1px oklch(0 0 0 / 0.05)",
                  }}
                >
                  {CAPTIONS[active]}
                </p>
              </div>
              <button
                onClick={() => setActive(null)}
                className="absolute -top-10 right-0 text-xs font-light tracking-[0.3em] text-[var(--cream)]/70 transition hover:text-[var(--cream)] py-1"
              >
                CLOSE ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
