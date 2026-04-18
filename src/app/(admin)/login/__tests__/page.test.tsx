import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminLoginPage from "../page";

// ─── Mocks ───────────────────────────────────────────────────

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}));

// Mock useAuth hook
const mockUseAuth = jest.fn<{ user: unknown; loading: boolean }, []>();
jest.mock("@/hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock Firebase signInWithEmailAndPassword
const mockSignIn = jest.fn();
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
}));

// ─── Tests ───────────────────────────────────────────────────

describe("AdminLoginPage", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ user: null, loading: false });
  });

  it("renders login form with email and password fields", () => {
    render(<AdminLoginPage />);

    expect(screen.getByRole("heading", { name: /admin login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty fields", async () => {
    render(<AdminLoginPage />);

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });

    // signIn should NOT have been called
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it("shows email validation error for invalid email format", async () => {
    render(<AdminLoginPage />);

    await user.type(screen.getByLabelText(/email/i), "not-an-email");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText("Please enter a valid email address")).toBeInTheDocument();
    });

    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it("redirects to dashboard on successful login", async () => {
    const mockGetIdToken = jest.fn().mockResolvedValue("mock-token");
    mockSignIn.mockResolvedValue({ user: { uid: "123", getIdToken: mockGetIdToken } });

    render(<AdminLoginPage />);

    await user.type(screen.getByLabelText(/email/i), "admin@example.com");
    await user.type(screen.getByLabelText(/password/i), "correct-password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(
        { name: "mock-auth" },
        "admin@example.com",
        "correct-password",
      );
      expect(mockSetSessionCookie).toHaveBeenCalledWith("mock-token");
      expect(mockPush).toHaveBeenCalledWith("/admin/dashboard");
    });
  });

  it("displays 'Invalid email or password' on invalid credentials", async () => {
    mockSignIn.mockRejectedValue({ code: "auth/invalid-credential" });

    render(<AdminLoginPage />);

    await user.type(screen.getByLabelText(/email/i), "admin@example.com");
    await user.type(screen.getByLabelText(/password/i), "wrong-password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByTestId("auth-error")).toHaveTextContent(
        "Invalid email or password",
      );
    });
  });

  it("displays network error message on network failure", async () => {
    mockSignIn.mockRejectedValue({ code: "auth/network-request-failed" });

    render(<AdminLoginPage />);

    await user.type(screen.getByLabelText(/email/i), "admin@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByTestId("auth-error")).toHaveTextContent(
        "Network error. Please check your connection and try again",
      );
    });
  });

  it("shows loading spinner during authentication", async () => {
    // Make signIn hang to observe spinner
    mockSignIn.mockImplementation(() => new Promise(() => {}));

    render(<AdminLoginPage />);

    await user.type(screen.getByLabelText(/email/i), "admin@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText("Signing in…")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /signing in/i })).toBeDisabled();
    });
  });

  it("shows loading state while auth check is in progress", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true });

    render(<AdminLoginPage />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /admin login/i })).not.toBeInTheDocument();
  });

  it("redirects authenticated users away from login page", () => {
    mockUseAuth.mockReturnValue({
      user: { uid: "existing-user" } as unknown,
      loading: false,
    });

    render(<AdminLoginPage />);

    expect(mockReplace).toHaveBeenCalledWith("/admin/dashboard");
  });

  it("handles unexpected errors gracefully", async () => {
    mockSignIn.mockRejectedValue(new Error("Something unexpected"));

    render(<AdminLoginPage />);

    await user.type(screen.getByLabelText(/email/i), "admin@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByTestId("auth-error")).toHaveTextContent(
        "An unexpected error occurred. Please try again",
      );
    });
  });
});
