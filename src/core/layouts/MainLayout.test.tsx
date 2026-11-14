import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import MainLayout from "./MainLayout";

const sidebarState = vi.hoisted(() => ({
    isDesktop: false,
    handleCollapseSideBar: vi.fn(),
}));

vi.mock("../components/hooks/sideBarHooks", () => ({
    default: () => ({
        ...sidebarState,
        collapsed: false,
        setCollapsed: vi.fn(),
    }),
}));

vi.mock("../components/NavbarHeader", () => ({
    default: ({ onMenuClick }: { onMenuClick: () => void }) => (
        <button onClick={onMenuClick}>Open menu</button>
    ),
}));

vi.mock("../components/desktopSideBar", () => ({
    default: ({ onToggle }: { onToggle: () => void }) => (
        <div className="sidebar">
            <button onClick={onToggle}>Toggle sidebar</button>
        </div>
    ),
}));

vi.mock("react-router-dom", () => ({
    Outlet: () => <button>Page content</button>,
}));

describe("mobile sidebar background isolation", () => {
    beforeEach(() => {
        sidebarState.isDesktop = false;
        vi.spyOn(window, "scrollTo").mockImplementation(() => {});
        vi.spyOn(window, "scrollX", "get").mockReturnValue(0);
        vi.spyOn(window, "scrollY", "get").mockReturnValue(180);
    });

    afterEach(() => {
        cleanup();
        document.body.removeAttribute("style");
        document.documentElement.removeAttribute("style");
        vi.restoreAllMocks();
        vi.clearAllMocks();
    });

    it("does not lock the page while the mobile sidebar is closed", () => {
        const { container } = render(<MainLayout />);
        expect(document.body.style.position).toBe("");
        expect(container.querySelector(".app-layout__content-layout")).not.toHaveAttribute("inert");
        expect(container.querySelector(".app-layout__mobile-overlay")).toBeNull();
    });

    it("locks the viewport and makes only the background inert while open", () => {
        const { container } = render(<MainLayout />);
        fireEvent.click(screen.getByText("Open menu"));
        expect(document.documentElement.style.overflow).toBe("hidden");
        expect(document.documentElement.style.overscrollBehavior).toBe("none");
        expect(document.body).toHaveStyle({ position: "fixed", top: "-180px", width: "100%" });
        expect(container.querySelector(".app-layout")).toHaveClass("app-layout--mobile-sidebar-open");
        expect(container.querySelector(".app-layout__content-layout")).toHaveAttribute("inert");
        expect(container.querySelector(".sidebar")?.closest("[inert]")).toBeNull();
        expect(container.querySelector(".app-layout__mobile-overlay")).toBeInTheDocument();
    });

    it("closes from the overlay and restores both page and content scroll positions", () => {
        const { container } = render(<MainLayout />);
        const content = container.querySelector<HTMLElement>(".app-layout__content")!;
        content.scrollTop = 240;
        fireEvent.click(screen.getByText("Open menu"));
        fireEvent.click(container.querySelector(".app-layout__mobile-overlay")!);
        expect(document.body.style.position).toBe("");
        expect(document.documentElement.style.overflow).toBe("");
        expect(container.querySelector(".app-layout__content-layout")).not.toHaveAttribute("inert");
        expect(content.scrollTop).toBe(240);
        expect(window.scrollTo).toHaveBeenCalledWith({ left: 0, top: 180, behavior: "instant" });
    });

    it("closes from the sidebar button without leaving a scroll lock", () => {
        const { container } = render(<MainLayout />);
        fireEvent.click(screen.getByText("Open menu"));
        fireEvent.click(screen.getByText("Toggle sidebar"));
        expect(document.body.style.position).toBe("");
        expect(container.querySelector(".app-layout")).not.toHaveClass("app-layout--mobile-sidebar-open");
        expect(container.querySelector(".app-layout__mobile-overlay")).toBeNull();
    });

    it("restores original inline styles and priorities when unmounted", () => {
        document.body.style.position = "relative";
        document.body.style.top = "8px";
        document.body.style.setProperty("width", "95%", "important");
        document.body.style.color = "red";
        document.documentElement.style.overflow = "auto";
        const { unmount } = render(<MainLayout />);
        fireEvent.click(screen.getByText("Open menu"));
        unmount();
        expect(document.body).toHaveStyle({ position: "relative", top: "8px", width: "95%", color: "rgb(255, 0, 0)" });
        expect(document.documentElement.style.overflow).toBe("auto");
        expect(document.body.style.getPropertyPriority("width")).toBe("important");
        expect(document.body.style.left).toBe("");
        expect(document.documentElement.style.overscrollBehavior).toBe("");
    });

    it("unlocks the background when resizing to desktop", () => {
        const { container, rerender } = render(<MainLayout />);
        fireEvent.click(screen.getByText("Open menu"));
        sidebarState.isDesktop = true;
        rerender(<MainLayout />);
        expect(document.body.style.position).toBe("");
        expect(container.querySelector(".app-layout__content-layout")).not.toHaveAttribute("inert");
        expect(container.querySelector(".app-layout__mobile-overlay")).toBeNull();
    });

    it("keeps the existing desktop collapse behavior without locking the page", () => {
        sidebarState.isDesktop = true;
        const { container } = render(<MainLayout />);
        fireEvent.click(screen.getByText("Toggle sidebar"));
        expect(sidebarState.handleCollapseSideBar).toHaveBeenCalledOnce();
        expect(document.body.style.position).toBe("");
        expect(container.querySelector(".app-layout__content-layout")).not.toHaveAttribute("inert");
    });
});
