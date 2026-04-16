"use client";

import { motion } from "framer-motion";
import { profileData } from "@/constants/profile";

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-secondary text-white pt-16"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-accent font-medium text-lg mb-4 tracking-wider uppercase">
            Hello, I&apos;m
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-heading mb-6">
            {profileData.name}
          </h1>
          <p className="text-xl sm:text-2xl text-gray-200 mb-8">
            {profileData.title}
          </p>
          <p className="text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            {profileData.summary}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#contact"
              className="bg-accent text-foreground font-semibold px-8 py-3 rounded-lg hover:bg-accent/90 transition-colors"
            >
              Get In Touch
            </a>
            <a
              href="#experience"
              className="border-2 border-white/30 text-white font-semibold px-8 py-3 rounded-lg hover:border-white/60 transition-colors"
            >
              View Experience
            </a>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-16"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <svg
            className="h-8 w-8 mx-auto text-gray-300"
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
