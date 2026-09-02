import { motion } from "framer-motion";
import { Particles } from "./Particles";
import { Lotus } from "./Lotus";
import { FloatingPhotos } from "./FloatingPhotos";
import { PHOTOS } from "./photos";

/** Final ending — quiet starlight, lotus + heart fade. */
export function SceneEnding() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 50% 60%, oklch(0.16 0.06 305) 0%, oklch(0.08 0.03 285) 70%, oklch(0.04 0.02 280) 100%)",
      }} />

      <Particles count={140} />

      <FloatingPhotos
        photos={[
          { src: PHOTOS[14], left: "4%",  top: "16%", rotate: -6, caption: "kept forever" },
          { src: PHOTOS[15], left: "85%", top: "22%", rotate: 7, hideMobile: true, caption: "timeless love" },
          { src: PHOTOS[16], left: "8%",  top: "75%", rotate: 5, caption: "endless dreams" },
        ]}
      />



      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <Lotus size={120} />
          <motion.svg
            viewBox="0 0 24 24"
            className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: [0, 0, 1], scale: [0.4, 0.4, 1] }}
            viewport={{ once: true }}
            transition={{ duration: 4, times: [0, 0.5, 1] }}
            style={{ filter: "drop-shadow(0 0 20px var(--lotus))" }}
          >
            <path d="M12 21s-7-4.35-7-10a4.5 4.5 0 0 1 8-3 4.5 4.5 0 0 1 8 3c0 5.65-7 10-7 10z"
              fill="var(--lotus)" />
          </motion.svg>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16, letterSpacing: "0.5em" }}
          whileInView={{ opacity: 0.95, y: 0, letterSpacing: "0.2em" }}
          viewport={{ once: true }}
          transition={{ duration: 3, delay: 1.5 }}
          className="mt-16 font-display text-[clamp(1.3rem,3.2vw,2.2rem)] font-extralight italic text-gold-shine"
        >
          The End of This Little Universe.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.4 }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: 3.5 }}
          className="mt-12 text-[10px] uppercase tracking-[0.5em] text-[var(--cream)]/50 font-medium"
        >
          made with love · Just for you 
        </motion.p>
      </div>
    </section>
  );
}
