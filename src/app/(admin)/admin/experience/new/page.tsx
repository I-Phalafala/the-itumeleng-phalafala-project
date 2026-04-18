"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createExperience } from "@/lib/firebase/services/experience";
import ExperienceForm, { ExperienceFormValues } from "@/components/admin/ExperienceForm";
import Toast, { ToastMessage } from "@/components/admin/Toast";

export default function NewExperiencePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage["type"], message: string) => {
    setToasts((prev) => [...prev, { id: Date.now(), type, message }]);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  async function handleSubmit(data: ExperienceFormValues) {
    setSubmitting(true);
    try {
      const impactArray = data.impact
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const techStackArray = data.techStack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const result = await createExperience({
        company: data.company,
        role: data.role,
        startDate: data.startDate,
        endDate: data.endDate && data.endDate !== "" ? data.endDate : null,
        impact: impactArray,
        techStack: techStackArray,
        order: data.order ? parseInt(data.order, 10) : 0,
      });

      if (result.success) {
        addToast("success", "Experience entry created successfully.");
        router.push("/admin/experience");
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
          href="/admin/experience"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          aria-label="Back to experience"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">New Experience</h1>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <ExperienceForm
          onSubmit={handleSubmit}
          submitLabel="Create Experience"
          submitting={submitting}
        />
      </div>

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
