// Mock Firebase modules before any imports
jest.mock("firebase/app", () => {
  const mockApp = { name: "[DEFAULT]", options: {}, automaticDataCollectionEnabled: false };
  return {
    initializeApp: jest.fn(() => mockApp),
    getApps: jest.fn(() => []),
    getApp: jest.fn(() => mockApp),
  };
});

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({ name: "auth-instance" })),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({ name: "firestore-instance" })),
}));

jest.mock("firebase/storage", () => ({
  getStorage: jest.fn(() => ({ name: "storage-instance" })),
  ref: jest.fn(),
  uploadBytesResumable: jest.fn(),
  getDownloadURL: jest.fn(),
  deleteObject: jest.fn(),
}));

jest.mock("@/lib/firebase/config", () => ({
  db: { name: "firestore-instance" },
  auth: { name: "auth-instance" },
  storage: { name: "storage-instance" },
  default: { name: "[DEFAULT]" },
}));

import { uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { uploadImage, deleteImage } from "../storage";

const mockedUploadBytesResumable = uploadBytesResumable as jest.MockedFunction<typeof uploadBytesResumable>;
const mockedGetDownloadURL = getDownloadURL as jest.MockedFunction<typeof getDownloadURL>;
const mockedDeleteObject = deleteObject as jest.MockedFunction<typeof deleteObject>;

function createMockFile(name: string, size: number, type: string): File {
  const content = new ArrayBuffer(size);
  return new File([content], name, { type });
}

/**
 * Helper to create a mock upload task that simulates Firebase Storage behaviour.
 * Calls the state_changed observer with a progress snapshot, then calls complete.
 */
function createMockUploadTask(snapshotRef: unknown) {
  return {
    on: jest.fn(
      (
        _event: string,
        progress: (snapshot: { bytesTransferred: number; totalBytes: number }) => void,
        _error: (error: Error) => void,
        complete: () => void,
      ) => {
        // Simulate progress
        progress({ bytesTransferred: 50, totalBytes: 100 });
        progress({ bytesTransferred: 100, totalBytes: 100 });
        // Simulate completion
        complete();
      },
    ),
    snapshot: { ref: snapshotRef },
  };
}

function createMockUploadTaskWithError(error: Error) {
  return {
    on: jest.fn(
      (
        _event: string,
        _progress: (snapshot: { bytesTransferred: number; totalBytes: number }) => void,
        errorCb: (error: Error) => void,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _complete: () => void,
      ) => {
        errorCb(error);
      },
    ),
    snapshot: { ref: null },
  };
}

describe("storage service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("uploadImage", () => {
    it("uploads valid JPEG and returns download URL", async () => {
      const file = createMockFile("photo.jpg", 1024, "image/jpeg");
      const mockRef = { fullPath: "projects/photo.jpg" };
      const mockTask = createMockUploadTask(mockRef);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockedUploadBytesResumable.mockReturnValue(mockTask as any);
      mockedGetDownloadURL.mockResolvedValue("https://firebasestorage.googleapis.com/photo.jpg");

      const result = await uploadImage(file, "projects/photo.jpg");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("https://firebasestorage.googleapis.com/photo.jpg");
      }
    });

    it("uploads valid PNG under 5MB and returns download URL", async () => {
      const file = createMockFile("image.png", 4.9 * 1024 * 1024, "image/png");
      const mockRef = { fullPath: "projects/image.png" };
      const mockTask = createMockUploadTask(mockRef);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockedUploadBytesResumable.mockReturnValue(mockTask as any);
      mockedGetDownloadURL.mockResolvedValue("https://firebasestorage.googleapis.com/image.png");

      const result = await uploadImage(file, "projects/image.png");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("https://firebasestorage.googleapis.com/image.png");
      }
    });

    it("uploads valid WebP and returns download URL", async () => {
      const file = createMockFile("photo.webp", 2048, "image/webp");
      const mockRef = { fullPath: "projects/photo.webp" };
      const mockTask = createMockUploadTask(mockRef);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockedUploadBytesResumable.mockReturnValue(mockTask as any);
      mockedGetDownloadURL.mockResolvedValue("https://firebasestorage.googleapis.com/photo.webp");

      const result = await uploadImage(file, "projects/photo.webp");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("https://firebasestorage.googleapis.com/photo.webp");
      }
    });

    it("rejects PDF with invalid file type error", async () => {
      const file = createMockFile("document.pdf", 1024, "application/pdf");

      const result = await uploadImage(file, "projects/document.pdf");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Invalid file type. Allowed types: JPEG, PNG, WebP");
      }
      expect(mockedUploadBytesResumable).not.toHaveBeenCalled();
    });

    it("rejects file over 5MB with file too large error", async () => {
      const file = createMockFile("large.jpg", 6 * 1024 * 1024, "image/jpeg");

      const result = await uploadImage(file, "projects/large.jpg");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("File too large. Maximum size is 5MB");
      }
      expect(mockedUploadBytesResumable).not.toHaveBeenCalled();
    });

    it("accepts a file that is exactly 5MB", async () => {
      const file = createMockFile("exact.jpg", 5 * 1024 * 1024, "image/jpeg");
      const mockRef = { fullPath: "projects/exact.jpg" };
      const mockTask = createMockUploadTask(mockRef);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockedUploadBytesResumable.mockReturnValue(mockTask as any);
      mockedGetDownloadURL.mockResolvedValue("https://firebasestorage.googleapis.com/exact.jpg");

      const result = await uploadImage(file, "projects/exact.jpg");

      expect(result.success).toBe(true);
    });

    it("calls onProgress callback during upload", async () => {
      const file = createMockFile("photo.jpg", 1024, "image/jpeg");
      const mockRef = { fullPath: "projects/photo.jpg" };
      const mockTask = createMockUploadTask(mockRef);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockedUploadBytesResumable.mockReturnValue(mockTask as any);
      mockedGetDownloadURL.mockResolvedValue("https://firebasestorage.googleapis.com/photo.jpg");

      const onProgress = jest.fn();
      await uploadImage(file, "projects/photo.jpg", onProgress);

      expect(onProgress).toHaveBeenCalledWith(50);
      expect(onProgress).toHaveBeenCalledWith(100);
    });

    it("returns error when upload fails", async () => {
      const file = createMockFile("photo.jpg", 1024, "image/jpeg");
      const mockTask = createMockUploadTaskWithError(new Error("Storage quota exceeded"));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockedUploadBytesResumable.mockReturnValue(mockTask as any);

      const result = await uploadImage(file, "projects/photo.jpg");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Storage quota exceeded");
      }
    });

    it("returns error when getDownloadURL fails", async () => {
      const file = createMockFile("photo.jpg", 1024, "image/jpeg");
      const mockRef = { fullPath: "projects/photo.jpg" };
      const mockTask = createMockUploadTask(mockRef);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockedUploadBytesResumable.mockReturnValue(mockTask as any);
      mockedGetDownloadURL.mockRejectedValue(new Error("URL generation failed"));

      const result = await uploadImage(file, "projects/photo.jpg");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("URL generation failed");
      }
    });
  });

  describe("deleteImage", () => {
    it("deletes image successfully", async () => {
      mockedDeleteObject.mockResolvedValue(undefined);

      const result = await deleteImage("https://firebasestorage.googleapis.com/photo.jpg");

      expect(result.success).toBe(true);
    });

    it("returns error when delete fails", async () => {
      mockedDeleteObject.mockRejectedValue(new Error("Object not found"));

      const result = await deleteImage("https://firebasestorage.googleapis.com/nonexistent.jpg");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Object not found");
      }
    });
  });
});
