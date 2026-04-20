import { render, screen, waitFor } from "@testing-library/react";
import Projects from "../Projects";
import { Project } from "@/types/project";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    div: (props: any) => <div className={props.className}>{props.children}</div>,
  },
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, jsx-a11y/alt-text, @next/next/no-img-element
  default: (props: any) => <img src={props.src} alt={props.alt} className={props.className} />,
}));

// Mock next/link
jest.mock("next/link", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => <a href={props.href} className={props.className}>{props.children}</a>,
}));

const mockProjects: Project[] = [
  {
    id: "1",
    title: "Project Alpha",
    slug: "project-alpha",
    description: "First project description",
    thumbnailUrl: "https://example.com/alpha.png",
    tags: ["React"],
  },
  {
    id: "2",
    title: "Project Beta",
    slug: "project-beta",
    description: "Second project description",
    tags: ["Next.js", "TypeScript"],
  },
  {
    id: "3",
    title: "Project Gamma",
    slug: "project-gamma",
    description: "Third project description",
    thumbnailUrl: "https://example.com/gamma.png",
    tags: ["Node.js"],
  },
];

// Mock the firebase projects module
jest.mock("@/lib/firebase/projects", () => ({
  getProjects: jest.fn(),
}));

import { getProjects } from "@/lib/firebase/projects";

const mockedGetProjects = getProjects as jest.MockedFunction<
  typeof getProjects
>;

describe("Projects section", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders 3 projects correctly from Firestore data", async () => {
    mockedGetProjects.mockResolvedValue(mockProjects);

    render(<Projects />);

    await waitFor(() => {
      expect(screen.getByText("Project Alpha")).toBeInTheDocument();
      expect(screen.getByText("Project Beta")).toBeInTheDocument();
      expect(screen.getByText("Project Gamma")).toBeInTheDocument();
    });

    // Verify the grid exists with 3 view-details links
    const links = screen.getAllByText("View Details");
    expect(links).toHaveLength(3);
  });

  it('shows "No projects added yet." when Firestore returns empty array', async () => {
    mockedGetProjects.mockResolvedValue([]);

    render(<Projects />);

    await waitFor(() => {
      expect(
        screen.getByText("No projects added yet.")
      ).toBeInTheDocument();
    });
  });

  it("clicking View Details navigates to /projects/[slug]", async () => {
    mockedGetProjects.mockResolvedValue(mockProjects);

    render(<Projects />);

    await waitFor(() => {
      expect(screen.getByText("Project Alpha")).toBeInTheDocument();
    });

    const links = screen.getAllByText("View Details");
    expect(links[0].closest("a")).toHaveAttribute(
      "href",
      "/projects/project-alpha"
    );
    expect(links[1].closest("a")).toHaveAttribute(
      "href",
      "/projects/project-beta"
    );
    expect(links[2].closest("a")).toHaveAttribute(
      "href",
      "/projects/project-gamma"
    );
  });
});
