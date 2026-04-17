"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { uploadImage, deleteImage } from "@/lib/firebase/services/storage";

interface ImageUploadProps {
  /** Current image URL (for edit mode / preview) */
  currentImageUrl?: string;
  /** Storage path prefix (e.g. "projects") */
  storagePath: string;
  /** Called with the new download URL after a successful upload */
  onUploadComplete: (url: string) => void;
  /** Called when an error occurs */
  onError?: (error: string) => void;
}

export default function ImageUpload({
  currentImageUrl,
  storagePath,
  onUploadComplete,
  onError,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync preview with currentImageUrl prop when it changes externally
  useEffect(() => {
    setPreview(currentImageUrl ?? null);
  }, [currentImageUrl]);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setError(null);
      setUploading(true);
      setProgress(0);

      try {
        const path = `${storagePath}/${Date.now()}-${file.name}`;
        const result = await uploadImage(file, path, (p) => setProgress(p));

        if (result.success) {
          setPreview(result.data);
          onUploadComplete(result.data);

          // Delete old image from storage only after the replacement upload succeeds
          if (currentImageUrl) {
            try {
              await deleteImage(currentImageUrl);
            } catch {
              const deleteError = "New image uploaded, but deleting the previous image failed.";
              setError(deleteError);
              onError?.(deleteError);
            }
          }
        } else {
          setError(result.error);
          onError?.(result.error);
        }
      } catch (err) {
        const unexpectedError =
          err instanceof Error ? err.message : "Image upload failed.";
        setError(unexpectedError);
        onError?.(unexpectedError);
      } finally {
        setUploading(false);
        // Reset file input so the same file can be re-selected
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [currentImageUrl, storagePath, onUploadComplete, onError],
  );

  return (
    <div className="space-y-4">
      {/* Preview */}
      {preview && (
        <div className="relative w-full max-w-xs overflow-hidden rounded-lg border border-gray-200">
          <Image
            src={preview}
            alt="Upload preview"
            width={320}
            height={200}
            className="h-auto w-full object-cover"
          />
        </div>
      )}

      {/* Upload input */}
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition-colors hover:border-gray-400 hover:bg-gray-100">
        <span className="text-sm text-gray-600">
          {uploading ? "Uploading…" : "Click to upload an image"}
        </span>
        <span className="mt-1 text-xs text-gray-400">JPEG, PNG or WebP — max 5 MB</span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
          data-testid="file-input"
        />
      </label>

      {/* Progress bar */}
      {uploading && (
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      )}

      {/* Error message */}
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
    </div>
  );
}
