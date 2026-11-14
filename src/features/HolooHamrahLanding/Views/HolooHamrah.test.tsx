import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HolooHamrahRoutes } from "../routes";
import HolooHamrah from ".";
import json from "@/core/constants/config.json";
import checkbook from "@core/assets/icons/checkbook.png";
import checkbookWhite from "@core/assets/icons/checkboo-white.png";
import { Provider } from "react-redux";
import { store } from "@/core/constants/store";

vi.mock("lottie-react", () => ({ default: () => null }));
const catalog = vi.hoisted(() => ({ query: vi.fn(), plan: { code: "simple", name: "بستهٔ هلو همراه", duration: 45, lable: "بسته پایه با ۴۵ روز اعتبار", salesPrice: 0, featureList: [] } }));
vi.mock("@/core/components/hooks/useSimpleServicePacket", () => ({ default: catalog.query }));

const renderLanding = () => render(<Provider store={store}><MemoryRouter><HolooHamrah /></MemoryRouter></Provider>);

describe("HolooHamrah", () => {
  beforeEach(() => {
    catalog.query.mockReturnValue({ selectedPlan: catalog.plan, isLoading: false, refetch: vi.fn() });
    vi.mocked(localStorage.getItem).mockReturnValue(null);
    vi.mocked(localStorage.setItem).mockClear();
  });
  afterEach(() => {
    cleanup();
  });

  it("disables activation while package information is loading", () => {
    catalog.query.mockReturnValue({ selectedPlan: undefined, isLoading: true, refetch: vi.fn() });
    renderLanding();
    expect(screen.getByRole("button", { name: "فعال‌سازی بسته" })).toBeDisabled();
    expect(screen.queryByText("رایگان")).not.toBeInTheDocument();
  });

  it("does not offer a fabricated package when simple is missing", () => {
    catalog.query.mockReturnValue({ selectedPlan: undefined, isLoading: false, refetch: vi.fn() });
    renderLanding();
    expect(screen.getByRole("button", { name: "فعال‌سازی بسته" })).toBeDisabled();
    expect(screen.getByText("بستهٔ پایه در دسترس نیست.")).toBeInTheDocument();
  });

  it("shows the download action only in the installation card", () => {
    const { container } = renderLanding();
    const download = screen.getByRole("link", { name: "دانلود هلو همراه" });
    expect(download).toHaveAttribute("href", "https://portfolio.invalid/hos/HolooHamrah-Production-1.1.1196.exe");
    expect(container.querySelector(".hamrah-step")).toContainElement(download);
    expect(container.querySelectorAll(".hamrah-step .hamrah-button")).toHaveLength(1);
  });


  it("registers the standalone landing route", () => {
    expect(HolooHamrahRoutes[0]).toMatchObject({ path: "/holoo-hamrah", Component: HolooHamrah });
  });

  it("renders the reference sections and existing service destinations", () => {
    renderLanding();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("کسب‌وکارتان، همیشه همراهتان");
    expect(screen.getByRole("heading", { name: "بستهٔ هلو همراه" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "فعال‌سازی بسته" })).toBeInTheDocument();
    expect(catalog.query).toHaveBeenCalledWith("BI");
    expect(screen.getByText(catalog.plan.lable)).toBeInTheDocument();
    expect(screen.getByText("رایگان")).toBeInTheDocument();
    // expect(screen.getAllByRole("link", { name: "راهنمای راه‌اندازی" })[0]).toHaveAttribute("href", "/BI-guide");
    expect(screen.getByRole("link", { name: "تماس با پشتیبانی" })).toHaveAttribute("href", "/support");
  });

  it("animates the decorative spark along the hero line", () => {
    const { container } = renderLanding();
    const orbit = container.querySelector(".hamrah-hero__orbit");
    expect(orbit).toHaveAttribute("aria-hidden", "true");
    const path = orbit?.querySelector("path");
    expect(orbit?.querySelector("use")).toHaveAttribute("href", "#" + path?.id);
    expect(orbit?.querySelector("mpath")).toHaveAttribute("href", "#" + path?.id);
    expect(orbit?.querySelector("animateMotion")).toHaveAttribute("repeatCount", "indefinite");
    expect(orbit?.querySelector("animateMotion")).toHaveAttribute("rotate", "auto");
    expect(orbit?.querySelector("animateMotion")).toHaveAttribute("calcMode", "linear");
    expect(orbit?.querySelector("animateMotion")).toHaveAttribute("keyPoints", "0;1;0");
    expect(orbit?.querySelector("animateMotion")).toHaveAttribute("keyTimes", "0;0.5;1");
    expect(orbit?.querySelector("animateMotion")).toHaveAttribute("dur", "14s");
    expect(orbit?.querySelector("ellipse")).toHaveAttribute("rx", "24");
    expect(orbit?.querySelector("ellipse")).toHaveAttribute("ry", "5");
  });

  it("switches themes, updates the illustration, and remembers the choice", () => {
    const { container } = renderLanding();
    const illustration = screen.getByAltText("داشبورد هلو همراه در حالت روشن و تیره روی گوشی");
    const lightSource = illustration.getAttribute("src");
    const checksIcon = container.querySelector(".hamrah-feature--checks img");
    expect(checksIcon).toHaveAttribute("src", checkbook);
    fireEvent.click(screen.getByRole("button", { name: "تم تیره" }));
    expect(checksIcon).toHaveAttribute("src", checkbookWhite);
    expect(container.firstChild).toHaveClass("holoo-hamrah--dark");
    expect(illustration.getAttribute("src")).not.toBe(lightSource);
    expect(localStorage.setItem).toHaveBeenLastCalledWith("holoo-hamrah-theme", "dark");
    expect(screen.getByRole("button", { name: "تم تیره" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "تم روشن" }));
    expect(container.firstChild).toHaveClass("holoo-hamrah--light");
    expect(checksIcon).toHaveAttribute("src", checkbook);
  });

  it("restores a saved dark theme", () => {
    vi.mocked(localStorage.getItem).mockImplementation((key) => key === "holoo-hamrah-theme" ? "dark" : null);
    const { container } = renderLanding();
    expect(container.firstChild).toHaveClass("holoo-hamrah--dark");
  });

  it("works when browser storage is unavailable", () => {
    vi.mocked(localStorage.getItem).mockImplementationOnce(() => { throw new Error("Storage unavailable"); });
    vi.mocked(localStorage.setItem).mockImplementationOnce(() => { throw new Error("Storage unavailable"); });
    const { container } = renderLanding();
    expect(container.firstChild).toHaveClass("holoo-hamrah--light");
  });

  it("redirects to the configured dashboard demo", () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    const { container } = renderLanding();
    fireEvent.click(container.querySelector(".hamrah-hero__actions .hamrah-button")!);
    expect(open).toHaveBeenCalledWith(json.demoHolooHamrah, "_self");
    open.mockRestore();
  });
});
