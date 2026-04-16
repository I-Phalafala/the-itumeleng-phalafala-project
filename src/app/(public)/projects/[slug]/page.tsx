"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProjects } from "@/lib/firebase/projects";
import { Project } from "@/types/project";

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then((projects) => {
        const match = projects.find((p) => p.slug === slug) ?? null;
        setProject(match);
      })
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground/50">Loading…</p>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <h1 className="text-2xl font-bold text-primary">Project not found</h1>
        <Link
          href="/#projects"
          className="text-accent hover:text-accent/80 font-semibold transition-colors"
        >
          ← Back to Projects
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {project.thumbnailUrl ? (
          <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden mb-8">
            <Image
              src={project.thumbnailUrl}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-64 sm:h-80 rounded-xl bg-gray-200 flex items-center justify-center mb-8">
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
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-primary mb-4">
          {project.title}
        </h1>

        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block px-3 py-1.5 text-sm font-medium rounded-full bg-secondary/10 text-secondary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <p className="text-foreground/80 leading-relaxed">
          {project.description}
        </p>
      </div>
    </main>
  );
}
