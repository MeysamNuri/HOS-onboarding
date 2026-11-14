import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import OrderStatusTag from "./OrderStatusTag";
import { statusMap } from "../types";

describe("OrderStatusTag", () => {
  it.each(Object.entries(statusMap))("uses the shared desktop style for %s", (status, entry) => {
    render(<OrderStatusTag status={status} isSuccessPayment />);
    expect(screen.getByText(entry.text)).toHaveClass("order-status-tag", entry.className);
  });

  it("uses failed-payment text and color even when status is Active", () => {
    render(<OrderStatusTag status="Active" isSuccessPayment={false} />);
    expect(screen.getByText("پرداخت ناموفق")).toHaveClass("PaymentFailed");
  });

  it.each(["", "Unknown", "toString"])("does not crash for unsupported status %s", (status) => {
    render(<OrderStatusTag status={status} isSuccessPayment />);
    expect(screen.getByText("نامشخص")).toBeInTheDocument();
  });
});
