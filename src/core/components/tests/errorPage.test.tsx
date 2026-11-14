import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Errors from "../errorPage";

// --------------------
// Mocks
// --------------------

// Mock react-router
const mockNavigate = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock redux
const mockDispatch = vi.fn();

vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

// Mock slice action
vi.mock("@/features/HomePage/reducers/userPlansSlice", () => ({
  setUserPlansValue: vi.fn((payload) => ({
    type: "setUserPlansValue",
    payload,
  })),
}));

// Mock antd
vi.mock("antd", () => ({
  Button: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
  Typography: {
    Title: ({ children }: any) => <h4>{children}</h4>,
    Text: ({ children }: any) => <span>{children}</span>,
  },
}));

// Mock icon
vi.mock("@ant-design/icons", () => ({
  CloseOutlined: ({ onClick }: any) => (
    <span data-testid="close-icon" onClick={onClick}>
      X
    </span>
  ),
}));

// Mock image
vi.mock("@core/assets/images/invoice-error.svg", () => ({
  default: "test-image-path",
}));

// --------------------
// Tests
// --------------------

describe("Errors Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders default message when no messages prop is provided", () => {
    render(<Errors  />);

    expect(
      screen.getByText(
        "به دلیل عدم دریافت پاسخ از سرویس، عملیات انجام نشد. لطفا مجددا تلاش کنید"
      )
    ).toBeInTheDocument();
  });

  it("renders custom messages when provided", () => {
    const customMessage = "خطای سفارشی";

    render(<Errors messages={[customMessage]}  />);

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });



  it("navigates to /home, clears localStorage and dispatches reset when button is clicked", () => {
    localStorage.setItem("serviceCode", "SendInvoice");

    render(<Errors  />);

    fireEvent.click(screen.getByText("بازگشت"));


    expect(localStorage.getItem("serviceCode")).toBeUndefined();

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "setUserPlansValue",
      payload: {
        serviceCode: "",
        packetCode: "",
        serial: "",
        phoneNumber: "",
        agentCode:"",
        discountCode:""
      },
    });
  });

  it("renders default title when no title prop is provided", () => {
    render(<Errors />);

    expect(screen.getByText("اخطار")).toBeInTheDocument();
  });


  it("renders error image correctly", () => {
    render(<Errors  />);

    const img = screen.getByAltText("Invoice unSuccess");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "test-image-path");
  });
});