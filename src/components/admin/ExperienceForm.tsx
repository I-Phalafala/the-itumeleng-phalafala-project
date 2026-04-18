"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const experienceSchema = z
  .object({
    company: z.string().min(1, "Company is required"),
    role: z.string().min(1, "Role is required"),
    startDate: z
      .string()
      .min(1, "Start date is required")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format")
      .or(z.literal(""))
      .optional(),
    impact: z.string().min(1, "At least one impact/achievement is required"),
    techStack: z.string().min(1, "Tech stack is required"),
    order: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.endDate || data.endDate === "") return true;
      return data.startDate <= data.endDate;
    },
    {
      message: "Start date must not be after end date",
      path: ["startDate"],
    },
  );

export type ExperienceFormValues = z.infer<typeof experienceSchema>;

interface ExperienceFormProps {
  defaultValues?: Partial<ExperienceFormValues>;
  onSubmit: (data: ExperienceFormValues) => Promise<void>;
  submitLabel: string;
  submitting: boolean;
}

export default function ExperienceForm({
  defaultValues,
  onSubmit,
  submitLabel,
  submitting,
}: ExperienceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: defaultValues ?? {},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {/* Company */}
      <div>
        <label htmlFor="company" className="mb-1 block text-sm font-medium text-gray-700">
          Company <span className="text-red-500">*</span>
        </label>
        <input
          id="company"
          type="text"
          {...register("company")}
          disabled={submitting}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          placeholder="Acme Corporation"
        />
        {errors.company && (
          <p className="mt-1 text-xs text-red-600" role="alert">{errors.company.message}</p>
        )}
      </div>

      {/* Role */}
      <div>
        <label htmlFor="role" className="mb-1 block text-sm font-medium text-gray-700">
          Role <span className="text-red-500">*</span>
        </label>
        <input
          id="role"
          type="text"
          {...register("role")}
          disabled={submitting}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          placeholder="Software Engineer"
        />
        {errors.role && (
          <p className="mt-1 text-xs text-red-600" role="alert">{errors.role.message}</p>
        )}
      </div>

      {/* Start Date / End Date */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="startDate" className="mb-1 block text-sm font-medium text-gray-700">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            id="startDate"
            type="date"
            {...register("startDate")}
            disabled={submitting}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          />
          {errors.startDate && (
            <p className="mt-1 text-xs text-red-600" role="alert">{errors.startDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="endDate" className="mb-1 block text-sm font-medium text-gray-700">
            End Date{" "}
            <span className="font-normal text-gray-400">(leave blank for current role)</span>
          </label>
          <input
            id="endDate"
            type="date"
            {...register("endDate")}
            disabled={submitting}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          />
          {errors.endDate && (
            <p className="mt-1 text-xs text-red-600" role="alert">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      {/* Impact */}
      <div>
        <label htmlFor="impact" className="mb-1 block text-sm font-medium text-gray-700">
          Impact / Achievements <span className="text-red-500">*</span>
        </label>
        <textarea
          id="impact"
          rows={4}
          {...register("impact")}
          disabled={submitting}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          placeholder="One achievement per line, e.g.&#10;Reduced build time by 40%&#10;Led a team of 5 engineers"
        />
        <p className="mt-1 text-xs text-gray-500">Enter one achievement or responsibility per line.</p>
        {errors.impact && (
          <p className="mt-1 text-xs text-red-600" role="alert">{errors.impact.message}</p>
        )}
      </div>

      {/* Tech Stack */}
      <div>
        <label htmlFor="techStack" className="mb-1 block text-sm font-medium text-gray-700">
          Tech Stack <span className="text-red-500">*</span>
        </label>
        <input
          id="techStack"
          type="text"
          {...register("techStack")}
          disabled={submitting}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          placeholder="React, TypeScript, Firebase (comma-separated)"
        />
        <p className="mt-1 text-xs text-gray-500">Separate technologies with commas.</p>
        {errors.techStack && (
          <p className="mt-1 text-xs text-red-600" role="alert">{errors.techStack.message}</p>
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
        <p className="mt-1 text-xs text-gray-500">Lower numbers appear first.</p>
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
