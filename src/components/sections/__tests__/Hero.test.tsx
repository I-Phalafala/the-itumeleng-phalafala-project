import { render, screen } from "@testing-library/react";
import Hero from "../Hero";

jest.mock("framer-motion", () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    section: (props: any) => <section className={props.className}>{props.children}</section>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    div: (props: any) => <div className={props.className}>{props.children}</div>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    p: (props: any) => <p className={props.className}>{props.children}</p>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h1: (props: any) => <h1 className={props.className}>{props.children}</h1>,
  },
  useReducedMotion: () => true,
}));

describe("Hero section", () => {
  it("renders visible cyberpunk system markers in the hero panel", () => {
    render(<Hero />);

    expect(screen.getByText("System Online")).toBeInTheDocument();
    expect(screen.getByText("Precision QA")).toBeInTheDocument();
    expect(screen.getByText("Automation")).toBeInTheDocument();
    expect(screen.getByText("Delivery")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View My Work" })).toHaveAttribute(
      "href",
      "#projects"
    );
  });
});
