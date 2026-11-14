import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import BottomModal from "../customModal";

describe("BottomModal", () => {
  beforeEach(() => {
    document.body.style.overflow = "auto";
  });

  it("does not render when open is false", () => {
    const { container } = render(
      <BottomModal open={false} onClose={vi.fn()}>
        Test Content
      </BottomModal>
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders children when open is true", () => {
    render(
      <BottomModal open={true} onClose={vi.fn()}>
        Test Content
      </BottomModal>
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("enables content-sized mobile sheets only when requested", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 390,
    });

    const { rerender } = render(
      <BottomModal open={true} onClose={vi.fn()} fitContent>
        Filters
      </BottomModal>
    );

    const modal = document.querySelector(".bottom-modal");
    expect(modal).toHaveClass("bottom-modal--fit-content");
    expect(modal).toHaveStyle("height: auto");

    rerender(
      <BottomModal open={true} onClose={vi.fn()}>
        Filters
      </BottomModal>
    );

    expect(modal).not.toHaveClass("bottom-modal--fit-content");
  });

  it("opts into content-sized height without changing other modals", () => {
    const { rerender } = render(
      <BottomModal open={true} onClose={vi.fn()} fitContent>
        Test Content
      </BottomModal>
    );

    expect(document.querySelector(".bottom-modal")).toHaveClass("bottom-modal--fit-content");
    expect(document.querySelector(".bottom-modal")).toHaveStyle("height: auto");

    rerender(
      <BottomModal open={true} onClose={vi.fn()}>
        Test Content
      </BottomModal>
    );

    expect(document.querySelector(".bottom-modal")).not.toHaveClass("bottom-modal--fit-content");
  });

  it("renders the modal portal directly under document body", () => {
    const { container } = render(
      <div className="sidebar">
        <BottomModal open={true} onClose={vi.fn()}>
          Test Content
        </BottomModal>
      </div>
    );

    const backdrop = document.querySelector(".bottom-modal__backdrop");

    expect(backdrop?.parentElement).toBe(document.body);
    expect(container.querySelector(".bottom-modal__backdrop")).toBeNull();
  });

  it("calls onClose when clicking backdrop", () => {
    const onClose = vi.fn();

    render(
      <BottomModal open={true} onClose={onClose}>
        Test Content
      </BottomModal>
    );

    const backdrop = document.querySelector(".bottom-modal__backdrop");
    fireEvent.click(backdrop!);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does NOT call onClose when clicking inside modal", () => {
    const onClose = vi.fn();

    render(
      <BottomModal open={true} onClose={onClose}>
        Test Content
      </BottomModal>
    );

    const modal = document.querySelector(".bottom-modal");
    fireEvent.click(modal!);

    expect(onClose).not.toHaveBeenCalled();
  });

  it("does NOT call onClose when clicking a popup rendered in the backdrop", () => {
    const onClose = vi.fn();

    render(
      <BottomModal open={true} onClose={onClose}>
        Test Content
      </BottomModal>
    );

    const backdrop = document.querySelector(".bottom-modal__backdrop")!;
    const popup = document.createElement("div");
    backdrop.appendChild(popup);

    fireEvent.click(popup);

    expect(onClose).not.toHaveBeenCalled();
  });

  it("locks body scroll when open", () => {
    render(
      <BottomModal open={true} onClose={vi.fn()}>
        Test Content
      </BottomModal>
    );

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores body scroll when unmounted", () => {
    const { unmount } = render(
      <BottomModal open={true} onClose={vi.fn()}>
        Test Content
      </BottomModal>
    );

    unmount();
    expect(document.body.style.overflow).toBe("auto");
  });

  it("sets height to 100vh on mobile when height prop exists", () => {
    // simulate mobile screen
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 500,
    });

    window.dispatchEvent(new Event("resize"));

    render(
      <BottomModal open={true} onClose={vi.fn()} height="50vh">
        Test Content
      </BottomModal>
    );

    const modal = document.querySelector(".bottom-modal") as HTMLElement;

    expect(modal).toHaveStyle("height: 100vh");
  });
});
