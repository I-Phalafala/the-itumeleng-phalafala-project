"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createProject } from "@/lib/firebase/services/projects";
import ProjectForm, { ProjectFormValues } from "@/components/admin/ProjectForm";
import Toast, { ToastMessage } from "@/components/admin/Toast";

export default function NewProjectPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage["type"], message: string) => {
    setToasts((prev) => [...prev, { id: Date.now(), type, message }]);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  async function handleSubmit(data: ProjectFormValues) {
    setSubmitting(true);
    try {
      const techStackArray = data.techStack
        ? data.techStack.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const result = await createProject({
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
        order: data.order && isFinite(Number(data.order)) ? Number(data.order) : 0,
      });

      if (result.success) {
        addToast("success", "Project created successfully.");
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
        <h1 className="text-2xl font-bold text-gray-900">New Project</h1>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <ProjectForm
          onSubmit={handleSubmit}
          submitLabel="Create Project"
          submitting={submitting}
        />
      </div>

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
