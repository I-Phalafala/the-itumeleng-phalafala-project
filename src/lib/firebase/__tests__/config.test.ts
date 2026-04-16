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
}));

// Set required env vars for tests
const TEST_ENV = {
  NEXT_PUBLIC_FIREBASE_API_KEY: "test-api-key",
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "test.firebaseapp.com",
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: "test-project",
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "test.appspot.com",
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "123456",
  NEXT_PUBLIC_FIREBASE_APP_ID: "1:123456:web:abc123",
};

describe("Firebase config", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, ...TEST_ENV };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("exports db, auth, and storage instances", async () => {
    const config = await import("@/lib/firebase/config");

    expect(config.db).toBeDefined();
    expect(config.auth).toBeDefined();
    expect(config.storage).toBeDefined();
    expect(config.default).toBeDefined();
  });

  it("initializes Firebase app with initializeApp when no apps exist", async () => {
    const { initializeApp, getApps } = await import("firebase/app");

    (getApps as jest.Mock).mockReturnValue([]);

    await import("@/lib/firebase/config");

    expect(initializeApp).toHaveBeenCalledWith({
      apiKey: "test-api-key",
      authDomain: "test.firebaseapp.com",
      projectId: "test-project",
      storageBucket: "test.appspot.com",
      messagingSenderId: "123456",
      appId: "1:123456:web:abc123",
    });
  });

  it("reuses existing app via getApp when apps already exist (hot reload)", async () => {
    const { getApps, getApp, initializeApp } = await import("firebase/app");
    const mockExistingApp = { name: "[DEFAULT]", options: {}, automaticDataCollectionEnabled: false };

    (getApps as jest.Mock).mockReturnValue([mockExistingApp]);
    (getApp as jest.Mock).mockReturnValue(mockExistingApp);

    await import("@/lib/firebase/config");

    expect(getApp).toHaveBeenCalled();
    expect(initializeApp).not.toHaveBeenCalled();
  });

  it("throws error when required env vars are missing", async () => {
    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    await expect(import("@/lib/firebase/config")).rejects.toThrow(
      /Missing required Firebase environment variable\(s\):.*NEXT_PUBLIC_FIREBASE_API_KEY.*NEXT_PUBLIC_FIREBASE_PROJECT_ID/
    );
  });
});
