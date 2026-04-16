import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
      <h1 className="text-2xl font-bold text-primary">Project not found</h1>
      <p className="text-foreground/60 text-center max-w-md">
        The project you&apos;re looking for doesn&apos;t exist or may have been
        removed.
      </p>
      <Link
        href="/#projects"
        className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent/80 transition-colors mt-2"
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
    </main>
  );
}
