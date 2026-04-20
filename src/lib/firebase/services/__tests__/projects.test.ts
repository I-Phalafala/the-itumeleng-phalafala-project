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
  where: jest.fn(),
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
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} from "../projects";

const mockedGetDocs = getDocs as jest.MockedFunction<typeof getDocs>;
const mockedGetDoc = getDoc as jest.MockedFunction<typeof getDoc>;
const mockedAddDoc = addDoc as jest.MockedFunction<typeof addDoc>;
const mockedUpdateDoc = updateDoc as jest.MockedFunction<typeof updateDoc>;
const mockedDeleteDoc = deleteDoc as jest.MockedFunction<typeof deleteDoc>;

function createMockQuerySnapshot(
  docs: Array<{ id: string; data: Record<string, unknown> }>,
) {
  return {
    empty: docs.length === 0,
    docs: docs.map((d) => ({
      id: d.id,
      data: () => d.data,
    })),
  };
}

describe("projects service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getProjects", () => {
    it("returns projects on success", async () => {
      const mockDocs = [
        { id: "p1", data: { title: "Project A", slug: "project-a", order: 1 } },
        { id: "p2", data: { title: "Project B", slug: "project-b", order: 2 } },
      ];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockedGetDocs.mockResolvedValue(createMockQuerySnapshot(mockDocs) as any);

      const result = await getProjects();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(2);
        expect(result.data[0]).toEqual(expect.objectContaining({ id: "p1", title: "Project A" }));
      }
    });

    it("returns error when Firestore fails", async () => {
      mockedGetDocs.mockRejectedValue(new Error("Firestore offline"));

      const result = await getProjects();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Firestore offline");
      }
    });
  });

  describe("getProjectBySlug", () => {
    it("returns project when found", async () => {
      const mockDocs = [
        { id: "p1", data: { title: "My Project", slug: "my-project" } },
      ];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockedGetDocs.mockResolvedValue(createMockQuerySnapshot(mockDocs) as any);

      const result = await getProjectBySlug("my-project");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(expect.objectContaining({ id: "p1", slug: "my-project" }));
      }
    });

    it("returns null when not found", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockedGetDocs.mockResolvedValue(createMockQuerySnapshot([]) as any);

      const result = await getProjectBySlug("nonexistent");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }
    });

    it("returns error on failure", async () => {
      mockedGetDocs.mockRejectedValue(new Error("Network error"));

      const result = await getProjectBySlug("any");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Network error");
      }
    });
  });

  describe("createProject", () => {
    it("returns new document ID on success", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockedAddDoc.mockResolvedValue({ id: "new-id" } as any);

      const result = await createProject({
        title: "New Project",
        slug: "new-project",
        description: "desc",
        tags: ["ts"],
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("new-id");
      }
    });

    it("returns error on failure", async () => {
      mockedAddDoc.mockRejectedValue(new Error("Permission denied"));

      const result = await createProject({
        title: "New Project",
        slug: "new-project",
        description: "desc",
        tags: [],
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Permission denied");
      }
    });
  });

  describe("updateProject", () => {
    it("returns success on update", async () => {
      mockedUpdateDoc.mockResolvedValue(undefined);

      const result = await updateProject("p1", { title: "Updated" });

      expect(result.success).toBe(true);
    });

    it("returns error when document does not exist", async () => {
      const notFoundError = Object.assign(new Error("Document not found"), { code: "not-found" });
      mockedUpdateDoc.mockRejectedValue(notFoundError);

      const result = await updateProject("nonexistent", { title: "Updated" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("not found");
      }
    });

    it("returns error on failure", async () => {
      mockedUpdateDoc.mockRejectedValue(new Error("Connection error"));

      const result = await updateProject("p1", { title: "Updated" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Connection error");
      }
    });
  });

  describe("deleteProject", () => {
    it("returns success on delete", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockedGetDoc.mockResolvedValue({ exists: () => true } as any);
      mockedDeleteDoc.mockResolvedValue(undefined);

      const result = await deleteProject("p1");

      expect(result.success).toBe(true);
    });

    it("returns error when document does not exist", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockedGetDoc.mockResolvedValue({ exists: () => false } as any);

      const result = await deleteProject("nonexistent");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("not found");
      }
    });

    it("returns error on Firestore failure", async () => {
      mockedGetDoc.mockRejectedValue(new Error("Connection lost"));

      const result = await deleteProject("p1");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Connection lost");
      }
    });
  });
});
