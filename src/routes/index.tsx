import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { LoadingScene } from "@/components/cinematic/LoadingScene";
import { SceneLake } from "@/components/cinematic/SceneLake";
import { SceneLibrary } from "@/components/cinematic/SceneLibrary";
import { SceneGallery } from "@/components/cinematic/SceneGallery";
import { SceneLetter } from "@/components/cinematic/SceneLetter";
import { SceneFinale } from "@/components/cinematic/SceneFinale";
import { SceneEnding } from "@/components/cinematic/SceneEnding";
import { DreamVoid } from "@/components/cinematic/DreamVoid";
import { ChapterHUD } from "@/components/cinematic/ChapterHUD";
import { MusicProvider } from "@/components/cinematic/MusicPlayer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Little Universe for Oishi" },
      { name: "description", content: "A cinematic, dreamy fantasy birthday universe for Sadia Rahman Oishi — lotuses, books, memories, and starlight." },
      { property: "og:title", content: "A Little Universe for Oishi" },
      { property: "og:description", content: "A cinematic fantasy birthday story written between dreams, books, and lotus light." },
    ],
  }),
  component: Index,
});

interface Scene3DWrapperProps {
  children: React.ReactNode;
  progress: any;
  fadeInStart: number;
  fadeInEnd: number;
  fadeOutStart: number;
  fadeOutEnd: number;
}

function Scene3DWrapper({
  children,
  progress,
  fadeInStart,
  fadeInEnd,
  fadeOutStart,
  fadeOutEnd,
}: Scene3DWrapperProps) {
  const opacity = useTransform(
    progress,
    [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
    [0, 1, 1, 0]
  );
  const scale = useTransform(
    progress,
    [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
    [0.7, 1, 1, 1.4]
  );
  const z = useTransform(
    progress,
    [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
    [-600, 0, 0, 600]
  );

  const rotateX = useTransform(
    progress,
    [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
    [10, 0, 0, -10]
  );
  const rotateY = useTransform(
    progress,
    [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
    [-6, 0, 0, 6]
  );

  const pointerEvents = useTransform(opacity, (o) => (o > 0.85 ? "auto" : "none"));

  return (
    <motion.div
      style={{
        opacity,
        scale,
        z,
        rotateX,
        rotateY,
        pointerEvents,
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
      }}
      className="absolute inset-0 w-full h-full overflow-hidden"
    >
      <div className="w-full h-full overflow-y-auto overflow-x-hidden scrollbar-none">
        {children}
      </div>
    </motion.div>
  );
}

interface WhisperSceneProps {
  whisper: string;
  progress: any;
  start: number;
  end: number;
}

function WhisperScene({ whisper, progress, start, end }: WhisperSceneProps) {
  const mid = (start + end) / 2;
  const opacity = useTransform(progress, [start, mid - 0.02, mid + 0.02, end], [0, 1, 1, 0]);
  const scale = useTransform(progress, [start, mid, end], [0.85, 1, 1.2]);
  const z = useTransform(progress, [start, mid, end], [-300, 0, 300]);
  const pointerEvents = useTransform(opacity, (o) => (o > 0.5 ? "auto" : "none"));

  return (
    <motion.section
      style={{
        opacity,
        scale,
        z,
        pointerEvents,
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
      }}
      className="absolute inset-0 flex items-center justify-center px-6"
    >
      <p
        className="font-display text-center text-[clamp(1.1rem,2.6vw,1.9rem)] font-light italic text-[var(--cream)]/85"
        style={{
          textShadow: "0 0 40px oklch(0.86 0.08 0 / 0.5), 0 0 80px oklch(0.84 0.09 55 / 0.3)",
          letterSpacing: "0.18em",
        }}
      >
        {whisper}
      </p>
    </motion.section>
  );
}

function Index() {
  const [entered, setEntered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Tighter, more responsive spring physics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 25,
    mass: 0.6,
  });

  // Performance-boosting dynamic mounting (virtualization) mask
  const [mountedScenes, setMountedScenes] = useState<Record<number, boolean>>({ 0: true });

  useEffect(() => {
    if (!entered) return;

    return scrollYProgress.on("change", (v) => {
      const active: Record<number, boolean> = {};
      active[0] = v <= 0.18;
      active[1] = v >= 0.09 && v <= 0.20;
      active[2] = v >= 0.13 && v <= 0.36;
      active[3] = v >= 0.27 && v <= 0.38;
      active[4] = v >= 0.31 && v <= 0.54;
      active[5] = v >= 0.45 && v <= 0.56;
      active[6] = v >= 0.49 && v <= 0.72;
      active[7] = v >= 0.63 && v <= 0.74;
      active[8] = v >= 0.70 && v <= 0.93;
      active[9] = v >= 0.84 && v <= 0.95;
      active[10] = v >= 0.88;

      setMountedScenes((prev) => {
        let changed = false;
        for (let i = 0; i <= 10; i++) {
          if (!!prev[i] !== !!active[i]) {
            changed = true;
            break;
          }
        }
        return changed ? active : prev;
      });
    });
  }, [scrollYProgress, entered]);

  return (
    <MusicProvider>
      <main
        ref={containerRef}
        className={`relative w-full bg-[var(--night)] text-[var(--cream)] overflow-x-hidden ${entered ? "h-[750vh]" : "h-screen overflow-hidden"
          }`}
      >
        {!entered && <LoadingScene onComplete={() => setEntered(true)} />}

      {entered && (
        <div
          className="fixed inset-0 h-screen w-full overflow-hidden"
          style={{ perspective: 1200, transformStyle: "preserve-3d" }}
        >
          <DreamVoid />
          <ChapterHUD />

          {/* Chapter 1: SceneLake */}
          {mountedScenes[0] && (
            <Scene3DWrapper
              progress={smoothProgress}
              fadeInStart={-0.1}
              fadeInEnd={0.0}
              fadeOutStart={0.11}
              fadeOutEnd={0.16}
            >
              <SceneLake />
            </Scene3DWrapper>
          )}

          {/* Whisper 1 */}
          {mountedScenes[1] && (
            <WhisperScene
              whisper="…and the lake whispered her into a library of dreams."
              progress={smoothProgress}
              start={0.11}
              end={0.18}
            />
          )}

          {/* Chapter 2: SceneLibrary */}
          {mountedScenes[2] && (
            <Scene3DWrapper
              progress={smoothProgress}
              fadeInStart={0.15}
              fadeInEnd={0.18}
              fadeOutStart={0.29}
              fadeOutEnd={0.34}
            >
              <SceneLibrary />
            </Scene3DWrapper>
          )}

          {/* Whisper 2 */}
          {mountedScenes[3] && (
            <WhisperScene
              whisper="every page turned into a memory of her."
              progress={smoothProgress}
              start={0.29}
              end={0.36}
            />
          )}

          {/* Chapter 3: SceneGallery */}
          {mountedScenes[4] && (
            <Scene3DWrapper
              progress={smoothProgress}
              fadeInStart={0.33}
              fadeInEnd={0.36}
              fadeOutStart={0.47}
              fadeOutEnd={0.52}
            >
              <SceneGallery />
            </Scene3DWrapper>
          )}

          {/* Whisper 3 */}
          {mountedScenes[5] && (
            <WhisperScene
              whisper="every memory became a word… and the words became a letter."
              progress={smoothProgress}
              start={0.47}
              end={0.54}
            />
          )}

          {/* Chapter 4: SceneLetter */}
          {mountedScenes[6] && (
            <Scene3DWrapper
              progress={smoothProgress}
              fadeInStart={0.51}
              fadeInEnd={0.54}
              fadeOutStart={0.65}
              fadeOutEnd={0.7}
            >
              <SceneLetter />
            </Scene3DWrapper>
          )}

          {/* Whisper 4 */}
          {mountedScenes[7] && (
            <WhisperScene
              whisper="and the letter ended where the wish begins…"
              progress={smoothProgress}
              start={0.65}
              end={0.72}
            />
          )}

          {/* Chapter 5: SceneFinale */}
          {mountedScenes[8] && (
            <Scene3DWrapper
              progress={smoothProgress}
              fadeInStart={0.72}
              fadeInEnd={0.75}
              fadeOutStart={0.86}
              fadeOutEnd={0.91}
            >
              <SceneFinale />
            </Scene3DWrapper>
          )}

          {/* Whisper 5 */}
          {mountedScenes[9] && (
            <WhisperScene
              whisper="sleep softly, dreamer. the story keeps you."
              progress={smoothProgress}
              start={0.86}
              end={0.93}
            />
          )}

          {/* Chapter 6: SceneEnding */}
          {mountedScenes[10] && (
            <Scene3DWrapper
              progress={smoothProgress}
              fadeInStart={0.9}
              fadeInEnd={0.93}
              fadeOutStart={1.0}
              fadeOutEnd={1.1}
            >
              <SceneEnding />
            </Scene3DWrapper>
          )}
        </div>
      )}
      </main>
    </MusicProvider>
  );
}
