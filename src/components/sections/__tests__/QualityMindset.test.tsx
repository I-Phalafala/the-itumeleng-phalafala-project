import { render, screen } from "@testing-library/react";
import QualityMindset, { QUALITY_CARDS } from "../QualityMindset";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    div: ({ children, className }: any) => (
      <div className={className}>{children}</div>
    ),
  },
}));

describe("QualityMindset section", () => {
  beforeEach(() => {
    render(<QualityMindset />);
  });

  // Functional: All 4 cards render on page load
  it("renders all 4 QA cards with title, description, and tools", () => {
    expect(screen.getByText("UI Testing")).toBeInTheDocument();
    expect(screen.getByText("API Testing")).toBeInTheDocument();
    expect(screen.getByText("Test Automation")).toBeInTheDocument();
    expect(screen.getByText("CI/CD")).toBeInTheDocument();
  });

  it("renders each card's description", () => {
    QUALITY_CARDS.forEach((card) => {
      expect(screen.getByText(card.description)).toBeInTheDocument();
    });
  });

  it("renders each card's tools as badges", () => {
    // Spot-check a tool from every card
    expect(screen.getByText("Cypress")).toBeInTheDocument();
    expect(screen.getByText("Postman")).toBeInTheDocument();
    expect(screen.getByText("Jest")).toBeInTheDocument();
    expect(screen.getByText("GitHub Actions")).toBeInTheDocument();
  });

  // Edge Case: Very long tool list does not overflow the card boundary
  it("all tool badges use overflow-safe classes to prevent layout overflow", () => {
    // Collect every rendered tool badge across all cards
    const allTools = QUALITY_CARDS.flatMap((card) => card.tools);
    allTools.forEach((tool) => {
      const badge = screen.getByText(tool);
      expect(badge).toHaveClass("whitespace-nowrap");
      expect(badge).toHaveClass("max-w-full");
      expect(badge).toHaveClass("overflow-hidden");
    });
  });
});

// Negative: Missing card title → card renders with "Untitled" fallback
describe("QualityMindset section – title fallback", () => {
  it("renders 'Untitled' in the UI when a card has an empty title", () => {
    render(
      <QualityMindset
        cards={[
          {
            id: "no-title",
            title: "",
            description: "A card with no title",
            tools: ["SomeTool"],
          },
        ]}
      />
    );
    expect(screen.getByText("Untitled")).toBeInTheDocument();
  });

  it("QUALITY_CARDS data all have truthy titles (no unintentional fallbacks in production)", () => {
    QUALITY_CARDS.forEach((card) => {
      expect(card.title).toBeTruthy();
    });
  });
});

describe("QualityMindset section – icon fallback rendering", () => {
  it("renders without errors and shows section heading", () => {
    render(<QualityMindset />);
    expect(screen.getByText("Quality Mindset")).toBeInTheDocument();
  });

  it("renders SVG icons for all 4 known card ids (no fallback placeholder shown)", () => {
    render(<QualityMindset />);
    // Icons are aria-hidden SVGs; confirm no fallback placeholder is shown in normal render
    expect(screen.queryByTestId("fallback-icon")).not.toBeInTheDocument();
  });

  it("renders the fallback icon placeholder for an unknown card id", () => {
    render(
      <QualityMindset
        cards={[
          {
            id: "unknown-id",
            title: "Unknown Card",
            description: "No icon for this id",
            tools: [],
          },
        ]}
      />
    );
    expect(screen.getByTestId("fallback-icon")).toBeInTheDocument();
  });
});
