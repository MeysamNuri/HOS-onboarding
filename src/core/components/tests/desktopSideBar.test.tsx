import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import Sidebar from "../desktopSideBar";

vi.mock("lottie-react", () => ({ default: () => null }));
vi.mock("../chooseSerialModal", () => ({ default: () => null }));
vi.mock("../customModal", () => ({ default: () => null }));

const renderSidebar = (isDesktop = false) => {
    const onToggle = vi.fn();
    const result = render(
        <MemoryRouter>
            <Sidebar
                collapsed={false}
                onToggle={onToggle}
                handleChooseSerialModal={vi.fn()}
                hanleCloseSerialModal={vi.fn()}
                handleExit={vi.fn().mockResolvedValue(undefined)}
                userName=""
                openChooseSerialModal={false}
                isLogin={false}
                serial=""
                setSelected={vi.fn()}
                selected="home"
                isDesktop={isDesktop}
            />
        </MemoryRouter>,
    );
    return {
        ...result,
        onToggle,
        sidebar: result.container.querySelector<HTMLElement>(".sidebar")!,
        header: result.container.querySelector<HTMLElement>(".sidebar__header")!,
    };
};

describe("mobile sidebar header background", () => {
    it("has no scrolled background initially", () => {
        const { header } = renderSidebar();
        expect(header).not.toHaveClass("sidebar__header--scrolled");
    });

    it("adds the background only after scrolling the sidebar", () => {
        const { sidebar, header } = renderSidebar();
        fireEvent.scroll(window);
        expect(header).not.toHaveClass("sidebar__header--scrolled");
        fireEvent.scroll(sidebar, { target: { scrollTop: 60 } });
        expect(header).toHaveClass("sidebar__header--scrolled");
    });

    it("removes the background when returning to the top, including overscroll", () => {
        const { sidebar, header } = renderSidebar();
        fireEvent.scroll(sidebar, { target: { scrollTop: 60 } });
        fireEvent.scroll(sidebar, { target: { scrollTop: 0 } });
        expect(header).not.toHaveClass("sidebar__header--scrolled");
        fireEvent.scroll(sidebar, { target: { scrollTop: -10 } });
        expect(header).not.toHaveClass("sidebar__header--scrolled");
    });

    it("leaves the desktop header unchanged", () => {
        const { sidebar, header } = renderSidebar(true);
        fireEvent.scroll(sidebar, { target: { scrollTop: 60 } });
        expect(header).not.toHaveClass("sidebar__header--scrolled");
    });

    it("keeps the close button working after scrolling", () => {
        const { sidebar, onToggle } = renderSidebar();
        fireEvent.scroll(sidebar, { target: { scrollTop: 60 } });
        fireEvent.click(screen.getByRole("button", { name: "بستن منو" }));
        expect(onToggle).toHaveBeenCalledOnce();
    });
});
