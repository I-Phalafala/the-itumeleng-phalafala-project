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
  query: jest.fn(),
  orderBy: jest.fn(),
}));

jest.mock("firebase/storage", () => ({
  getStorage: jest.fn(() => ({ name: "storage-instance" })),
}));

// Mock config to avoid env var checks at module load time
jest.mock("@/lib/firebase/config", () => ({
  db: { name: "firestore-instance" },
  auth: { name: "auth-instance" },
  storage: { name: "storage-instance" },
  default: { name: "[DEFAULT]" },
}));

import { getDocs } from "firebase/firestore";
import { getExperience } from "../experience";

const mockedGetDocs = getDocs as jest.MockedFunction<typeof getDocs>;

function createMockSnapshot(docs: Array<{ id: string; data: Record<string, unknown> }>) {
  return {
    docs: docs.map((d) => ({
      id: d.id,
      data: () => d.data,
    })),
  };
}

describe("getExperience", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns experience documents with correct fields", async () => {
    const mockDocs = [
      {
        id: "exp1",
        data: {
          company: "Mobisys GmbH",
          role: "Test Automation Engineer",
          startDate: "2025-03-01",
          endDate: null,
          impact: ["Automated tests with WebdriverIO"],
          techStack: ["TypeScript", "WebdriverIO"],
          order: 1,
        },
      },
      {
        id: "exp2",
        data: {
          company: "LexisNexis",
          role: "Quality Test Engineer III",
          startDate: "2022-04-01",
          endDate: "2024-03-01",
          impact: ["Reduced production defects by 30%"],
          techStack: ["Cypress", "Selenium"],
          order: 2,
        },
      },
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockedGetDocs.mockResolvedValue(createMockSnapshot(mockDocs) as any);

    const result = await getExperience();

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(expect.objectContaining({
      id: "exp1",
      company: "Mobisys GmbH",
      role: "Test Automation Engineer",
      startDate: "2025-03-01",
      endDate: null,
      impact: ["Automated tests with WebdriverIO"],
      techStack: ["TypeScript", "WebdriverIO"],
      order: 1,
    }));
    expect(result[1]).toEqual(expect.objectContaining({
      id: "exp2",
      company: "LexisNexis",
    }));
  });

  it("filters out documents with missing required fields", async () => {
    const mockDocs = [
      {
        id: "valid",
        data: {
          company: "Valid Corp",
          role: "Engineer",
          startDate: "2023-01-01",
          endDate: null,
          impact: ["Did things"],
          techStack: ["TypeScript"],
        },
      },
      {
        id: "missing-company",
        data: {
          role: "Engineer",
          startDate: "2023-01-01",
          endDate: null,
          impact: [],
          techStack: [],
        },
      },
      {
        id: "missing-role",
        data: {
          company: "No Role Corp",
          startDate: "2023-01-01",
          endDate: null,
          impact: [],
          techStack: [],
        },
      },
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockedGetDocs.mockResolvedValue(createMockSnapshot(mockDocs) as any);

    const result = await getExperience();

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("valid");
  });

  it("handles empty collection", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockedGetDocs.mockResolvedValue(createMockSnapshot([]) as any);

    const result = await getExperience();

    expect(result).toEqual([]);
  });

  it("filters out documents with empty company name", async () => {
    const mockDocs = [
      {
        id: "empty-company",
        data: {
          company: "   ",
          role: "Engineer",
          startDate: "2023-01-01",
          endDate: null,
          impact: [],
          techStack: [],
        },
      },
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockedGetDocs.mockResolvedValue(createMockSnapshot(mockDocs) as any);

    const result = await getExperience();

    expect(result).toHaveLength(0);
  });

  it("accepts documents with optional order field missing", async () => {
    const mockDocs = [
      {
        id: "no-order",
        data: {
          company: "Test Corp",
          role: "Developer",
          startDate: "2023-06-01",
          endDate: "2024-01-01",
          impact: ["Built features"],
          techStack: ["React"],
        },
      },
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockedGetDocs.mockResolvedValue(createMockSnapshot(mockDocs) as any);

    const result = await getExperience();

    expect(result).toHaveLength(1);
    expect(result[0].company).toBe("Test Corp");
  });
});
