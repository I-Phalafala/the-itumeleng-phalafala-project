import type { ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Education from "../Education";

jest.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    div: (props: any) => <div className={props.className}>{props.children}</div>,
  },
}));

describe("Education section", () => {
  it("shows education content by default and switches to certifications when toggled", () => {
    render(<Education />);

    expect(screen.getByRole("button", { name: "Education" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(screen.getByText(/coursework:/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Certifications" }));

    expect(screen.getByRole("button", { name: "Certifications" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(screen.queryByText(/coursework:/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Certifications" }));

    expect(screen.getByRole("button", { name: "Certifications" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });
});
