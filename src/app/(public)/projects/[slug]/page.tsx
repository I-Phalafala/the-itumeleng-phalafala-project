"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { getProjectBySlug } from "@/lib/firebase/projects";
import { Project } from "@/types/project";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function DetailSection({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.section
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, delay }}
      className="mb-10"
    >
      <h2 className="text-xl sm:text-2xl font-bold font-heading text-primary mb-3">
        {title}
      </h2>
      <div className="text-foreground/80 leading-relaxed">{children}</div>
    </motion.section>
  );
}

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    getProjectBySlug(slug)
      .then((p) => {
        if (!p) {
          setNotFoundState(true);
        } else {
          setProject(p);
        }
      })
      .catch(() => setNotFoundState(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (notFoundState) {
    notFound();
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground/50">Loading…</p>
      </main>
    );
  }

  if (!project) {
    return null;
  }

  let sectionDelay = 0.1;
  const nextDelay = () => {
    sectionDelay += 0.1;
    return sectionDelay;
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-background py-20"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/#projects"
            className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent/80 transition-colors mb-8"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Projects
          </Link>
        </motion.div>

        {project.thumbnailUrl ? (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden mb-8"
          >
            <Image
              src={project.thumbnailUrl}
              alt={project.title}
              fill
              className="object-cover"
            />
          </motion.div>
        ) : (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full h-64 sm:h-80 rounded-xl bg-gray-200 flex items-center justify-center mb-8"
          >
            <svg
              className="h-16 w-16 text-gray-400"
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
          </motion.div>
        )}

        <motion.h1
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-3xl sm:text-4xl font-bold font-heading text-primary mb-4"
        >
          {project.title}
        </motion.h1>

        {project.tags.length > 0 && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block px-3 py-1.5 text-sm font-medium rounded-full bg-secondary/10 text-secondary"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        )}

        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-foreground/80 leading-relaxed mb-10"
        >
          {project.description}
        </motion.p>

        {project.problemStatement && (
          <DetailSection title="Problem Statement" delay={nextDelay()}>
            <p>{project.problemStatement}</p>
          </DetailSection>
        )}

        {project.solution && (
          <DetailSection title="Solution" delay={nextDelay()}>
            <p className="whitespace-pre-line break-words">
              {project.solution}
            </p>
          </DetailSection>
        )}

        {project.techStack && project.techStack.length > 0 && (
          <DetailSection title="Tech Stack" delay={nextDelay()}>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="inline-block px-3 py-1.5 text-sm font-medium rounded-full bg-primary/10 text-primary"
                >
                  {tech}
                </span>
              ))}
            </div>
          </DetailSection>
        )}

        {project.role && (
          <DetailSection title="My Role" delay={nextDelay()}>
            <p>{project.role}</p>
          </DetailSection>
        )}

        {project.testingApproach && (
          <DetailSection title="Testing Approach" delay={nextDelay()}>
            <p>{project.testingApproach}</p>
          </DetailSection>
        )}

        {project.screenshots && project.screenshots.length > 0 && (
          <motion.section
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: nextDelay() }}
            className="mb-10"
          >
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-primary mb-3">
              Screenshots
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.screenshots.map((url, index) => (
                <div
                  key={url}
                  className="relative w-full h-48 sm:h-56 rounded-lg overflow-hidden border border-gray-100"
                >
                  <Image
                    src={url}
                    alt={`${project.title} screenshot ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </motion.section>
        )}

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.4, delay: nextDelay() }}
          className="pt-6 border-t border-gray-200"
        >
          <Link
            href="/#projects"
            className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Projects
          </Link>
        </motion.div>
      </div>
    </motion.main>
  );
}
