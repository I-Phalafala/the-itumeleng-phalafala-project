"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSkill } from "@/lib/firebase/services/skills";
import SkillForm, { SkillFormValues } from "@/components/admin/SkillForm";
import Toast, { ToastMessage } from "@/components/admin/Toast";

export default function NewSkillPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage["type"], message: string) => {
    setToasts((prev) => [...prev, { id: Date.now(), type, message }]);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  async function handleSubmit(data: SkillFormValues) {
    setSubmitting(true);
    try {
      const result = await createSkill({
        name: data.name,
        category: data.category,
        order: data.order ? (isFinite(Number(data.order)) ? Number(data.order) : undefined) : undefined,
      });

      if (result.success) {
        addToast("success", "Skill created successfully.");
        router.push("/admin/skills");
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
          href="/admin/skills"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          aria-label="Back to skills"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">New Skill</h1>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <SkillForm
          onSubmit={handleSubmit}
          submitLabel="Create Skill"
          submitting={submitting}
        />
      </div>

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
