import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2, Heart, Film, Sparkles, Upload } from "lucide-react";
import { Petals } from "./Petals";
import { Particles } from "./Particles";
import { useMusic } from "./MusicPlayer";

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  color: string;
}

export function SceneReel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Background music sync
  const music = useMusic();
  const wasMusicPlayingRef = useRef(false);

  // Video playback states
  const base = import.meta.env.BASE_URL
    ? import.meta.env.BASE_URL.endsWith("/")
      ? import.meta.env.BASE_URL
      : `${import.meta.env.BASE_URL}/`
    : "/";
  const [videoSrc, setVideoSrc] = useState<string>(`${base}our-reel.mp4`);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Smart audio ducking: pause ambient music when video plays
  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    if (music.isPlaying) {
      wasMusicPlayingRef.current = true;
      music.pause();
    }
  }, [music]);

  // Resume background music when video pauses or ends
  const handlePause = useCallback(() => {
    setIsPlaying(false);
    if (wasMusicPlayingRef.current) {
      wasMusicPlayingRef.current = false;
      music.play();
    }
  }, [music]);

  // Clean up on unmount: restore music if we paused it
  useEffect(() => {
    return () => {
      if (wasMusicPlayingRef.current) {
        music.play();
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [music]);

  // Auto-pause video when scrolled out of view to save mobile battery & thermals
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {
        // Autoplay policy or no source
      });
    } else {
      videoRef.current.pause();
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration;
    setCurrentTime(cur);
    if (dur > 0) {
      setProgress((cur / dur) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    setHasError(false);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!videoRef.current || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    videoRef.current.currentTime = pos * duration;
    setProgress(pos * 100);
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  // Heart burst animation
  const triggerHeartBurst = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const colors = ["#ff7bb0", "#fca5a5", "#fbcfe8", "#fbbf24", "#e879f9"];
    const newHearts: FloatingHeart[] = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      x: (Math.random() - 0.5) * 160,
      y: (Math.random() - 0.5) * 40,
      scale: 0.8 + Math.random() * 0.8,
      rotation: (Math.random() - 0.5) * 45,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    setHearts((prev) => [...prev, ...newHearts]);

    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => !newHearts.find((nh) => nh.id === h.id)));
    }, 1800);
  };

  // Local file selection for instant preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setHasError(false);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.load();
          videoRef.current.play().catch(() => {});
        }
      }, 100);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3200);
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center px-4 py-16 sm:py-20 select-none">
      {/* Dreamy deep nocturnal backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, oklch(0.25 0.09 315 / 0.95) 0%, oklch(0.14 0.05 292 / 0.98) 55%, oklch(0.08 0.03 285) 100%)",
        }}
      />

      {/* Atmospheric starlight particles and soft petals */}
      <Particles count={25} color="oklch(0.92 0.10 60)" />
      <Petals count={8} />

      {/* Title & Introduction */}
      <div className="relative z-10 text-center max-w-xl mb-6 sm:mb-8 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--rose-gold)]/30 bg-black/40 backdrop-blur-md mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[var(--rose-gold)] animate-pulse" />
          <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[var(--rose-gold)]">
            Chapter Five · The Living Reel
          </span>
        </div>

        <h2 className="font-display text-[clamp(1.9rem,4.8vw,3.6rem)] font-light tracking-wide text-lotus-shine">
          Moments in Motion
        </h2>
        <p className="mt-2 font-display text-xs sm:text-sm italic text-[var(--cream)]/75">
          “In a universe of still photos, you make every second feel like poetry.”
        </p>
      </div>

      {/* ── THE CINEMA FRAME WITH AMBIENT AURA ── */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Ambient Backlight Aura Glow */}
        <motion.div
          animate={
            isPlaying
              ? { opacity: [0.55, 0.8, 0.55], scale: [1, 1.03, 1] }
              : { opacity: 0.25, scale: 1 }
          }
          transition={{
            duration: 3.5,
            repeat: isPlaying ? Infinity : 0,
            ease: "easeInOut",
          }}
          className="absolute -inset-4 sm:-inset-6 rounded-[44px] pointer-events-none blur-2xl"
          style={{
            background:
              "radial-gradient(circle, oklch(0.86 0.14 340 / 0.35) 0%, oklch(0.84 0.11 55 / 0.22) 50%, transparent 75%)",
          }}
        />

        {/* Outer Phone / Film Reel Bezel */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onClick={togglePlay}
          onDoubleClick={triggerHeartBurst}
          className="group relative w-[280px] xs:w-[320px] sm:w-[350px] md:w-[380px] aspect-[9/16] max-h-[70vh] rounded-[32px] sm:rounded-[38px] border-2 border-[var(--rose-gold)]/40 bg-black/90 shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden cursor-pointer flex flex-col justify-between"
          style={{
            boxShadow: isPlaying
              ? "0 0 50px oklch(0.86 0.12 340 / 0.4), 0 25px 70px rgba(0,0,0,0.9)"
              : "0 0 25px oklch(0.84 0.08 55 / 0.2), 0 20px 50px rgba(0,0,0,0.8)",
          }}
        >
          {/* Top Vintage Filmstrip Header */}
          <div className="relative z-20 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none text-[9px] font-mono tracking-widest text-[var(--cream)]/75">
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  isPlaying ? "bg-red-500 animate-ping" : "bg-[var(--rose-gold)]/60"
                }`}
              />
              <span className="font-semibold text-[var(--cream)]">
                {isPlaying ? "REC · 24 FPS" : "OISHI & RUDRO"}
              </span>
            </div>
            <span className="opacity-60 tabular-nums">{formatTime(currentTime)}</span>
          </div>

          {/* Actual HTML5 Video Element */}
          <video
            ref={videoRef}
            src={videoSrc}
            playsInline
            preload="metadata"
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handlePause}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onError={() => setHasError(true)}
            className="absolute inset-0 w-full h-full object-cover z-10"
          />

          {/* Fallback / Guidance Overlay if video is not yet placed in public/ */}
          {hasError && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-black/85 backdrop-blur-md"
            >
              <div className="h-14 w-14 rounded-full border border-[var(--rose-gold)]/40 bg-[var(--rose-gold)]/10 flex items-center justify-center mb-4 text-[var(--rose-gold)]">
                <Film className="w-7 h-7 animate-pulse" />
              </div>

              <h4 className="font-display text-base text-[var(--cream)] font-medium mb-1">
                Your Memory Reel
              </h4>
              <p className="text-[11px] text-[var(--cream)]/70 leading-relaxed mb-4 max-w-[260px]">
                Place your video at <code className="text-[var(--rose-gold)] bg-black/50 px-1 py-0.5 rounded">public/our-reel.mp4</code>
              </p>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--lotus)]/50 bg-[var(--lotus)]/20 hover:bg-[var(--lotus)]/30 text-[var(--cream)] text-xs font-medium transition-all active:scale-95 shadow-lg shadow-[var(--lotus)]/20"
              >
                <Upload className="w-3.5 h-3.5 text-[var(--lotus)]" />
                Select video to test now
              </button>
            </div>
          )}

          {/* Hidden File Input for instant testing */}
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Big Center Play/Pause Ripple Button */}
          <AnimatePresence>
            {(!isPlaying || showControls) && !hasError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
              >
                <div
                  className={`h-16 w-16 sm:h-20 sm:w-20 rounded-full border border-[var(--rose-gold)]/50 bg-black/50 backdrop-blur-md flex items-center justify-center shadow-2xl transition-transform ${
                    !isPlaying ? "scale-110 shadow-[0_0_30px_oklch(0.86_0.10_0/0.5)]" : "opacity-80"
                  }`}
                >
                  {!isPlaying ? (
                    <Play className="w-7 h-7 sm:w-9 sm:h-9 text-[var(--cream)] fill-[var(--cream)] translate-x-0.5" />
                  ) : (
                    <Pause className="w-7 h-7 sm:w-9 sm:h-9 text-[var(--cream)] fill-[var(--cream)]" />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Hearts Reaction Canvas */}
          <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
            {hearts.map((h) => (
              <motion.div
                key={h.id}
                initial={{ opacity: 1, y: 0, x: h.x, scale: h.scale, rotate: h.rotation }}
                animate={{ opacity: 0, y: -260, scale: h.scale * 1.5, rotate: h.rotation * 2 }}
                transition={{ duration: 1.6, ease: "easeOut" }}
                className="absolute bottom-16 left-1/2"
              >
                <Heart className="w-6 h-6 fill-current drop-shadow-md" style={{ color: h.color }} />
              </motion.div>
            ))}
          </div>

          {/* Bottom Player Controls Bar */}
          <div
            className={`relative z-20 flex flex-col gap-2 p-3.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${
              showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Scrubber / Progress Bar */}
            <div
              onClick={handleSeek}
              className="group/track relative w-full h-1.5 hover:h-2.5 bg-white/20 rounded-full cursor-pointer transition-all flex items-center"
            >
              <div
                className="h-full bg-gradient-to-r from-[var(--lotus)] to-[var(--rose-gold)] rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute h-3 w-3 rounded-full bg-white shadow-md -translate-x-1.5 opacity-0 group-hover/track:opacity-100 transition-opacity"
                style={{ left: `${progress}%` }}
              />
            </div>

            {/* Micro Control Buttons */}
            <div className="flex items-center justify-between text-[var(--cream)] text-xs pt-1">
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  className="p-1 hover:text-[var(--lotus)] transition-colors"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                </button>

                <button
                  onClick={toggleMute}
                  className="p-1 hover:text-[var(--lotus)] transition-colors"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <span className="font-mono text-[9px] opacity-75 tabular-nums">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={triggerHeartBurst}
                  className="p-1.5 rounded-full bg-pink-500/20 text-pink-400 hover:bg-pink-500/40 hover:scale-110 active:scale-95 transition-all"
                  title="Send hearts"
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="p-1 hover:text-[var(--rose-gold)] transition-colors"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Under-player prompt / tip */}
        <div className="mt-4 flex items-center gap-3 text-center">
          <p className="text-[11px] font-mono tracking-widest text-[var(--cream)]/60">
            TAP TO PLAY · DOUBLE TAP FOR HEARTS
          </p>
          {!hasError && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-[10px] text-[var(--rose-gold)]/60 hover:text-[var(--rose-gold)] underline transition-colors"
              title="Change video source"
            >
              swap video
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
