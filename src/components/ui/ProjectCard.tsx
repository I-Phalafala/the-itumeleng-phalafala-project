"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Project } from "@/types/project";
import { cardReveal } from "@/lib/animations";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      variants={cardReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden group transition-all duration-300 hover:border-neonBlue/40 hover:shadow-[0_0_30px_rgba(0,217,255,0.15)]"
    >
      <div className="relative w-full h-48 bg-white/5">
        {project.thumbnailUrl ? (
          <Image
            src={project.thumbnailUrl}
            alt={project.title}
            fill
            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg
              data-testid="thumbnail-placeholder"
              className="h-12 w-12 text-neonBlue/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
          </div>
        )}
        {/* Neon overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-300" />
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold font-heading text-textPrimary mb-2 truncate group-hover:text-neonBlue transition-colors duration-200">
          {project.title}
        </h3>
        <p className="text-sm text-textSecondary mb-4 line-clamp-2">
          {project.description}
        </p>

        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-neonPurple/10 text-neonPurple border border-neonPurple/20"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-neonBlue hover:text-neonPink transition-colors duration-200"
        >
          View Details
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
}
