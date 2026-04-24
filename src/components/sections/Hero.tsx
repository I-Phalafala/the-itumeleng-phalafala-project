"use client";

import { motion, useReducedMotion } from "framer-motion";
import { profileData } from "@/constants/profile";
import { staggerContainer, heroTextReveal, fadeUpBlur } from "@/lib/animations";

const FALLBACK_TAGLINE = "Passionate about building reliable, high-quality software.";

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = prefersReducedMotion ? {} : staggerContainer;
  const textVariants = prefersReducedMotion ? {} : heroTextReveal;
  const subtleVariants = prefersReducedMotion ? {} : fadeUpBlur;

  const scrollIndicatorProps = prefersReducedMotion
    ? {}
    : {
        animate: { y: [0, 10, 0] },
        transition: { repeat: Infinity, duration: 2, ease: "easeInOut" },
      };

  const handleScrollToProjects = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("projects");
    if (target) {
      target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Layered background */}
      <div className="absolute inset-0 cyber-grid opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg pointer-events-none" />

      {/* Floating glow orbs */}
      <motion.div
        className="absolute top-1/4 left-1/6 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,217,255,0.12) 0%, transparent 70%)" }}
        animate={prefersReducedMotion ? {} : { scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/6 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,46,159,0.1) 0%, transparent 70%)" }}
        animate={prefersReducedMotion ? {} : { scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)" }}
        animate={prefersReducedMotion ? {} : { rotate: [0, 360] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.p
            variants={textVariants}
            className="text-neonBlue font-medium text-sm mb-4 tracking-[0.25em] uppercase"
            style={{ textShadow: "0 0 10px rgba(0,217,255,0.5)" }}
          >
            Hello, I&apos;m
          </motion.p>

          <motion.h1
            variants={textVariants}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold font-heading mb-6 break-words bg-gradient-to-r from-neonBlue via-neonPurple to-neonPink bg-clip-text text-transparent"
          >
            {profileData.name}
          </motion.h1>

          <motion.p
            variants={textVariants}
            className="text-xl sm:text-2xl text-textPrimary mb-4 font-light tracking-wide"
          >
            {profileData.title}
          </motion.p>

          <motion.p
            variants={subtleVariants}
            className="text-textSecondary max-w-2xl mx-auto mb-10 leading-relaxed text-lg"
          >
            {profileData.tagline || FALLBACK_TAGLINE}
          </motion.p>

          <motion.div
            variants={subtleVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#projects"
              onClick={handleScrollToProjects}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-neonBlue to-neonPurple text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,217,255,0.5)] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-neonBlue focus:ring-offset-2 focus:ring-offset-bg"
            >
              View My Work
            </a>
            <a
              href={profileData.cvUrl || "/cv.pdf"}
              download
              className="inline-flex items-center gap-2 border border-neonBlue/50 text-neonBlue font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:bg-neonBlue/10 hover:border-neonBlue hover:shadow-[0_0_20px_rgba(0,217,255,0.3)] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-neonBlue focus:ring-offset-2 focus:ring-offset-bg"
            >
              Download CV
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div className="mt-16" {...scrollIndicatorProps}>
          <svg
            className="h-8 w-8 mx-auto text-neonBlue/60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
