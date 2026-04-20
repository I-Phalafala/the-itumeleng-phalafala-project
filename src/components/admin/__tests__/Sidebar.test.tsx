import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Sidebar from "../Sidebar";

// ─── Mocks ───────────────────────────────────────────────────

const mockReplace = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => "/admin/dashboard",
}));

jest.mock("next/link", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ href, children, onClick, ...rest }: any) => (
    <a href={href} onClick={onClick} {...rest}>
      {children}
    </a>
  ),
}));

const mockSignOut = jest.fn();
jest.mock("firebase/auth", () => ({
  signOut: (...args: unknown[]) => mockSignOut(...args),
}));

jest.mock("@/lib/firebase/config", () => ({
  auth: { name: "mock-auth" },
}));

const mockClearSessionCookie = jest.fn();
jest.mock("@/lib/auth/session", () => ({
  clearSessionCookie: () => mockClearSessionCookie(),
}));

// ─── Tests ───────────────────────────────────────────────────

describe("Sidebar component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all navigation links", () => {
    render(<Sidebar />);

    expect(screen.getByRole("link", { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /projects/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /experience/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /skills/i })).toBeInTheDocument();
  });

  it("renders logout button", () => {
    render(<Sidebar />);

    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  it("highlights the active route", () => {
    render(<Sidebar />);

    const dashboardLink = screen.getByRole("link", { name: /dashboard/i });
    expect(dashboardLink).toHaveAttribute("aria-current", "page");

    const projectsLink = screen.getByRole("link", { name: /projects/i });
    expect(projectsLink).not.toHaveAttribute("aria-current", "page");
  });

  it("calls signOut and clears session cookie on logout", async () => {
    mockSignOut.mockResolvedValue(undefined);

    render(<Sidebar />);

    fireEvent.click(screen.getByRole("button", { name: /logout/i }));

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1);
      expect(mockClearSessionCookie).toHaveBeenCalledTimes(1);
      expect(mockReplace).toHaveBeenCalledWith("/admin/login");
    });
  });

  it("shows mobile toggle button", () => {
    render(<Sidebar />);

    expect(screen.getByRole("button", { name: /open navigation menu/i })).toBeInTheDocument();
  });

  it("toggles sidebar open and closed on mobile button click", () => {
    render(<Sidebar />);

    const toggleButton = screen.getByRole("button", { name: /open navigation menu/i });

    // Sidebar starts closed on mobile (default state)
    const sidebar = document.getElementById("admin-sidebar");
    expect(sidebar).toHaveClass("-translate-x-full");

    // Open sidebar
    fireEvent.click(toggleButton);
    expect(sidebar).toHaveClass("translate-x-0");
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");

    // Close sidebar
    fireEvent.click(toggleButton);
    expect(sidebar).toHaveClass("-translate-x-full");
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
  });

  it("closes sidebar when overlay is clicked", () => {
    render(<Sidebar />);

    const toggleButton = screen.getByRole("button", { name: /open navigation menu/i });
    fireEvent.click(toggleButton);

    // Sidebar should be open
    const sidebar = document.getElementById("admin-sidebar");
    expect(sidebar).toHaveClass("translate-x-0");

    // Click overlay
    const overlay = document.querySelector("[aria-hidden='true']");
    expect(overlay).not.toBeNull();
    if (overlay) {
      fireEvent.click(overlay);
    }

    expect(sidebar).toHaveClass("-translate-x-full");
  });

  it("closes sidebar when a nav link is clicked", () => {
    render(<Sidebar />);

    const toggleButton = screen.getByRole("button", { name: /open navigation menu/i });
    fireEvent.click(toggleButton);

    const sidebar = document.getElementById("admin-sidebar");
    expect(sidebar).toHaveClass("translate-x-0");

    // Click a nav link
    fireEvent.click(screen.getByRole("link", { name: /projects/i }));
    expect(sidebar).toHaveClass("-translate-x-full");
  });
});
