import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ImageUpload from "../ImageUpload";

// Mock next/image to render a plain <img>
jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock the storage service
jest.mock("@/lib/firebase/services/storage", () => ({
  uploadImage: jest.fn(),
  deleteImage: jest.fn(),
}));

import { uploadImage, deleteImage } from "@/lib/firebase/services/storage";

const mockedUploadImage = uploadImage as jest.MockedFunction<typeof uploadImage>;
const mockedDeleteImage = deleteImage as jest.MockedFunction<typeof deleteImage>;

function createMockFile(name: string, size: number, type: string): File {
  const content = new ArrayBuffer(size);
  return new File([content], name, { type });
}

describe("ImageUpload component", () => {
  const defaultProps = {
    storagePath: "projects",
    onUploadComplete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders upload area with instructions", () => {
    render(<ImageUpload {...defaultProps} />);

    expect(screen.getByText("Click to upload an image")).toBeInTheDocument();
    expect(screen.getByText(/JPEG, PNG or WebP/)).toBeInTheDocument();
  });

  it("shows preview when currentImageUrl is provided", () => {
    render(
      <ImageUpload
        {...defaultProps}
        currentImageUrl="https://firebasestorage.googleapis.com/existing.jpg"
      />,
    );

    const img = screen.getByAltText("Upload preview");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://firebasestorage.googleapis.com/existing.jpg");
  });

  it("uploads file and shows preview on success", async () => {
    mockedUploadImage.mockResolvedValue({
      success: true,
      data: "https://firebasestorage.googleapis.com/new-photo.jpg",
    });

    render(<ImageUpload {...defaultProps} />);

    const file = createMockFile("photo.jpg", 1024, "image/jpeg");
    const input = screen.getByTestId("file-input");

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(defaultProps.onUploadComplete).toHaveBeenCalledWith(
        "https://firebasestorage.googleapis.com/new-photo.jpg",
      );
    });

    const img = screen.getByAltText("Upload preview");
    expect(img).toHaveAttribute("src", "https://firebasestorage.googleapis.com/new-photo.jpg");
  });

  it("displays error message on upload failure", async () => {
    mockedUploadImage.mockResolvedValue({
      success: false,
      error: "Invalid file type. Allowed types: JPEG, PNG, WebP",
    });

    const onError = jest.fn();
    render(<ImageUpload {...defaultProps} onError={onError} />);

    const file = createMockFile("document.pdf", 1024, "application/pdf");
    const input = screen.getByTestId("file-input");

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Invalid file type. Allowed types: JPEG, PNG, WebP",
      );
    });

    expect(onError).toHaveBeenCalledWith("Invalid file type. Allowed types: JPEG, PNG, WebP");
  });

  it("deletes old image after successfully uploading a new one", async () => {
    mockedUploadImage.mockResolvedValue({
      success: true,
      data: "https://firebasestorage.googleapis.com/new-photo.jpg",
    });
    mockedDeleteImage.mockResolvedValue({ success: true, data: undefined });

    render(
      <ImageUpload
        {...defaultProps}
        currentImageUrl="https://firebasestorage.googleapis.com/old-photo.jpg"
      />,
    );

    const file = createMockFile("new-photo.jpg", 1024, "image/jpeg");
    const input = screen.getByTestId("file-input");

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(defaultProps.onUploadComplete).toHaveBeenCalledWith(
        "https://firebasestorage.googleapis.com/new-photo.jpg",
      );
    });

    expect(mockedDeleteImage).toHaveBeenCalledWith(
      "https://firebasestorage.googleapis.com/old-photo.jpg",
    );
  });

  it("disables input while uploading", async () => {
    // Make upload hang to test disabled state
    mockedUploadImage.mockImplementation(
      () => new Promise(() => {}), // never resolves
    );

    render(<ImageUpload {...defaultProps} />);

    const file = createMockFile("photo.jpg", 1024, "image/jpeg");
    const input = screen.getByTestId("file-input");

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(input).toBeDisabled();
      expect(screen.getByText("Uploading…")).toBeInTheDocument();
    });
  });
});
