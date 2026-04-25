"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function BackgroundFX() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-cyber-gradient" />
      <motion.div
        className="absolute inset-[-20%] opacity-80"
        animate={
          prefersReducedMotion
            ? undefined
            : {
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 18, repeat: Infinity, ease: "easeInOut" }
        }
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 25%, rgba(0,217,255,0.2), transparent 26%), radial-gradient(circle at 78% 28%, rgba(255,46,159,0.18), transparent 24%), radial-gradient(circle at 50% 78%, rgba(139,92,246,0.18), transparent 30%)",
          backgroundSize: "140% 140%",
        }}
      />
      <div className="absolute inset-0 cyber-grid opacity-30" />
      <motion.div
        className="absolute left-[12%] top-[18%] h-56 w-56 rounded-full bg-neonBlue/10 blur-3xl"
        animate={prefersReducedMotion ? undefined : { y: [0, -20, 0], x: [0, 12, 0] }}
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 10, repeat: Infinity, ease: "easeInOut" }
        }
      />
      <motion.div
        className="absolute bottom-[14%] right-[10%] h-72 w-72 rounded-full bg-neonPink/10 blur-3xl"
        animate={prefersReducedMotion ? undefined : { y: [0, 18, 0], x: [0, -16, 0] }}
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 12, repeat: Infinity, ease: "easeInOut" }
        }
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neonBlue/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-neonPink/40 to-transparent" />
    </div>
  );
}
