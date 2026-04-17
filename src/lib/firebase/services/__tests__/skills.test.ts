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
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../skills";

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

describe("skills service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getSkills", () => {
    it("returns skills on success", async () => {
      const mockDocs = [
        { id: "s1", data: { name: "TypeScript", category: "Language", order: 1 } },
        { id: "s2", data: { name: "React", category: "Framework", order: 2 } },
      ];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockedGetDocs.mockResolvedValue(createMockQuerySnapshot(mockDocs) as any);

      const result = await getSkills();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(2);
        expect(result.data[0]).toEqual(
          expect.objectContaining({ id: "s1", name: "TypeScript" }),
        );
      }
    });

    it("returns error when Firestore fails", async () => {
      mockedGetDocs.mockRejectedValue(new Error("Firestore offline"));

      const result = await getSkills();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Firestore offline");
      }
    });
  });

  describe("getSkillById", () => {
    it("returns skill when found", async () => {
      mockedGetDoc.mockResolvedValue({
        exists: () => true,
        id: "s1",
        data: () => ({ name: "TypeScript", category: "Language" }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const result = await getSkillById("s1");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(
          expect.objectContaining({ id: "s1", name: "TypeScript" }),
        );
      }
    });

    it("returns null when not found", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockedGetDoc.mockResolvedValue({ exists: () => false } as any);

      const result = await getSkillById("nonexistent");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }
    });

    it("returns error on failure", async () => {
      mockedGetDoc.mockRejectedValue(new Error("Connection lost"));

      const result = await getSkillById("s1");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Connection lost");
      }
    });
  });

  describe("createSkill", () => {
    it("returns new document ID on success", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockedAddDoc.mockResolvedValue({ id: "new-skill-id" } as any);

      const result = await createSkill({
        name: "Vue",
        category: "Framework",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("new-skill-id");
      }
    });

    it("returns error on failure", async () => {
      mockedAddDoc.mockRejectedValue(new Error("Permission denied"));

      const result = await createSkill({
        name: "Vue",
        category: "Framework",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Permission denied");
      }
    });
  });

  describe("updateSkill", () => {
    it("returns success on update", async () => {
      mockedUpdateDoc.mockResolvedValue(undefined);

      const result = await updateSkill("s1", { name: "Updated Skill" });

      expect(result.success).toBe(true);
    });

    it("returns error when document does not exist", async () => {
      const notFoundError = Object.assign(new Error("Document not found"), { code: "not-found" });
      mockedUpdateDoc.mockRejectedValue(notFoundError);

      const result = await updateSkill("nonexistent", { name: "Updated" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("not found");
      }
    });

    it("returns error on failure", async () => {
      mockedUpdateDoc.mockRejectedValue(new Error("Connection error"));

      const result = await updateSkill("s1", { name: "Updated" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Connection error");
      }
    });
  });

  describe("deleteSkill", () => {
    it("returns success on delete", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockedGetDoc.mockResolvedValue({ exists: () => true } as any);
      mockedDeleteDoc.mockResolvedValue(undefined);

      const result = await deleteSkill("s1");

      expect(result.success).toBe(true);
    });

    it("returns error when document does not exist", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockedGetDoc.mockResolvedValue({ exists: () => false } as any);

      const result = await deleteSkill("nonexistent");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("not found");
      }
    });

    it("returns error on Firestore failure", async () => {
      mockedGetDoc.mockRejectedValue(new Error("Connection lost"));

      const result = await deleteSkill("s1");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Connection lost");
      }
    });
  });
});
