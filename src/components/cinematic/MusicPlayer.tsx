import React, { createContext, useContext, useEffect, useRef, useState } from "react";

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
                event.target.setVolume(80);
                event.target.playVideo();
              } catch (e) {
                // Browser might block unmuted autoplay until user gesture
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
 * Aesthetic Music Controller Button designed for ChapterHUD and mobile/desktop navigation
 */
export function MusicButton({ className = "" }: { className?: string }) {
  const { isPlaying, toggle } = useMusic();

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggle();
      }}
      className={`pointer-events-auto group relative flex items-center gap-1.5 rounded-full border border-[var(--rose-gold)]/35 bg-black/45 px-2.5 py-1 text-[var(--cream)] transition-all hover:border-[var(--rose-gold)] hover:bg-black/65 active:scale-95 shadow-[0_2px_12px_rgba(0,0,0,0.5)] backdrop-blur-md ${className}`}
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
        <span className="text-[10px] text-[var(--cream)]/60 leading-none" aria-hidden="true">
          🔇
        </span>
      )}

      <span className="text-[9px] font-mono tracking-wider select-none">
        {isPlaying ? (
          <>
            <span className="hidden sm:inline text-gold-shine">♫ A THOUSAND YEARS</span>
            <span className="sm:hidden text-gold-shine">♫ MUSIC</span>
          </>
        ) : (
          <>
            <span className="hidden sm:inline text-[var(--cream)]/60">MUSIC OFF</span>
            <span className="sm:hidden text-[var(--cream)]/60">OFF</span>
          </>
        )}
      </span>
    </button>
  );
}
