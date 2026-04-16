import { render, screen, waitFor } from "@testing-library/react";
import Skills from "../Skills";
import { Skill } from "@/types/skill";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    div: (props: any) => <div className={props.className}>{props.children}</div>,
  },
}));

// Mock the firebase skills module
jest.mock("@/lib/firebase/skills", () => ({
  getSkills: jest.fn(),
}));

import { getSkills } from "@/lib/firebase/skills";

const mockedGetSkills = getSkills as jest.MockedFunction<typeof getSkills>;

const mockSkills: Skill[] = [
  { id: "1", name: "TypeScript", category: "Languages" },
  { id: "2", name: "JavaScript", category: "Languages" },
  { id: "3", name: "React", category: "Frameworks" },
  { id: "4", name: "Next.js", category: "Frameworks" },
  { id: "5", name: "Cypress", category: "QA Tools" },
  { id: "6", name: "Docker", category: "DevOps", icon: "docker" },
];

describe("Skills section", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Functional: Skills from Firestore render grouped correctly by category
  it("renders skills grouped correctly by category", async () => {
    mockedGetSkills.mockResolvedValue(mockSkills);

    render(<Skills />);

    await waitFor(() => {
      expect(screen.getByText("Languages")).toBeInTheDocument();
      expect(screen.getByText("Frameworks")).toBeInTheDocument();
      expect(screen.getByText("QA Tools")).toBeInTheDocument();
      expect(screen.getByText("DevOps")).toBeInTheDocument();
    });
  });

  // Functional: Each skill displays its name as a badge
  it("renders each skill name as a badge", async () => {
    mockedGetSkills.mockResolvedValue(mockSkills);

    render(<Skills />);

    await waitFor(() => {
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("JavaScript")).toBeInTheDocument();
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("Next.js")).toBeInTheDocument();
      expect(screen.getByText("Cypress")).toBeInTheDocument();
      expect(screen.getByText("Docker")).toBeInTheDocument();
    });
  });

  // Edge Case: Category with a single skill renders correctly (no layout issues)
  it("renders a category with a single skill without layout issues", async () => {
    const singleSkill: Skill[] = [
      { id: "solo", name: "Solidity", category: "Blockchain" },
    ];
    mockedGetSkills.mockResolvedValue(singleSkill);

    render(<Skills />);

    await waitFor(() => {
      expect(screen.getByText("Blockchain")).toBeInTheDocument();
      expect(screen.getByText("Solidity")).toBeInTheDocument();
    });
  });

  // Edge Case: Skill with a very long name does not overflow its badge
  it("renders a skill with a very long name without breaking the layout", async () => {
    const longNameSkill: Skill[] = [
      {
        id: "long",
        name: "A-Very-Long-Skill-Name-That-Could-Overflow-Badge",
        category: "Languages",
      },
    ];
    mockedGetSkills.mockResolvedValue(longNameSkill);

    render(<Skills />);

    await waitFor(() => {
      const badge = screen.getByText(
        "A-Very-Long-Skill-Name-That-Could-Overflow-Badge"
      );
      expect(badge).toBeInTheDocument();
    });
  });

  // Negative: Firestore returns empty skills array → "Skills coming soon" message shown
  it('shows "Skills coming soon" when Firestore returns an empty array', async () => {
    mockedGetSkills.mockResolvedValue([]);

    render(<Skills />);

    await waitFor(() => {
      expect(screen.getByText("Skills coming soon")).toBeInTheDocument();
    });
  });

  // Shows loading state while fetching
  it("shows loading state while fetching skills", () => {
    mockedGetSkills.mockReturnValue(new Promise(() => {})); // Never resolves

    render(<Skills />);

    expect(screen.getByText("Loading skills…")).toBeInTheDocument();
  });
});
