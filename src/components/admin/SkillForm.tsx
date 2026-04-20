"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  category: z.string().min(1, "Category is required"),
  order: z.string().optional(),
});

export type SkillFormValues = z.infer<typeof skillSchema>;

interface SkillFormProps {
  defaultValues?: Partial<SkillFormValues>;
  onSubmit: (data: SkillFormValues) => Promise<void>;
  submitLabel: string;
  submitting: boolean;
}

export default function SkillForm({
  defaultValues,
  onSubmit,
  submitLabel,
  submitting,
}: SkillFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: defaultValues ?? {},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
          Skill Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          disabled={submitting}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          placeholder="e.g. TypeScript"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-600" role="alert">{errors.name.message}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="mb-1 block text-sm font-medium text-gray-700">
          Category <span className="text-red-500">*</span>
        </label>
        <input
          id="category"
          type="text"
          {...register("category")}
          disabled={submitting}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          placeholder="e.g. Languages, Frameworks, Tools"
        />
        <p className="mt-1 text-xs text-gray-500">
          Skills sharing the same category are grouped together on the public site.
        </p>
        {errors.category && (
          <p className="mt-1 text-xs text-red-600" role="alert">{errors.category.message}</p>
        )}
      </div>

      {/* Display Order */}
      <div>
        <label htmlFor="order" className="mb-1 block text-sm font-medium text-gray-700">
          Display Order
        </label>
        <input
          id="order"
          type="number"
          {...register("order")}
          disabled={submitting}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          placeholder="1"
        />
        <p className="mt-1 text-xs text-gray-500">Lower numbers appear first within a category.</p>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
        >
          {submitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
