// Mock Firebase modules before any imports
jest.mock("firebase/app", () => {
  const mockApp = { name: "[DEFAULT]", options: {}, automaticDataCollectionEnabled: false };
  return {
    initializeApp: jest.fn(() => mockApp),
    getApps: jest.fn(() => [mockApp]),
    getApp: jest.fn(() => mockApp),
  };
});

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({ name: "auth-instance" })),
  onAuthStateChanged: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({ name: "firestore-instance" })),
}));

jest.mock("firebase/storage", () => ({
  getStorage: jest.fn(() => ({ name: "storage-instance" })),
}));

jest.mock("@/lib/auth/session", () => ({
  clearSessionCookie: jest.fn(),
  setSessionCookie: jest.fn(),
  getSafeAdminRedirect: jest.fn((raw: string | null) => raw ?? "/admin/dashboard"),
}));

jest.mock("@/lib/firebase/config", () => ({
  auth: { name: "auth-instance" },
  db: { name: "firestore-instance" },
  storage: { name: "storage-instance" },
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

import { renderHook } from "@testing-library/react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { clearSessionCookie } from "@/lib/auth/session";

const mockedClearSessionCookie = clearSessionCookie as jest.MockedFunction<
  typeof clearSessionCookie
>;
const mockedOnAuthStateChanged = onAuthStateChanged as jest.MockedFunction<
  typeof onAuthStateChanged
>;
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe("useAuthGuard", () => {
  let routerReplace: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    routerReplace = jest.fn();
    mockedUseRouter.mockReturnValue({
      replace: routerReplace,
      push: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    } as ReturnType<typeof useRouter>);
  });

  it("starts with loading=true and user=null", () => {
    // onAuthStateChanged never calls back in this test
    mockedOnAuthStateChanged.mockImplementation(() => jest.fn());

    const { result } = renderHook(() => useAuthGuard());

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();
  });

  it("sets user and stops loading when Firebase reports an authenticated user", () => {
    const fakeUser = { uid: "user-123", email: "admin@example.com" };

    mockedOnAuthStateChanged.mockImplementation((_auth, callback) => {
      // Immediately invoke with a user
      (callback as (u: typeof fakeUser | null) => void)(fakeUser);
      return jest.fn(); // unsubscribe
    });

    const { result } = renderHook(() => useAuthGuard());

    expect(result.current.loading).toBe(false);
    expect(result.current.user).toEqual(fakeUser);
    expect(routerReplace).not.toHaveBeenCalled();
  });

  it("redirects to /admin/login when Firebase reports no user", () => {
    mockedOnAuthStateChanged.mockImplementation((_auth, callback) => {
      (callback as (u: null) => void)(null);
      return jest.fn();
    });

    renderHook(() => useAuthGuard());

    expect(routerReplace).toHaveBeenCalledWith("/admin/login");
  });

  it("clears the session cookie when redirecting unauthenticated user", () => {
    mockedOnAuthStateChanged.mockImplementation((_auth, callback) => {
      (callback as (u: null) => void)(null);
      return jest.fn();
    });

    renderHook(() => useAuthGuard());

    expect(mockedClearSessionCookie).toHaveBeenCalled();
    expect(routerReplace).toHaveBeenCalledWith("/admin/login");
  });

  it("unsubscribes from onAuthStateChanged on unmount", () => {
    const unsubscribe = jest.fn();
    mockedOnAuthStateChanged.mockImplementation(() => unsubscribe);

    const { unmount } = renderHook(() => useAuthGuard());
    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });
});
