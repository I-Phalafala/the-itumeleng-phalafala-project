"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getExperience, deleteExperience } from "@/lib/firebase/services/experience";
import { ExperienceItem } from "@/types/experience";
import Toast, { ToastMessage } from "@/components/admin/Toast";

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<ExperienceItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage["type"], message: string) => {
    setToasts((prev) => [...prev, { id: Date.now(), type, message }]);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  async function fetchExperiences() {
    setLoading(true);
    const result = await getExperience();
    if (result.success) {
      setExperiences(result.data);
    } else {
      addToast("error", result.error);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchExperiences();
  // addToast is stable (useCallback with no deps), safe to omit
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete() {
    if (!deleteTarget?.id) return;
    setDeleting(true);
    const result = await deleteExperience(deleteTarget.id);
    if (result.success) {
      addToast("success", `"${deleteTarget.role} at ${deleteTarget.company}" deleted successfully.`);
      setExperiences((prev) => prev.filter((e) => e.id !== deleteTarget.id));
    } else {
      addToast("error", result.error);
    }
    setDeleting(false);
    setDeleteTarget(null);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Experience</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your work experience entries.</p>
        </div>
        <Link
          href="/admin/experience/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Experience
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      ) : experiences.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-gray-500">No experience entries yet.</p>
          <Link href="/admin/experience/new" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">
            Add your first experience entry
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3">Role / Company</th>
                <th className="hidden px-4 py-3 sm:table-cell">Period</th>
                <th className="hidden px-4 py-3 md:table-cell">Tech Stack</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {experiences.map((exp) => (
                <tr key={exp.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{exp.role}</p>
                    <p className="text-gray-500">{exp.company}</p>
                  </td>
                  <td className="hidden px-4 py-3 text-gray-500 sm:table-cell">
                    {exp.startDate} – {exp.endDate ?? "Present"}
                  </td>
                  <td className="hidden px-4 py-3 text-gray-500 md:table-cell">
                    {exp.techStack?.slice(0, 3).join(", ") ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/experience/${exp.id}/edit`}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(exp)}
                        className="inline-flex items-center gap-1 rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h2 id="delete-dialog-title" className="mb-2 text-lg font-semibold text-gray-900">
              Delete Experience
            </h2>
            <p className="mb-6 text-sm text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                &ldquo;{deleteTarget.role} at {deleteTarget.company}&rdquo;
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
