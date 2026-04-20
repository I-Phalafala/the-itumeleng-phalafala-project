"use client";

import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ImageUpload from "@/components/admin/ImageUpload";

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  description: z.string().min(1, "Description is required"),
  techStack: z.string().optional(),
  role: z.string().optional(),
  problem: z.string().optional(),
  solution: z.string().optional(),
  testingApproach: z.string().optional(),
  imageUrl: z.string().optional(),
  order: z.string().optional(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  defaultValues?: Partial<ProjectFormValues>;
  onSubmit: (data: ProjectFormValues) => Promise<void>;
  submitLabel: string;
  submitting: boolean;
}

export default function ProjectForm({
  defaultValues,
  onSubmit,
  submitLabel,
  submitting,
}: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: defaultValues ?? {},
  });

  const imageUrl = watch("imageUrl");

  const handleImageUpload = useCallback(
    (url: string) => {
      setValue("imageUrl", url, { shouldValidate: true });
    },
    [setValue],
  );

  const handleImageError = useCallback((error: string) => {
    console.error("Image upload error:", error);
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          {...register("title")}
          disabled={submitting}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          placeholder="My Awesome Project"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-600" role="alert">{errors.title.message}</p>
        )}
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className="mb-1 block text-sm font-medium text-gray-700">
          Slug <span className="text-red-500">*</span>
        </label>
        <input
          id="slug"
          type="text"
          {...register("slug")}
          disabled={submitting}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          placeholder="my-awesome-project"
        />
        {errors.slug && (
          <p className="mt-1 text-xs text-red-600" role="alert">{errors.slug.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          rows={3}
          {...register("description")}
          disabled={submitting}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          placeholder="A short summary of the project"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-600" role="alert">{errors.description.message}</p>
        )}
      </div>

      {/* Tech Stack */}
      <div>
        <label htmlFor="techStack" className="mb-1 block text-sm font-medium text-gray-700">
          Tech Stack
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
      </div>

      {/* Role */}
      <div>
        <label htmlFor="role" className="mb-1 block text-sm font-medium text-gray-700">
          Role
        </label>
        <input
          id="role"
          type="text"
          {...register("role")}
          disabled={submitting}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          placeholder="Full-Stack Developer"
        />
      </div>

      {/* Problem */}
      <div>
        <label htmlFor="problem" className="mb-1 block text-sm font-medium text-gray-700">
          Problem
        </label>
        <textarea
          id="problem"
          rows={3}
          {...register("problem")}
          disabled={submitting}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          placeholder="What problem does this project solve?"
        />
      </div>

      {/* Solution */}
      <div>
        <label htmlFor="solution" className="mb-1 block text-sm font-medium text-gray-700">
          Solution
        </label>
        <textarea
          id="solution"
          rows={3}
          {...register("solution")}
          disabled={submitting}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          placeholder="How did you solve the problem?"
        />
      </div>

      {/* Testing Approach */}
      <div>
        <label htmlFor="testingApproach" className="mb-1 block text-sm font-medium text-gray-700">
          Testing Approach
        </label>
        <textarea
          id="testingApproach"
          rows={3}
          {...register("testingApproach")}
          disabled={submitting}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          placeholder="Describe your testing strategy"
        />
      </div>

      {/* Order */}
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

      {/* Image Upload */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Project Image</label>
        <input type="hidden" {...register("imageUrl")} />
        <ImageUpload
          storagePath="projects"
          currentImageUrl={imageUrl}
          onUploadComplete={handleImageUpload}
          onError={handleImageError}
        />
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
