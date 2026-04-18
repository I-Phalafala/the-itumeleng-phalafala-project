"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getSkillById, updateSkill } from "@/lib/firebase/services/skills";
import { Skill } from "@/types/skill";
import SkillForm, { SkillFormValues } from "@/components/admin/SkillForm";
import Toast, { ToastMessage } from "@/components/admin/Toast";

export default function EditSkillPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loadingSkill, setLoadingSkill] = useState(true);
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
      const result = await getSkillById(id);
      if (result.success) {
        setSkill(result.data);
      } else {
        addToast("error", result.error);
      }
      setLoadingSkill(false);
    }
    load();
  // addToast is stable (useCallback with no deps), safe to omit
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSubmit(data: SkillFormValues) {
    setSubmitting(true);
    try {
      const result = await updateSkill(id, {
        name: data.name,
        category: data.category,
        order: data.order ? parseInt(data.order, 10) : undefined,
      });

      if (result.success) {
        addToast("success", "Skill updated successfully.");
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

  const defaultValues: Partial<SkillFormValues> = skill
    ? {
        name: skill.name,
        category: skill.category,
        order: skill.order !== undefined ? String(skill.order) : "",
      }
    : {};

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
        <h1 className="text-2xl font-bold text-gray-900">Edit Skill</h1>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {loadingSkill ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-200" />
            ))}
          </div>
        ) : skill === null ? (
          <p className="text-sm text-gray-500">Skill not found.</p>
        ) : (
          <SkillForm
            key={skill.id}
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
