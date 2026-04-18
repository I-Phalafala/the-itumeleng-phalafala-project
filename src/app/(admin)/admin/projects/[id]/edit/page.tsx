"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getProjectById, updateProject } from "@/lib/firebase/services/projects";
import { Project } from "@/types/project";
import ProjectForm, { ProjectFormValues } from "@/components/admin/ProjectForm";
import Toast, { ToastMessage } from "@/components/admin/Toast";

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage["type"], message: string) => {
    setToasts((prev) => [...prev, { id: Date.now(), type, message }]);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    async function load() {
      const result = await getProjectById(id);
      if (result.success) {
        setProject(result.data);
      } else {
        addToast("error", result.error);
      }
      setLoadingProject(false);
    }
    load();
  // addToast is stable (useCallback with no deps), safe to omit
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSubmit(data: ProjectFormValues) {
    setSubmitting(true);
    try {
      const techStackArray = data.techStack
        ? data.techStack.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const result = await updateProject(id, {
        title: data.title,
        slug: data.slug,
        description: data.description,
        techStack: techStackArray,
        role: data.role ?? "",
        problemStatement: data.problem ?? "",
        solution: data.solution ?? "",
        testingApproach: data.testingApproach ?? "",
        imageUrl: data.imageUrl ?? "",
        tags: techStackArray,
        order: data.order ? parseInt(data.order, 10) : 0,
      });

      if (result.success) {
        addToast("success", "Project updated successfully.");
        router.push("/admin/projects");
      } else {
        addToast("error", result.error);
        setSubmitting(false);
      }
    } catch {
      addToast("error", "An unexpected error occurred.");
      setSubmitting(false);
    }
  }

  const defaultValues: Partial<ProjectFormValues> = project
    ? {
        title: project.title,
        slug: project.slug,
        description: project.description,
        techStack: project.techStack?.join(", ") ?? "",
        role: project.role ?? "",
        problem: project.problemStatement ?? "",
        solution: project.solution ?? "",
        testingApproach: project.testingApproach ?? "",
        imageUrl: project.imageUrl ?? "",
        order: project.order !== undefined ? String(project.order) : "",
      }
    : {};

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          aria-label="Back to projects"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Project</h1>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {loadingProject ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-200" />
            ))}
          </div>
        ) : project === null ? (
          <p className="text-sm text-gray-500">Project not found.</p>
        ) : (
          <ProjectForm
            key={project.id}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            submitLabel="Save Changes"
            submitting={submitting}
          />
        )}
      </div>

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
