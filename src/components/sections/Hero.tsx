"use client";

import { motion, useReducedMotion } from "framer-motion";
import { profileData } from "@/constants/profile";
import { staggerContainer, heroTextReveal, fadeUpBlur } from "@/lib/animations";

const FALLBACK_TAGLINE = "Passionate about building reliable, high-quality software.";
const SYSTEM_METRICS = [
  { label: "Precision QA", value: "6+ Years" },
  { label: "Automation", value: "Web • API • Mobile" },
  { label: "Delivery", value: "CI/CD Ready" },
];
const HERO_PANEL_CLASS =
  "relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/55 px-6 py-12 shadow-[0_0_50px_rgba(0,217,255,0.08)] backdrop-blur-2xl sm:px-10 lg:px-14";
const STATUS_BADGE_CLASS =
  "mb-6 inline-flex items-center gap-2 rounded-full border border-neonBlue/30 bg-neonBlue/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-neonBlue shadow-[0_0_20px_rgba(0,217,255,0.14)]";
const METRIC_CARD_CLASS =
  "rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-xl";

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = prefersReducedMotion ? {} : staggerContainer;
  const textVariants = prefersReducedMotion ? {} : heroTextReveal;
  const subtleVariants = prefersReducedMotion ? {} : fadeUpBlur;

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

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className={HERO_PANEL_CLASS}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,217,255,0.12),transparent_45%),linear-gradient(135deg,rgba(139,92,246,0.14),transparent_55%)]" />
          <div className="pointer-events-none absolute inset-x-6 top-6 h-px bg-gradient-to-r from-transparent via-neonBlue/60 to-transparent" />
          <div className="pointer-events-none absolute inset-x-6 bottom-6 h-px bg-gradient-to-r from-transparent via-neonPink/50 to-transparent" />
          <div className="pointer-events-none absolute left-6 top-6 h-8 w-8 border-l border-t border-neonBlue/50" />
          <div className="pointer-events-none absolute right-6 top-6 h-8 w-8 border-r border-t border-neonPink/50" />
          <div className="pointer-events-none absolute bottom-6 left-6 h-8 w-8 border-b border-l border-neonPurple/50" />
          <div className="pointer-events-none absolute bottom-6 right-6 h-8 w-8 border-b border-r border-neonBlue/40" />

          <div className="relative">
            <motion.div
              variants={subtleVariants}
              className={STATUS_BADGE_CLASS}
            >
              <span className="h-2 w-2 rounded-full bg-neonBlue shadow-[0_0_10px_rgba(0,217,255,0.9)]" />
              System Online
            </motion.div>

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

            <motion.div
              variants={subtleVariants}
              className="mt-10 grid gap-3 text-left sm:grid-cols-3"
            >
              {SYSTEM_METRICS.map((metric) => (
                <div
                  key={metric.label}
                  className={METRIC_CARD_CLASS}
                >
                  <p className="mb-1 text-xs uppercase tracking-[0.25em] text-textSecondary">
                    {metric.label}
                  </p>
                  <p className="text-sm font-semibold text-textPrimary sm:text-base">
                    {metric.value}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-16"
          animate={prefersReducedMotion ? undefined : { y: [0, 10, 0] }}
          transition={
            prefersReducedMotion
              ? undefined
              : { repeat: Infinity, duration: 2, ease: "easeInOut" }
          }
        >
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
