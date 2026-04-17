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
  collection: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
}));

jest.mock("firebase/storage", () => ({
  getStorage: jest.fn(() => ({ name: "storage-instance" })),
}));

jest.mock("@/lib/firebase/config", () => ({
  db: { name: "firestore-instance" },
  auth: { name: "auth-instance" },
  storage: { name: "storage-instance" },
  default: { name: "[DEFAULT]" },
}));

import { getDocs, getDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import {
  getExperience,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../experience";

const mockedGetDocs = getDocs as jest.MockedFunction<typeof getDocs>;
const mockedGetDoc = getDoc as jest.MockedFunction<typeof getDoc>;
const mockedAddDoc = addDoc as jest.MockedFunction<typeof addDoc>;
const mockedUpdateDoc = updateDoc as jest.MockedFunction<typeof updateDoc>;
const mockedDeleteDoc = deleteDoc as jest.MockedFunction<typeof deleteDoc>;

function createMockQuerySnapshot(
  docs: Array<{ id: string; data: Record<string, unknown> }>,
) {
  return {
    docs: docs.map((d) => ({
      id: d.id,
      data: () => d.data,
    })),
  };
}

describe("experience service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getExperience", () => {
    it("returns experience items on success", async () => {
      const mockDocs = [
        {
          id: "e1",
          data: {
            company: "Acme",
            role: "Engineer",
            startDate: "2023-01-01",
            endDate: null,
            impact: ["Built things"],
            techStack: ["TS"],
            order: 1,
          },
        },
      ];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockedGetDocs.mockResolvedValue(createMockQuerySnapshot(mockDocs) as any);

      const result = await getExperience();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(1);
        expect(result.data[0]).toEqual(expect.objectContaining({ id: "e1", company: "Acme" }));
      }
    });

    it("returns error when Firestore fails", async () => {
      mockedGetDocs.mockRejectedValue(new Error("Firestore offline"));

      const result = await getExperience();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Firestore offline");
      }
    });
  });

  describe("getExperienceById", () => {
    it("returns experience item when found", async () => {
      mockedGetDoc.mockResolvedValue({
        exists: () => true,
        id: "e1",
        data: () => ({ company: "Acme", role: "Engineer" }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const result = await getExperienceById("e1");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(expect.objectContaining({ id: "e1", company: "Acme" }));
      }
    });

    it("returns null when not found", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockedGetDoc.mockResolvedValue({ exists: () => false } as any);

      const result = await getExperienceById("nonexistent");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }
    });

    it("returns error on failure", async () => {
      mockedGetDoc.mockRejectedValue(new Error("Connection lost"));

      const result = await getExperienceById("e1");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Connection lost");
      }
    });
  });

  describe("createExperience", () => {
    it("returns new document ID on success", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockedAddDoc.mockResolvedValue({ id: "new-exp-id" } as any);

      const result = await createExperience({
        company: "New Corp",
        role: "Dev",
        startDate: "2024-01-01",
        endDate: null,
        impact: [],
        techStack: [],
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("new-exp-id");
      }
    });

    it("returns error on failure", async () => {
      mockedAddDoc.mockRejectedValue(new Error("Permission denied"));

      const result = await createExperience({
        company: "New Corp",
        role: "Dev",
        startDate: "2024-01-01",
        endDate: null,
        impact: [],
        techStack: [],
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Permission denied");
      }
    });
  });

  describe("updateExperience", () => {
    it("returns success on update", async () => {
      mockedUpdateDoc.mockResolvedValue(undefined);

      const result = await updateExperience("e1", { role: "Senior Engineer" });

      expect(result.success).toBe(true);
    });

    it("returns error on failure", async () => {
      mockedUpdateDoc.mockRejectedValue(new Error("Not found"));

      const result = await updateExperience("e1", { role: "Updated" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Not found");
      }
    });
  });

  describe("deleteExperience", () => {
    it("returns success on delete", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockedGetDoc.mockResolvedValue({ exists: () => true } as any);
      mockedDeleteDoc.mockResolvedValue(undefined);

      const result = await deleteExperience("e1");

      expect(result.success).toBe(true);
    });

    it("returns error when document does not exist", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockedGetDoc.mockResolvedValue({ exists: () => false } as any);

      const result = await deleteExperience("nonexistent");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("not found");
      }
    });

    it("returns error on Firestore failure", async () => {
      mockedGetDoc.mockRejectedValue(new Error("Connection lost"));

      const result = await deleteExperience("e1");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Connection lost");
      }
    });
  });
});
