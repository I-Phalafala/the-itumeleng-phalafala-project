import { renderHook, act } from "@testing-library/react";
import { useAuth } from "../useAuth";

// Capture the callback passed to onAuthStateChanged
let authCallback: (user: unknown) => void;
const mockUnsubscribe = jest.fn();

jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn((_auth: unknown, callback: (user: unknown) => void) => {
    authCallback = callback;
    return mockUnsubscribe;
  }),
}));

jest.mock("@/lib/firebase/config", () => ({
  auth: { name: "mock-auth" },
}));

describe("useAuth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("starts with loading true and user null", () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();
  });

  it("sets user and loading false when auth state resolves with a user", () => {
    const { result } = renderHook(() => useAuth());

    const mockUser = { uid: "test-uid", email: "test@example.com" };
    act(() => {
      authCallback(mockUser);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.user).toEqual(mockUser);
  });

  it("sets user to null when auth state resolves without a user", () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      authCallback(null);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("unsubscribes from auth state changes on unmount", () => {
    const { unmount } = renderHook(() => useAuth());

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});
