import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  StorageReference,
} from "firebase/storage";
import { storage } from "@/lib/firebase/config";
import { ServiceResponse } from "./types";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Validate file type and size before upload.
 * Returns an error message string if invalid, or null if valid.
 */
function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Invalid file type. Allowed types: JPEG, PNG, WebP";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "File too large. Maximum size is 5MB";
  }
  return null;
}

/**
 * Upload an image to Firebase Storage and return the download URL.
 * @param file - The image file to upload
 * @param path - The storage path (e.g. "projects/my-image.jpg")
 * @param onProgress - Optional callback for upload progress (0–100)
 */
export async function uploadImage(
  file: File,
  path: string,
  onProgress?: (progress: number) => void,
): Promise<ServiceResponse<string>> {
  const validationError = validateFile(file);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return await new Promise<ServiceResponse<string>>((resolve) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress?.(progress);
        },
        (error) => {
          resolve({
            success: false,
            error: error instanceof Error ? error.message : "Failed to upload image",
          });
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({ success: true, data: downloadURL });
          } catch (error) {
            resolve({
              success: false,
              error: error instanceof Error ? error.message : "Failed to get download URL",
            });
          }
        },
      );
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload image",
    };
  }
}

/**
 * Delete an image from Firebase Storage by its download URL.
 * @param url - The Firebase Storage download URL of the image to delete
 */
export async function deleteImage(url: string): Promise<ServiceResponse<void>> {
  try {
    const storageRef: StorageReference = ref(storage, url);
    await deleteObject(storageRef);
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete image",
    };
  }
}
