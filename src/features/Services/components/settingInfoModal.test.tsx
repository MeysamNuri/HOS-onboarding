import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import StoreInfo from "./settingInfoModal";

// --------------------
// Mocks
// --------------------

// Mock antd
vi.mock("antd", () => ({
  Typography: {
    Title: ({ children }: any) => <h5>{children}</h5>,
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

// --------------------
// Tests
// --------------------

describe("StoreInfo Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders main title correctly", () => {
    render(<StoreInfo />);

    expect(screen.getByText("اطلاعات کسب و کار")).toBeInTheDocument();
  });

  it("renders all section titles", () => {
    render(<StoreInfo />);

    expect(screen.getByText("نام فروشگاه")).toBeInTheDocument();
    expect(screen.getByText("شعار فروشگاه")).toBeInTheDocument();
    expect(screen.getByText("پاورقی")).toBeInTheDocument();
  });

  it("renders all section descriptions", () => {
    render(<StoreInfo />);

    expect(
      screen.getByText("تعیین نام فروشگاه جهت نمایش به مشتری")
    ).toBeInTheDocument();

    expect(
      screen.getByText("شعار تبلیغاتی فروشگاه، قابل نمایش به مشتری")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "ثبت اطلاعات دلخواه مثل شماره کارت، جهت نمایش در پاورقی فاکتور"
      )
    ).toBeInTheDocument();
  });



  it("does not crash if onCancel is not provided", () => {
    render(<StoreInfo />);


    // no error should occur
    expect(screen.getByText("اطلاعات کسب و کار")).toBeInTheDocument();
  });
});