"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectCard from "@/components/ui/ProjectCard";
import { getProjects } from "@/lib/firebase/projects";
import { Project } from "@/types/project";
import { staggerContainer } from "@/lib/animations";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch((error) => {
        console.error("Failed to fetch projects:", error);
        setProjects([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="projects" className="py-20 section-bg-alt">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Projects"
          subtitle="A selection of projects I have worked on"
        />

        {loading ? (
          <p className="text-center text-textSecondary">Loading projects…</p>
        ) : projects.length === 0 ? (
          <p className="text-center text-textSecondary">
            No projects added yet.
          </p>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
