import { motion, AnimatePresence } from "framer-motion";
import React, { useMemo, useState, useEffect } from "react";
import { Petals } from "./Petals";
import { Particles } from "./Particles";
import { Lotus } from "./Lotus";
import {
  letterGarden,
  letterMirror,
  letterHands,
  letterCineplex,
  letterCafeSmile,
  letterRickshawRide,
  letterRickshawPlayful,
  letterNightThumbsup,
  letterCampusJerseys,
  letterTheaterSeats,
  letterCineplexHawa,
  letterStudyGlasses,
  letterGardenJerseys,
  letterMirrorNight,
  letterGardenJerseys2,
  letterCafeteriaChat,
  letterFormalDuo,
} from "./photos";

interface LetterKeepsake {
  id: string;
  src: string;
  title: string;
  subtitle: string;
  tag: string;
  note: string;
  rot: number;
  xOffset?: number;
  ySpacing?: number;
}

const KEEPSAKES: LetterKeepsake[] = [
  {
    id: "garden",
    src: letterGarden,
    title: "Under Blooming Skies",
    subtitle: "Rooftop Garden · Bougainvillea",
    tag: "A Moment in Bloom",
    note: "Standing beside you beneath the cascading bougainvillea, with the city breathing softly below us. With a flower tucked in your hair and that sweet, quiet smile, every ordinary rooftop becomes our own little universe.",
    rot: -4,
    xOffset: -8,
    ySpacing: 8,
  },
  {
    id: "mirror",
    src: letterMirror,
    title: "Behind Every Lens",
    subtitle: "Candid Moments · Cafe Courtyard",
    tag: "Unfiltered Love",
    note: "Even when we hide behind our screens with silly poses, my heart is always looking right at you. The sweetest memories are never staged—they are the quiet, playful moments where we simply laugh and be ourselves.",
    rot: 4,
    xOffset: 12,
    ySpacing: 16,
  },
  {
    id: "hands",
    src: letterHands,
    title: "Bound in Every Beat",
    subtitle: "Holding Hands · Aarong & 2026",
    tag: "Always Together",
    note: "A quiet reminder that through every crowded street, every celebration, and every season ahead, your hand gently resting in mine is my calmest sanctuary. Two lives forever intertwined, holding on tight to tomorrow.",
    rot: -3,
    xOffset: 10,
    ySpacing: 20,
  },
  {
    id: "cineplex",
    src: letterCineplex,
    title: "Cinema Nights & Smiles",
    subtitle: "Star Cineplex · Movie Date",
    tag: "Favorite Adventures",
    note: "Ticket stubs may fade, but the sheer joy of standing beside you before the curtains rise never will. Here's to a lifetime of late-night movies, shared popcorn, and endless laughter echoing in dark theaters.",
    rot: 5,
    xOffset: -10,
    ySpacing: 22,
  },
  {
    id: "cafe",
    src: letterCafeSmile,
    title: "Warm Lights & Gentle Smiles",
    subtitle: "Cozy Cafe Table · Afternoon Tea",
    tag: "Quiet Happiness",
    note: "Resting your chin in your hand with that calm, radiant warmth. In a busy cafe surrounded by lantern glow, the world quietly blurs into the background, and all that remains is your smile.",
    rot: -5,
    xOffset: -12,
    ySpacing: 22,
  },
  {
    id: "rickshaw-ride",
    src: letterRickshawRide,
    title: "Breeze Through the Streets",
    subtitle: "Rickshaw Ride · City Twilight",
    tag: "Everyday Magic",
    note: "Wind in our hair, streetlights waking up, and the rhythmic bells of the rickshaw through the evening roads. Riding beside you through the city air makes even the simplest route feel like an unforgettable adventure.",
    rot: 3,
    xOffset: 8,
    ySpacing: 20,
  },
  {
    id: "rickshaw-playful",
    src: letterRickshawPlayful,
    title: "Silly Faces & Pure Joy",
    subtitle: "Candid Rides · Playful Hearts",
    tag: "My Favorite Laughs",
    note: "Your adorable pout, your hand touching your hair, and that unmistakable spark in your eyes. Loving you is finding home in every silly expression and every unfiltered burst of laughter.",
    rot: -3,
    xOffset: 6,
    ySpacing: 24,
  },
  {
    id: "stadium-thumbsup",
    src: letterNightThumbsup,
    title: "Under Night Stadium Lights",
    subtitle: "Game Night Lights · Match Day",
    tag: "Unstoppable Duo",
    note: "Two thumbs up, shared team cheers, and unforgettable midnight energy. No matter the score or the crowd, every game night is a victory simply because I'm experiencing it with you.",
    rot: 4,
    xOffset: -8,
    ySpacing: 22,
  },
  {
    id: "campus-jerseys",
    src: letterCampusJerseys,
    title: "Rival Jerseys, One Heart",
    subtitle: "Campus Stairs · Portugal & Argentina",
    tag: "Our Little Rivalry",
    note: "Even when our football loyalties sit on opposite sides, my eyes will always wander back to admire you. Sitting on campus stairs on quiet afternoons is where I feel most at peace.",
    rot: -4,
    xOffset: -10,
    ySpacing: 22,
  },
  {
    id: "theater-seats",
    src: letterTheaterSeats,
    title: "Before the Screen Lights Up",
    subtitle: "Cinema Hall · Dimmed Lights",
    tag: "Quiet Excitement",
    note: "Waiting in the plush seats as the theater slowly darkens. The best part of every movie has never been on the screen—it's turning to my side and sharing whispered jokes with you.",
    rot: 3,
    xOffset: 10,
    ySpacing: 24,
  },
  {
    id: "cineplex-hawa",
    src: letterCineplexHawa,
    title: "Finger Hearts & Warm Glows",
    subtitle: "Star Cineplex · Premiere Nights",
    tag: "Sweet Keepsakes",
    note: "Beside the glowing marquee lights with your sweet mini-heart. Every outing with you feels like our own private movie premiere, full of style, warmth, and effortless magic.",
    rot: -3,
    xOffset: 8,
    ySpacing: 22,
  },
  {
    id: "study-glasses",
    src: letterStudyGlasses,
    title: "Cheeky Smiles & Glasses",
    subtitle: "Everyday Cozy · Cheek on Hand",
    tag: "My Favorite View",
    note: "Your cute tilted head, round glasses, and that subtle, knowing smile that always melts my heart. Everyday casual moments with you are more breathtaking than any grand celebration.",
    rot: 4,
    xOffset: -6,
    ySpacing: 22,
  },
  {
    id: "garden-jerseys",
    src: letterGardenJerseys,
    title: "Garden & Rival Jerseys",
    subtitle: "Rooftop Garden · Team Colors",
    tag: "Our Beautiful Rivalry",
    note: "Portugal and Argentina side by side under the tropical trees — even on opposite teams, we always end up in the same frame. That easy arm around your shoulder says everything words can't.",
    rot: -4,
    xOffset: -8,
    ySpacing: 22,
  },
  {
    id: "mirror-night",
    src: letterMirrorNight,
    title: "City Lights & Mirror Glow",
    subtitle: "Night Out · Restaurant Mirror",
    tag: "Glowing Evenings",
    note: "The city twinkling outside, warm restaurant lights above, and your perfectly styled evening look caught in the mirror. Every night out with you feels like the opening scene of a movie neither of us wants to end.",
    rot: 4,
    xOffset: 10,
    ySpacing: 20,
  },
  {
    id: "garden-jerseys-2",
    src: letterGardenJerseys2,
    title: "Greenery & Gentle Smiles",
    subtitle: "Campus Garden · Quiet Afternoon",
    tag: "Still & Soft",
    note: "Standing together in the cool green shade, your arm comfortably resting on my shoulder. No grand occasion — just us, the rustling leaves, and the kind of peace that only comes when you're exactly where you belong.",
    rot: -3,
    xOffset: 8,
    ySpacing: 22,
  },
  {
    id: "cafeteria-chat",
    src: letterCafeteriaChat,
    title: "Laughing Over the Table",
    subtitle: "University Cafeteria · Red Booths",
    tag: "Best Conversations",
    note: "That moment when you turned to look at me mid-sentence and your whole face lit up with the most genuine laugh I've ever seen. Every ordinary cafeteria lunch with you becomes a memory worth keeping forever.",
    rot: 3,
    xOffset: -10,
    ySpacing: 22,
  },
  {
    id: "formal-duo",
    src: letterFormalDuo,
    title: "Dressed Up & Side by Side",
    subtitle: "Formal Day · Bright Room",
    tag: "When You Wore That Blazer",
    note: "You in that rose blazer, arms folded with quiet confidence, glasses catching the light — and me trying my best to stand tall beside someone so effortlessly elegant. You make every formal occasion feel like a milestone.",
    rot: -5,
    xOffset: 6,
    ySpacing: 20,
  },
];

const LETTER = [
  "Dear Oishi,",
  "",
  "Happy Birthday, Oishi ❤️",
  "Many, many happy returns of the day. I hope tui tor din onek bhalo katabi with your loved ones. Beshi kichu bolbo na.",
  "",
  "You are the most beautiful thing that has ever happened to me.",
  "You will always be a part of me, no matter what the situation becomes.",
  "I will always love you ❤️, my Doraemon.",
  "",
  "Stay Happy, Stay Blessed, and have a wonderful life ahead.",
  "",
  "Happiest Birthday, my little universe ❤️",
  "",
  "— Rudro",
];

/**
 * Chapter 4 — The Letter:
 * Mobile: keepsake strip → letter paper card → lightbox
 * Desktop: letter flanked by absolutely-positioned photo panels
 */
export function SceneLetter() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const raindrops = useMemo(
    () =>
      Array.from({ length: 25 }).map((_, i) => ({
        i,
        left: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 1.2 + Math.random() * 1.4,
        h: 20 + Math.random() * 40,
      })),
    [],
  );

  // Divide keepsakes evenly into left and right floating streams
  const leftKeepsakes = useMemo(
    () => KEEPSAKES.filter((_, idx) => idx % 2 === 0),
    [],
  );
  const rightKeepsakes = useMemo(
    () => KEEPSAKES.filter((_, idx) => idx % 2 === 1),
    [],
  );

  const currentKeepsake = selectedIndex !== null ? KEEPSAKES[selectedIndex] : null;

  // Keyboard navigation for modal
  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIndex(null);
      else if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) =>
          prev !== null ? (prev - 1 + KEEPSAKES.length) % KEEPSAKES.length : null,
        );
      } else if (e.key === "ArrowRight") {
        setSelectedIndex((prev) =>
          prev !== null ? (prev + 1) % KEEPSAKES.length : null,
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + KEEPSAKES.length) % KEEPSAKES.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % KEEPSAKES.length);
  };

  return (
    <section className="relative pb-32" style={{ minHeight: "100vh" }}>
      {/* Warm room atmospheric background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, oklch(0.35 0.10 50) 0%, oklch(0.22 0.07 35) 45%, oklch(0.12 0.04 295) 100%)",
        }}
      />

      {/* Atmospheric moon & rain in far background */}
      <div className="pointer-events-none absolute inset-0 opacity-25 z-0">
        <div
          className="absolute right-12 top-14 h-32 w-32 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, oklch(0.97 0.02 90), oklch(0.85 0.05 80))",
            boxShadow: "0 0 60px oklch(0.97 0.02 90 / 0.4)",
          }}
        />
        {raindrops.map((r) => (
          <div
            key={r.i}
            className="absolute top-0 w-px bg-gradient-to-b from-transparent via-[var(--cream)]/40 to-transparent"
            style={{
              left: `${r.left}%`,
              height: r.h,
              willChange: "transform",
              animation: `rain-fall ${r.duration}s linear ${r.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Fairy lights at ceiling */}
      <div className="absolute inset-x-0 top-0 flex justify-around px-4 pt-2 opacity-90 z-10 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background: i % 2 ? "oklch(0.95 0.08 80)" : "oklch(0.88 0.07 35)",
              boxShadow:
                "0 0 8px oklch(0.92 0.10 60 / 0.8), 0 0 18px oklch(0.92 0.10 60 / 0.4)",
              animation: `twinkle ${2 + (i % 5) * 0.4}s ease-in-out ${i * 0.1}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Ambient candles & books in distant corners */}
      <div className="pointer-events-none absolute bottom-12 left-6 hidden flex-col items-center gap-2 xl:flex z-10 opacity-70">
        <Candle />
      </div>
      <div className="pointer-events-none absolute bottom-16 left-20 hidden xl:block z-10 opacity-70">
        <BookStack />
      </div>

      <Particles count={20} color="oklch(0.92 0.10 60)" />
      <Petals count={5} slow={1.6} />

      {/* Chapter Title Header */}
      <div className="relative z-10 pt-16 sm:pt-20 text-center px-4 sm:px-6">
        <p className="text-xs font-light uppercase tracking-[0.5em] text-[var(--rose-gold)]/85">
          Chapter Four
        </p>
        <h2 className="mt-2.5 font-display text-[clamp(2rem,5vw,4.2rem)] font-light text-gold-shine animate-shimmer">
          The Letter
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm font-light italic tracking-wider text-[var(--cream)]/75">
          A heartfelt letter surrounded by memories drifting softly on both sides
        </p>
      </div>

      {/* ── MOBILE LAYOUT ── */}
      <div className="lg:hidden relative z-10 mx-auto mt-6 w-full max-w-lg px-4">
        {/* Keepsake horizontal strip */}
        <p className="text-center font-mono text-[10px] tracking-widest text-[var(--rose-gold)]/80 uppercase mb-3">
          ✦ {KEEPSAKES.length} Keepsakes · Tap to read note ✦
        </p>
        <div className="flex gap-3 overflow-x-auto pb-4 pt-1 scrollbar-none px-2" style={{ touchAction: "pan-x pan-y" }}>
          {KEEPSAKES.map((photo, idx) => (
            <FloatingPolaroidCard
              key={photo.id}
              photo={photo}
              idx={idx}
              className="w-[105px] shrink-0"
              onClick={() => setSelectedIndex(idx)}
            />
          ))}
        </div>

        {/* ── THE LETTER — Mobile Paper Card ── */}
        {/* NOTE: whileInView does NOT work inside overflow-y-auto; using animate directly */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-6 mb-10 rounded-sm shadow-2xl"
          style={{
            background: "linear-gradient(180deg, oklch(0.95 0.04 80) 0%, oklch(0.90 0.05 70) 100%)",
            boxShadow: "0 30px 70px -15px oklch(0 0 0 / 0.75), inset 0 0 50px oklch(0.84 0.09 55 / 0.18)",
            color: "oklch(0.25 0.06 30)",
          }}
        >
          {/* Paper texture lines */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06] rounded-sm"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, oklch(0.25 0.06 30) 0 1px, transparent 1px 26px)",
            }}
          />
          <div className="relative px-5 py-7 space-y-3">
            {LETTER.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, delay: 0.5 + i * 0.07, ease: "easeOut" }}
                className={`font-script leading-relaxed ${
                  line === ""
                    ? "h-2"
                    : i === 0
                    ? "text-[1.55rem] text-[oklch(0.20_0.08_25)] font-semibold"
                    : "text-[1.1rem]"
                }`}
              >
                {line || "\u00A0"}
              </motion.p>
            ))}
          </div>
          {/* Lotus Wax Seal */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6, duration: 0.7 }}
            className="absolute -bottom-5 -right-4 rounded-full bg-[var(--lotus-deep)] p-2.5 shadow-xl z-10"
            style={{ boxShadow: "var(--glow-lotus)" }}
            title="Seal of the Universe"
          >
            <Lotus size={30} glow={false} />
          </motion.div>
        </motion.div>
      </div>

      {/* ── DESKTOP LAYOUT ── */}
      <div className="hidden lg:block relative z-10 mx-auto mt-8 w-full max-w-[1440px] px-6">
        {/* Letter in center */}
        <div className="flex justify-center">
          <div className="w-full max-w-[520px] xl:max-w-[560px] shrink-0 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40, rotateX: 15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-sm p-8 sm:p-10 md:p-12 shadow-2xl"
              style={{
                background:
                  "linear-gradient(180deg, oklch(0.95 0.04 80) 0%, oklch(0.90 0.05 70) 100%)",
                boxShadow:
                  "0 40px 80px -20px oklch(0 0 0 / 0.8), inset 0 0 60px oklch(0.84 0.09 55 / 0.22)",
                color: "oklch(0.25 0.06 30)",
                transformOrigin: "top center",
              }}
            >
              {/* Paper texture lines */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, oklch(0.25 0.06 30) 0 1px, transparent 1px 26px)",
                }}
              />
              <div className="relative space-y-3">
                {LETTER.map((line, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                    className={`font-script leading-relaxed ${
                      line === ""
                        ? "h-2"
                        : i === 0
                        ? "text-2xl sm:text-3xl md:text-4xl text-[oklch(0.20_0.08_25)] font-semibold"
                        : "text-lg sm:text-xl md:text-2xl"
                    }`}
                  >
                    {line || "\u00A0"}
                  </motion.p>
                ))}
              </div>
              {/* Lotus Wax Seal */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 2.8, duration: 1 }}
                className="absolute -bottom-6 -right-6 rounded-full bg-[var(--lotus-deep)] p-3 cursor-pointer hover:scale-110 transition-transform shadow-xl"
                style={{ boxShadow: "var(--glow-lotus)" }}
                title="Seal of the Universe"
              >
                <Lotus size={38} glow={false} />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* LEFT side panel */}
        <SidePhotoPanel
          keepsakes={leftKeepsakes}
          side="left"
          allKeepsakes={KEEPSAKES}
          onSelect={setSelectedIndex}
        />

        {/* RIGHT side panel */}
        <SidePhotoPanel
          keepsakes={rightKeepsakes}
          side="right"
          allKeepsakes={KEEPSAKES}
          onSelect={setSelectedIndex}
        />
      </div>

      {/* ── Lightbox Modal ── */}
      <AnimatePresence>
        {currentKeepsake && selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-md"
            style={{ paddingTop: "env(safe-area-inset-top, 12px)", paddingBottom: "env(safe-area-inset-bottom, 12px)" }}
          >
            <motion.div
              key={currentKeepsake.id}
              initial={{ scale: 0.92, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 15, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--rose-gold)]/40 bg-gradient-to-b from-[oklch(0.24_0.07_35)] to-[oklch(0.14_0.05_295)] p-4 sm:p-7 shadow-[0_30px_90px_rgba(0,0,0,0.9)] scrollbar-none"
              style={{ maxHeight: "calc(100vh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 24px)" }}
            >
              {/* Header Navigation Bar */}
              <div className="flex items-center justify-between mb-4 border-b border-[var(--rose-gold)]/20 pb-2">
                <span className="font-mono text-[10px] text-[var(--rose-gold)] tracking-widest uppercase">
                  Memory {String(selectedIndex + 1).padStart(2, "0")} of {String(KEEPSAKES.length).padStart(2, "0")}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--rose-gold)]/30 bg-black/40 text-sm text-[var(--cream)] hover:bg-[var(--rose-gold)]/30 transition-colors"
                    title="Previous photo (Left arrow)"
                  >
                    ←
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--rose-gold)]/30 bg-black/40 text-sm text-[var(--cream)] hover:bg-[var(--rose-gold)]/30 transition-colors"
                    title="Next photo (Right arrow)"
                  >
                    →
                  </button>
                  <button
                    onClick={() => setSelectedIndex(null)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-sm text-[var(--cream)] hover:bg-black/80 transition-colors ml-2"
                    aria-label="Close (Escape)"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-5 items-start md:items-center">
                {/* Polaroid Frame */}
                <div
                  className="w-full max-w-[240px] mx-auto md:mx-0 shrink-0 rounded-[4px] p-3 pb-8"
                  style={{
                    background:
                      "linear-gradient(180deg, oklch(0.97 0.02 80) 0%, oklch(0.92 0.04 70) 100%)",
                    boxShadow:
                      "0 25px 60px -15px rgba(0,0,0,0.8), 0 0 30px oklch(0.86 0.08 0 / 0.3)",
                    border: "1px solid oklch(0.84 0.09 55 / 0.5)",
                  }}
                >
                  <div className="aspect-[3/4] w-full overflow-hidden rounded-[2px]">
                    <img
                      src={currentKeepsake.src}
                      alt={currentKeepsake.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="mt-3 text-center font-display text-sm font-semibold text-[oklch(0.22_0.06_30)]">
                    {currentKeepsake.title}
                  </p>
                  <p className="text-center font-mono text-[10px] text-[oklch(0.40_0.04_30)]">
                    {currentKeepsake.subtitle}
                  </p>
                </div>

                {/* Thoughtful Note Text */}
                <div className="flex-1 text-left">
                  <div className="inline-block rounded-full bg-[var(--rose-gold)]/20 px-3 py-0.5 text-[10px] font-mono uppercase tracking-widest text-[var(--rose-gold)] mb-2">
                    {currentKeepsake.tag}
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-light text-gold-shine">
                    {currentKeepsake.title}
                  </h3>
                  <p className="font-mono text-xs text-[var(--cream)]/60 mb-4">
                    {currentKeepsake.subtitle}
                  </p>

                  <div className="rounded-lg bg-black/25 p-4 border border-[var(--rose-gold)]/20 shadow-inner">
                    <p className="text-xs uppercase tracking-wider text-[var(--rose-gold)] font-mono mb-1.5">
                      A Thoughtful Note
                    </p>
                    <p className="font-script text-lg sm:text-xl leading-relaxed text-[var(--cream)]">
                      "{currentKeepsake.note}"
                    </p>
                  </div>

                  <p className="mt-4 text-xs font-light italic text-[var(--cream)]/60">
                    Forever held in the memory of this universe.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// SidePhotoPanel: absolutely positions ALL photos in a 2-sub-column staggered grid
interface SidePhotoPanelProps {
  keepsakes: LetterKeepsake[];
  side: "left" | "right";
  allKeepsakes: LetterKeepsake[];
  onSelect: (idx: number) => void;
}

function SidePhotoPanel({ keepsakes, side, allKeepsakes, onSelect }: SidePhotoPanelProps) {
  const colA = keepsakes.filter((_, i) => i % 2 === 0);
  const colB = keepsakes.filter((_, i) => i % 2 === 1);

  const panelStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "300px",
    ...(side === "left"
      ? { right: "calc(50% + 268px)" }
      : { left: "calc(50% + 268px)" }),
    display: "flex",
    flexDirection: side === "left" ? "row-reverse" : "row",
    gap: "10px",
    overflow: "visible",
    zIndex: 20,
    pointerEvents: "none",
  };

  const subColStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "stretch",
    overflow: "visible",
  };

  const renderCol = (col: LetterKeepsake[], offsetTop: boolean) =>
    col.map((photo) => {
      const globalIdx = allKeepsakes.findIndex((k) => k.id === photo.id);
      return (
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.6, delay: (globalIdx % 5) * 0.08 }}
          style={{
            pointerEvents: "auto",
            cursor: "pointer",
            marginTop: offsetTop && col.indexOf(photo) === 0 ? "16px" : undefined,
          }}
          onClick={() => onSelect(globalIdx)}
          className="group relative"
        >
          <motion.div
            animate={{
              y: [0, globalIdx % 2 === 0 ? -6 : -4, 0],
              rotate: [photo.rot, photo.rot + (globalIdx % 2 === 0 ? 1.2 : -1.2), photo.rot],
            }}
            transition={{
              duration: 4.5 + (globalIdx % 4) * 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: (globalIdx % 5) * 0.3,
            }}
            whileHover={{ scale: 1.08, rotate: 0, y: -6, zIndex: 50, transition: { duration: 0.2 } }}
            className="rounded-[3px] p-1.5 pb-4"
            style={{
              background: "linear-gradient(180deg, oklch(0.96 0.03 80) 0%, oklch(0.91 0.05 70) 100%)",
              boxShadow: "0 10px 22px -5px oklch(0 0 0 / 0.65), 0 0 12px oklch(0.86 0.08 0 / 0.15)",
              border: "1px solid oklch(0.84 0.09 55 / 0.4)",
            }}
          >
            {/* Washi tape */}
            <div
              className="pointer-events-none absolute -top-1.5 left-1/2 h-2.5 w-8"
              style={{
                background: "oklch(0.95 0.04 80 / 0.65)",
                transform: `translateX(-50%) rotate(${photo.rot * -0.4}deg)`,
              }}
            />
            <div className="relative w-full overflow-hidden rounded-[2px]">
              <img
                src={photo.src}
                alt={photo.title}
                loading="lazy"
                className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
                style={{ filter: "saturate(0.96) contrast(1.02)" }}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="font-mono text-[8px] text-white tracking-wider bg-black/75 px-1.5 py-0.5 rounded">
                  ✦
                </span>
              </div>
            </div>
            <p className="mt-1.5 text-center font-display font-medium text-[9px] text-[oklch(0.22_0.06_30)] truncate px-0.5 leading-tight">
              {photo.title}
            </p>
          </motion.div>
        </motion.div>
      );
    });

  return (
    <div style={panelStyle}>
      <div style={subColStyle}>{renderCol(colA, false)}</div>
      <div style={{ ...subColStyle, paddingTop: "20px" }}>{renderCol(colB, true)}</div>
    </div>
  );
}

interface FloatingPolaroidCardProps {
  photo: LetterKeepsake;
  idx: number;
  className?: string;
  onClick: () => void;
}

function FloatingPolaroidCard({
  photo,
  idx,
  className = "",
  onClick,
}: FloatingPolaroidCardProps) {
  const rot = photo.rot;
  const floatDuration = 4.6 + (idx % 4) * 0.9;
  const floatDelay = (idx % 5) * 0.35;
  const floatY = idx % 2 === 0 ? -10 : -8;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={`relative cursor-pointer group select-none ${className}`}
      onClick={onClick}
    >
      {/* Floating Bobbing Wrapper */}
      <motion.div
        animate={{
          y: [0, floatY, 0],
          rotate: [rot, rot + (idx % 2 === 0 ? 1.5 : -1.5), rot],
        }}
        transition={{
          duration: floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: floatDelay,
        }}
        whileHover={{
          scale: 1.12,
          rotate: 0,
          y: -12,
          zIndex: 50,
          transition: { duration: 0.22, ease: "easeOut" },
        }}
        className="rounded-[3px] p-2 pb-3.5 transition-all duration-300 group-hover:shadow-[0_20px_45px_-5px_rgba(0,0,0,0.85),0_0_25px_oklch(0.86_0.08_0/0.4)]"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.96 0.03 80) 0%, oklch(0.91 0.05 70) 100%)",
          boxShadow:
            "0 14px 28px -7px oklch(0 0 0 / 0.65), 0 0 16px oklch(0.86 0.08 0 / 0.18)",
          border: "1px solid oklch(0.84 0.09 55 / 0.45)",
          willChange: "transform",
        }}
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2px] bg-black/10">
          <img
            src={photo.src}
            alt={photo.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            style={{ filter: "saturate(0.96) contrast(1.02)" }}
          />

          {/* Hover overlay hint */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1 text-center">
            <span className="font-mono text-[9px] text-white tracking-wider bg-black/75 px-2 py-0.5 rounded shadow">
              Read note ✦
            </span>
          </div>
        </div>

        <p className="mt-1.5 text-center font-display font-medium text-[11px] text-[oklch(0.22_0.06_30)] truncate px-0.5">
          {photo.title}
        </p>
        <p className="line-clamp-2 px-0.5 text-center font-script text-[10px] leading-tight text-[oklch(0.35_0.05_30)] mt-0.5 opacity-80 group-hover:opacity-100">
          "{photo.note}"
        </p>
      </motion.div>

      {/* Washi tape effect */}
      <div
        className="pointer-events-none absolute -top-1.5 left-1/2 h-2.5 w-10 -translate-x-1/2"
        style={{
          background: "oklch(0.95 0.04 80 / 0.65)",
          boxShadow: "0 1px 3px oklch(0 0 0 / 0.25)",
          transform: `translateX(-50%) rotate(${rot * -0.5}deg)`,
        }}
      />
    </motion.div>
  );
}

function Candle() {
  return (
    <div className="relative flex flex-col items-center">
      <div
        className="h-3 w-3 rounded-full animate-candle"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, oklch(0.97 0.18 90), oklch(0.78 0.20 50))",
          boxShadow:
            "0 0 24px oklch(0.85 0.18 60 / 0.9), 0 0 60px oklch(0.85 0.18 60 / 0.5)",
        }}
      />
      <div className="mt-1 h-16 w-3 rounded-sm bg-gradient-to-b from-[var(--cream)] to-[oklch(0.78_0.05_70)]" />
    </div>
  );
}

function BookStack() {
  return (
    <div className="space-y-1">
      {[
        { w: 90, c: "oklch(0.35 0.12 5)" },
        { w: 80, c: "oklch(0.30 0.10 305)" },
        { w: 100, c: "oklch(0.32 0.10 50)" },
      ].map((b, i) => (
        <div
          key={i}
          className="h-5 rounded-sm"
          style={{
            width: b.w,
            background: b.c,
            boxShadow: "0 4px 10px oklch(0 0 0 / 0.5)",
          }}
        />
      ))}
    </div>
  );
}
