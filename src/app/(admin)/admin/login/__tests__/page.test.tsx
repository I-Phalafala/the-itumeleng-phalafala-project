import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminLoginPage from "../page";

// ─── Mocks ───────────────────────────────────────────────────

const mockReplace = jest.fn();
let mockSearchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => mockSearchParams,
}));

// Mock Firebase signInWithEmailAndPassword
const mockSignIn = jest.fn();
const mockGetIdToken = jest.fn();
jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: (...args: unknown[]) => mockSignIn(...args),
}));

// Mock Firebase config to avoid env-var validation
jest.mock("@/lib/firebase/config", () => ({
  auth: { name: "mock-auth" },
}));

// Mock session utilities
const mockSetSessionCookie = jest.fn();
jest.mock("@/lib/auth/session", () => ({
  setSessionCookie: (...args: unknown[]) => mockSetSessionCookie(...args),
  getSafeAdminRedirect: (raw: string | null) => {
    const fallback = "/admin/dashboard";
    if (!raw) return fallback;
    if (raw.startsWith("/admin/") && !raw.startsWith("/admin/login")) return raw;
    return fallback;
  },
}));

// ─── Tests ───────────────────────────────────────────────────

describe("AdminLoginPage (/admin/login)", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    mockGetIdToken.mockResolvedValue("mock-id-token");
    mockSignIn.mockResolvedValue({ user: { getIdToken: mockGetIdToken } });
  });

  it("renders login form with email and password fields", () => {
    render(<AdminLoginPage />);

    expect(screen.getByRole("heading", { name: /admin login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("shows validation error when submitting with empty email", async () => {
    render(<AdminLoginPage />);

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Email is required.");
    });

    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it("shows validation error when submitting with email but empty password", async () => {
    render(<AdminLoginPage />);

    await user.type(screen.getByLabelText(/email/i), "admin@example.com");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Password is required.");
    });

    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it("sets the session cookie after successful sign-in", async () => {
    render(<AdminLoginPage />);

    await user.type(screen.getByLabelText(/email/i), "admin@example.com");
    await user.type(screen.getByLabelText(/password/i), "correct-password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockSetSessionCookie).toHaveBeenCalledWith("mock-id-token");
    });
  });

  it("redirects to /admin/dashboard by default after successful sign-in", async () => {
    render(<AdminLoginPage />);

    await user.type(screen.getByLabelText(/email/i), "admin@example.com");
    await user.type(screen.getByLabelText(/password/i), "correct-password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/admin/dashboard");
    });
  });

  it("honors the redirect query param after successful sign-in", async () => {
    mockSearchParams = new URLSearchParams({ redirect: "/admin/skills" });
    render(<AdminLoginPage />);

    await user.type(screen.getByLabelText(/email/i), "admin@example.com");
    await user.type(screen.getByLabelText(/password/i), "correct-password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/admin/skills");
    });
  });

  it("falls back to /admin/dashboard for unsafe redirect param", async () => {
    mockSearchParams = new URLSearchParams({ redirect: "https://evil.com" });
    render(<AdminLoginPage />);

    await user.type(screen.getByLabelText(/email/i), "admin@example.com");
    await user.type(screen.getByLabelText(/password/i), "correct-password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/admin/dashboard");
    });
  });

  it("displays error message on invalid credentials", async () => {
    mockSignIn.mockRejectedValue({ code: "auth/invalid-credential" });
    render(<AdminLoginPage />);

    await user.type(screen.getByLabelText(/email/i), "admin@example.com");
    await user.type(screen.getByLabelText(/password/i), "wrong-password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Invalid email or password.");
    });
  });

  it("displays network error message on network failure", async () => {
    mockSignIn.mockRejectedValue({ code: "auth/network-request-failed" });
    render(<AdminLoginPage />);

    await user.type(screen.getByLabelText(/email/i), "admin@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "A network error occurred. Please check your connection.",
      );
    });
  });

  it("shows loading state during authentication", async () => {
    mockSignIn.mockImplementation(() => new Promise(() => {}));
    render(<AdminLoginPage />);

    await user.type(screen.getByLabelText(/email/i), "admin@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /signing in/i })).toBeDisabled();
    });
  });
});
