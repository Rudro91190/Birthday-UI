import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MusicContextType {
  isPlaying: boolean;
  isReady: boolean;
  toggle: () => void;
  play: () => void;
  pause: () => void;
}

const MusicContext = createContext<MusicContextType>({
  isPlaying: false,
  isReady: false,
  toggle: () => {},
  play: () => {},
  pause: () => {},
});

export const useMusic = () => useContext(MusicContext);

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

const VIDEO_ID = "rtOvBOTyX00"; // Christina Perri - A Thousand Years

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<any>(null);
  const userInteractedRef = useRef(false);

  useEffect(() => {
    // 1. Load YouTube Iframe API script if not already present
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // 2. Initialize player when YT is ready
    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;

      try {
        playerRef.current = new window.YT.Player("youtube-audio-player", {
          videoId: VIDEO_ID,
          playerVars: {
            autoplay: 1,
            loop: 1,
            playlist: VIDEO_ID,
            playsinline: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            rel: 0,
            modestbranding: 1,
          },
          events: {
            onReady: (event: any) => {
              setIsReady(true);
              try {
                event.target.setVolume(85);
                event.target.playVideo();
              } catch (e) {
                // Browser might require user interaction first
              }
            },
            onStateChange: (event: any) => {
              // YT.PlayerState.PLAYING === 1
              if (event.data === 1) {
                setIsPlaying(true);
              } else if (event.data === 2 || event.data === 0) {
                // 2 = PAUSED, 0 = ENDED
                setIsPlaying(false);
              }
            },
            onError: (err: any) => {
              console.warn("YouTube audio player note:", err);
            },
          },
        });
      } catch (err) {
        console.warn("YT player initialization error:", err);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        initPlayer();
      };
    }

    // 3. User interaction listener to trigger audio playback (required on mobile / iOS Safari)
    const handleFirstGesture = () => {
      if (!userInteractedRef.current) {
        userInteractedRef.current = true;
        if (playerRef.current && typeof playerRef.current.playVideo === "function") {
          try {
            playerRef.current.playVideo();
          } catch (e) {
            // Ignored
          }
        }
      }
    };

    window.addEventListener("click", handleFirstGesture, { passive: true });
    window.addEventListener("touchstart", handleFirstGesture, { passive: true });

    return () => {
      window.removeEventListener("click", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // Ignore
        }
      }
    };
  }, []);

  const play = () => {
    userInteractedRef.current = true;
    if (playerRef.current && typeof playerRef.current.playVideo === "function") {
      try {
        playerRef.current.playVideo();
        setIsPlaying(true);
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const pause = () => {
    if (playerRef.current && typeof playerRef.current.pauseVideo === "function") {
      try {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const toggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  return (
    <MusicContext.Provider value={{ isPlaying, isReady, toggle, play, pause }}>
      {children}

      {/* Floating Noticeable & Elegant Music Widget */}
      <FloatingMusicWidget />

      {/* Invisible YouTube container rendered offscreen so audio plays uninterrupted */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "2px",
          height: "2px",
          opacity: 0.001,
          pointerEvents: "none",
          zIndex: -999,
          overflow: "hidden",
        }}
      >
        <div id="youtube-audio-player" />
      </div>
    </MusicContext.Provider>
  );
}

/**
 * Noticeable yet harmonious floating music widget.
 * Floating at the bottom corner — easy to tap on phones and noticeable on desktop.
 * Can be minimized into a glowing music orb if desired.
 */
export function FloatingMusicWidget() {
  const { isPlaying, toggle } = useMusic();
  const [minimized, setMinimized] = useState(false);

  return (
    <aside aria-label="Music player" className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-[70] pointer-events-auto select-none safe-bottom safe-right">
      <AnimatePresence mode="wait">
        {minimized ? (
          /* Compact Glowing Orb when minimized */
          <motion.button
            key="orb"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setMinimized(false)}
            className="flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-xl shadow-xl transition-all cursor-pointer"
            style={{
              background: isPlaying
                ? "linear-gradient(135deg, oklch(0.28 0.09 320 / 0.95) 0%, oklch(0.16 0.05 295 / 0.95) 100%)"
                : "linear-gradient(135deg, oklch(0.24 0.06 310 / 0.92) 0%, oklch(0.14 0.04 290 / 0.95) 100%)",
              border: isPlaying
                ? "1.5px solid var(--lotus)"
                : "1.5px solid var(--rose-gold)",
              boxShadow: isPlaying
                ? "0 8px 25px -4px rgba(0,0,0,0.7), 0 0 20px var(--lotus)"
                : "0 6px 18px -4px rgba(0,0,0,0.6), 0 0 12px var(--rose-gold)",
            }}
            title={isPlaying ? "Music Playing (Tap to expand)" : "Music Paused (Tap to expand)"}
            aria-label="Expand music controller"
          >
            {isPlaying ? (
              <div className="flex items-end gap-[2px] h-3.5" aria-hidden="true">
                <span className="w-[2px] bg-[var(--rose-gold)] rounded-full animate-music-bar-1" />
                <span className="w-[2px] bg-[var(--lotus)] rounded-full animate-music-bar-2" />
                <span className="w-[2px] bg-[var(--rose-gold)] rounded-full animate-music-bar-3" />
              </div>
            ) : (
              <span className="text-sm text-[var(--rose-gold)] leading-none">♫</span>
            )}
          </motion.button>
        ) : (
          /* Noticeable Glowing Music Pill */
          <motion.div
            key="pill"
            initial={{ y: 20, opacity: 0, scale: 0.92 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 15, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-1.5 rounded-full p-1 transition-all"
            style={{
              background: isPlaying
                ? "linear-gradient(135deg, oklch(0.25 0.08 320 / 0.94) 0%, oklch(0.15 0.05 295 / 0.97) 100%)"
                : "linear-gradient(135deg, oklch(0.24 0.07 310 / 0.95) 0%, oklch(0.16 0.05 290 / 0.98) 100%)",
              border: isPlaying
                ? "1.5px solid var(--lotus)"
                : "1.5px solid oklch(0.84 0.09 55 / 0.8)",
              boxShadow: isPlaying
                ? "0 10px 30px -4px rgba(0,0,0,0.75), 0 0 28px oklch(0.86 0.08 0 / 0.5), 0 0 10px var(--rose-gold)"
                : "0 10px 25px -4px rgba(0,0,0,0.7), 0 0 18px oklch(0.84 0.09 55 / 0.4)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Main Interactive Button to Toggle Play/Pause */}
            <button
              onClick={toggle}
              className="flex items-center gap-2.5 rounded-full pl-2 pr-3 py-1.5 transition-transform active:scale-95 cursor-pointer text-left"
              title={isPlaying ? "Tap to turn music off" : "Tap to turn music on"}
              aria-label={isPlaying ? "Pause music" : "Play music"}
            >
              {/* Animated Equalizer / Play Icon Disc */}
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors"
                style={{
                  background: isPlaying
                    ? "radial-gradient(circle, oklch(0.32 0.09 320) 0%, oklch(0.20 0.06 295) 100%)"
                    : "radial-gradient(circle, oklch(0.28 0.08 55) 0%, oklch(0.18 0.05 40) 100%)",
                  border: isPlaying ? "1px solid var(--lotus)" : "1px solid var(--rose-gold)",
                  boxShadow: isPlaying ? "0 0 12px var(--lotus)" : "0 0 8px var(--rose-gold)",
                }}
              >
                {isPlaying ? (
                  <div className="flex items-end gap-[2px] h-3.5" aria-hidden="true">
                    <span className="w-[2.5px] bg-[var(--rose-gold)] rounded-full animate-music-bar-1" />
                    <span className="w-[2.5px] bg-[var(--lotus)] rounded-full animate-music-bar-2" />
                    <span className="w-[2.5px] bg-[var(--rose-gold)] rounded-full animate-music-bar-3" />
                  </div>
                ) : (
                  <span className="text-xs text-[var(--cream)] pl-0.5 leading-none">▶</span>
                )}
              </div>

              {/* Noticeable Song Information */}
              <div className="flex flex-col pr-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-xs sm:text-sm font-medium text-gold-shine tracking-wide">
                    {isPlaying ? "A Thousand Years" : "Play Music ♫"}
                  </span>
                  <span className="inline-block text-[9px] font-mono rounded px-1.5 py-0.2 bg-black/40 text-[var(--rose-gold)] border border-[var(--rose-gold)]/30 uppercase">
                    {isPlaying ? "ON" : "OFF"}
                  </span>
                </div>
                <span className="font-script text-[11px] sm:text-xs text-[var(--cream)]/75">
                  {isPlaying ? "Christina Perri · Tap to pause" : "A Thousand Years · Tap to play"}
                </span>
              </div>
            </button>

            {/* Minimize Icon Button to collapse into subtle orb */}
            <button
              onClick={() => setMinimized(true)}
              className="flex h-6 w-6 items-center justify-center rounded-full text-[var(--cream)]/40 hover:text-[var(--cream)] hover:bg-black/30 transition-colors mr-1 cursor-pointer"
              title="Minimize player"
              aria-label="Minimize music widget"
            >
              <span className="text-xs font-mono leading-none">✕</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}

/**
 * Aesthetic Music Controller Button designed for ChapterHUD top bar
 */
export function MusicButton({ className = "" }: { className?: string }) {
  const { isPlaying, toggle } = useMusic();

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggle();
      }}
      className={`pointer-events-auto group relative flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[var(--cream)] transition-all active:scale-95 shadow-md backdrop-blur-md cursor-pointer ${
        isPlaying
          ? "border-[var(--lotus)] bg-[oklch(0.24_0.07_310/0.8)] shadow-[0_0_12px_var(--lotus)]"
          : "border-[var(--rose-gold)]/50 bg-black/50 hover:border-[var(--rose-gold)]"
      } ${className}`}
      title={isPlaying ? "Mute / Pause Music (A Thousand Years)" : "Play Music (Christina Perri - A Thousand Years)"}
      aria-label="Toggle background music"
    >
      {isPlaying ? (
        <div className="flex items-end gap-[2px] h-3 px-0.5" aria-hidden="true">
          <span className="w-[2px] bg-[var(--rose-gold)] rounded-full animate-music-bar-1" />
          <span className="w-[2px] bg-[var(--lotus)] rounded-full animate-music-bar-2" />
          <span className="w-[2px] bg-[var(--rose-gold)] rounded-full animate-music-bar-3" />
        </div>
      ) : (
        <span className="text-[10px] text-[var(--rose-gold)] leading-none" aria-hidden="true">
          ♫
        </span>
      )}

      <span className="text-[9px] font-mono tracking-wider select-none font-medium">
        {isPlaying ? (
          <span className="text-gold-shine">♫ MUSIC ON</span>
        ) : (
          <span className="text-[var(--cream)]/70">MUSIC OFF</span>
        )}
      </span>
    </button>
  );
}
