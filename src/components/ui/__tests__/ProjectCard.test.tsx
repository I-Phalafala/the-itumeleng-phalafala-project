import { render, screen } from "@testing-library/react";
import ProjectCard from "../ProjectCard";
import { Project } from "@/types/project";

// Mock framer-motion to render plain divs
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

const baseProject: Project = {
  id: "1",
  title: "Test Project",
  slug: "test-project",
  description: "A short project description",
  thumbnailUrl: "https://example.com/img.png",
  tags: ["React", "TypeScript"],
};

describe("ProjectCard", () => {
  it("renders title, description, tags, image, and View Details link", () => {
    render(<ProjectCard project={baseProject} />);

    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(
      screen.getByText("A short project description")
    ).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByAltText("Test Project")).toBeInTheDocument();

    const link = screen.getByText("View Details").closest("a");
    expect(link).toHaveAttribute("href", "/projects/test-project");
  });

  it("renders placeholder when thumbnailUrl is missing", () => {
    const noImageProject: Project = {
      ...baseProject,
      thumbnailUrl: undefined,
    };
    render(<ProjectCard project={noImageProject} />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    // Placeholder SVG should be rendered
    expect(screen.getByTestId("thumbnail-placeholder")).toBeInTheDocument();
  });

  it("truncates long titles without overflow", () => {
    const longTitleProject: Project = {
      ...baseProject,
      title:
        "This Is An Extremely Long Project Title That Should Be Truncated By CSS",
    };
    render(<ProjectCard project={longTitleProject} />);
    const heading = screen.getByText(longTitleProject.title);
    expect(heading).toHaveClass("truncate");
  });
});
