import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SkillForm from "../SkillForm";

describe("SkillForm component", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all form fields", () => {
    render(
      <SkillForm onSubmit={mockOnSubmit} submitLabel="Create Skill" submitting={false} />,
    );

    expect(screen.getByLabelText(/skill name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/display order/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create skill/i })).toBeInTheDocument();
  });

  it("populates fields with defaultValues", () => {
    render(
      <SkillForm
        defaultValues={{ name: "TypeScript", category: "Languages", order: "2" }}
        onSubmit={mockOnSubmit}
        submitLabel="Save Changes"
        submitting={false}
      />,
    );

    expect(screen.getByLabelText(/skill name/i)).toHaveValue("TypeScript");
    expect(screen.getByLabelText(/category/i)).toHaveValue("Languages");
    expect(screen.getByLabelText(/display order/i)).toHaveValue(2);
  });

  it("shows validation errors when submitting empty required fields", async () => {
    render(
      <SkillForm onSubmit={mockOnSubmit} submitLabel="Create Skill" submitting={false} />,
    );

    fireEvent.click(screen.getByRole("button", { name: /create skill/i }));

    await waitFor(() => {
      expect(screen.getByText(/skill name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/category is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit with correct values when form is valid", async () => {
    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <SkillForm onSubmit={mockOnSubmit} submitLabel="Create Skill" submitting={false} />,
    );

    fireEvent.change(screen.getByLabelText(/skill name/i), {
      target: { value: "React" },
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: "Frameworks" },
    });
    fireEvent.change(screen.getByLabelText(/display order/i), {
      target: { value: "3" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create skill/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          name: "React",
          category: "Frameworks",
          order: "3",
        }),
      );
    });
  });

  it("disables inputs and submit button when submitting", () => {
    render(
      <SkillForm onSubmit={mockOnSubmit} submitLabel="Save Changes" submitting={true} />,
    );

    expect(screen.getByLabelText(/skill name/i)).toBeDisabled();
    expect(screen.getByLabelText(/category/i)).toBeDisabled();
    expect(screen.getByLabelText(/display order/i)).toBeDisabled();
    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
  });
});
