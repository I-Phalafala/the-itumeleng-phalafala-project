import { render, screen, waitFor } from "@testing-library/react";
import ProjectDetailPage from "../page";
import { Project } from "@/types/project";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    main: (props: any) => <main className={props.className}>{props.children}</main>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    div: (props: any) => <div className={props.className}>{props.children}</div>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h1: (props: any) => <h1 className={props.className}>{props.children}</h1>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    p: (props: any) => <p className={props.className}>{props.children}</p>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    section: (props: any) => <section className={props.className}>{props.children}</section>,
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

// Mock next/navigation
const mockNotFound = jest.fn();
jest.mock("next/navigation", () => ({
  useParams: () => ({ slug: "test-project" }),
  notFound: (...args: unknown[]) => {
    mockNotFound(...args);
  },
}));

// Mock the firebase projects module
jest.mock("@/lib/firebase/projects", () => ({
  getProjectBySlug: jest.fn(),
}));

import { getProjectBySlug } from "@/lib/firebase/projects";

const mockedGetProjectBySlug = getProjectBySlug as jest.MockedFunction<
  typeof getProjectBySlug
>;

const fullProject: Project = {
  id: "1",
  title: "Test Project",
  slug: "test-project",
  description: "A test project description",
  thumbnailUrl: "https://example.com/thumb.png",
  tags: ["React", "TypeScript"],
  problemStatement: "Users struggled with complex workflows.",
  solution: "We built an intuitive dashboard that simplifies task management.",
  techStack: ["React", "Node.js", "Firebase"],
  role: "Lead Frontend Developer",
  testingApproach: "Used Jest and Cypress for unit and E2E testing.",
  screenshots: [
    "https://example.com/screenshot1.png",
    "https://example.com/screenshot2.png",
  ],
};

describe("ProjectDetailPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all project detail sections with data", async () => {
    mockedGetProjectBySlug.mockResolvedValue(fullProject);

    render(<ProjectDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("Test Project")).toBeInTheDocument();
    });

    // Description
    expect(screen.getByText("A test project description")).toBeInTheDocument();

    // Tags (React appears in both tags and tech stack, so use getAllByText)
    expect(screen.getAllByText("React").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("TypeScript")).toBeInTheDocument();

    // Problem Statement section
    expect(screen.getByText("Problem Statement")).toBeInTheDocument();
    expect(
      screen.getByText("Users struggled with complex workflows.")
    ).toBeInTheDocument();

    // Solution section
    expect(screen.getByText("Solution")).toBeInTheDocument();
    expect(
      screen.getByText(
        "We built an intuitive dashboard that simplifies task management."
      )
    ).toBeInTheDocument();

    // Tech Stack section
    expect(screen.getByText("Tech Stack")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
    expect(screen.getByText("Firebase")).toBeInTheDocument();

    // My Role section
    expect(screen.getByText("My Role")).toBeInTheDocument();
    expect(
      screen.getByText("Lead Frontend Developer")
    ).toBeInTheDocument();

    // Testing Approach section
    expect(screen.getByText("Testing Approach")).toBeInTheDocument();
    expect(
      screen.getByText("Used Jest and Cypress for unit and E2E testing.")
    ).toBeInTheDocument();
  });

  it("renders screenshots from Firebase Storage URLs", async () => {
    mockedGetProjectBySlug.mockResolvedValue(fullProject);

    render(<ProjectDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("Test Project")).toBeInTheDocument();
    });

    expect(screen.getByText("Screenshots")).toBeInTheDocument();

    const screenshot1 = screen.getByAltText("Test Project screenshot 1");
    expect(screenshot1).toHaveAttribute(
      "src",
      "https://example.com/screenshot1.png"
    );

    const screenshot2 = screen.getByAltText("Test Project screenshot 2");
    expect(screenshot2).toHaveAttribute(
      "src",
      "https://example.com/screenshot2.png"
    );
  });

  it("hides image section gracefully when project has no screenshots", async () => {
    const projectWithoutScreenshots: Project = {
      ...fullProject,
      screenshots: [],
    };
    mockedGetProjectBySlug.mockResolvedValue(projectWithoutScreenshots);

    render(<ProjectDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("Test Project")).toBeInTheDocument();
    });

    expect(screen.queryByText("Screenshots")).not.toBeInTheDocument();
  });

  it("hides screenshots section when field is undefined", async () => {
    const projectNoScreenshotField: Project = {
      ...fullProject,
      screenshots: undefined,
    };
    mockedGetProjectBySlug.mockResolvedValue(projectNoScreenshotField);

    render(<ProjectDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("Test Project")).toBeInTheDocument();
    });

    expect(screen.queryByText("Screenshots")).not.toBeInTheDocument();
  });

  it("does not break layout with very long solution text", async () => {
    const longSolution = "A".repeat(5000);
    const projectWithLongSolution: Project = {
      ...fullProject,
      solution: longSolution,
    };
    mockedGetProjectBySlug.mockResolvedValue(projectWithLongSolution);

    render(<ProjectDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("Test Project")).toBeInTheDocument();
    });

    const solutionText = screen.getByText(longSolution);
    expect(solutionText).toBeInTheDocument();
    expect(solutionText).toHaveClass("break-words");
  });

  it("renders Back to Projects navigation link", async () => {
    mockedGetProjectBySlug.mockResolvedValue(fullProject);

    render(<ProjectDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("Test Project")).toBeInTheDocument();
    });

    const backLinks = screen.getAllByText("Back to Projects");
    expect(backLinks.length).toBeGreaterThanOrEqual(1);
    const link = backLinks[0].closest("a");
    expect(link).toHaveAttribute("href", "/#projects");
  });

  it("calls notFound() when project is not found", async () => {
    mockedGetProjectBySlug.mockResolvedValue(null);

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(<ProjectDetailPage />);

    await waitFor(() => {
      expect(mockNotFound).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it("renders thumbnail image when thumbnailUrl is provided", async () => {
    mockedGetProjectBySlug.mockResolvedValue(fullProject);

    render(<ProjectDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("Test Project")).toBeInTheDocument();
    });

    const img = screen.getByAltText("Test Project");
    expect(img).toHaveAttribute("src", "https://example.com/thumb.png");
  });

  it("renders placeholder when thumbnailUrl is missing", async () => {
    const noThumbProject: Project = {
      ...fullProject,
      thumbnailUrl: undefined,
    };
    mockedGetProjectBySlug.mockResolvedValue(noThumbProject);

    render(<ProjectDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("Test Project")).toBeInTheDocument();
    });

    // Thumbnail img should not exist (only screenshots)
    expect(screen.queryByAltText("Test Project")).not.toBeInTheDocument();
    // Placeholder SVG should be rendered
    expect(screen.getByTestId("thumbnail-placeholder")).toBeInTheDocument();
  });

  it("hides optional sections when data is not provided", async () => {
    const minimalProject: Project = {
      id: "2",
      title: "Minimal Project",
      slug: "test-project",
      description: "A minimal project",
      tags: [],
    };
    mockedGetProjectBySlug.mockResolvedValue(minimalProject);

    render(<ProjectDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("Minimal Project")).toBeInTheDocument();
    });

    expect(screen.queryByText("Problem Statement")).not.toBeInTheDocument();
    expect(screen.queryByText("Solution")).not.toBeInTheDocument();
    expect(screen.queryByText("Tech Stack")).not.toBeInTheDocument();
    expect(screen.queryByText("My Role")).not.toBeInTheDocument();
    expect(screen.queryByText("Testing Approach")).not.toBeInTheDocument();
    expect(screen.queryByText("Screenshots")).not.toBeInTheDocument();
  });
});
