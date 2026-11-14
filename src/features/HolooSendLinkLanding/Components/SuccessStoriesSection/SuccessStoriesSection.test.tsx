import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import SuccessStoriesSection from ".";
import defaultGuildIcon from "@/core/assets/images/senf-codes/Default.png";
import guildIcon from "@/core/assets/images/senf-codes/212-1.png";

vi.mock("swiper/react", () => ({
  Swiper: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SwiperSlide: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

const consumer = {
  businessName: "فروشگاه سرویس", packet: "بسته حرفه‌ای", guildName: "پوشاک", guildCode: "10",
  firstName: "علی", lastName: "احمدی", sentCount: 1234, userExperience: "تجربه واقعی کاربر",
};

describe("SuccessStoriesSection", () => {
  it("uses the guild code as the icon filename, including suffixes", () => {
    render(<SuccessStoriesSection consumers={[{ ...consumer, guildCode: "212-1" }]} />);
    expect(screen.getByRole("article").querySelector(".landing-stories__icon img")).toHaveAttribute("src", guildIcon);
  });

  it.each(["", "99999"])("uses the default icon for missing or unknown code %s", (guildCode) => {
    render(<SuccessStoriesSection consumers={[{ ...consumer, guildCode }]} />);
    expect(screen.getByRole("article").querySelector(".landing-stories__icon img")).toHaveAttribute("src", defaultGuildIcon);
  });

  it("falls back to the default icon if an image fails to load", () => {
    render(<SuccessStoriesSection consumers={[{ ...consumer, guildCode: "212-1" }]} />);
    const icon = screen.getByRole("article").querySelector(".landing-stories__icon img")!;
    fireEvent.error(icon);
    expect(icon).toHaveAttribute("src", defaultGuildIcon);
  });

  it("renders backend business, packet, name, count and experience", () => {
    render(<SuccessStoriesSection consumers={[consumer]} />);
    const card = screen.getByRole("article");
    expect(within(card).getByRole("heading")).toHaveTextContent(consumer.businessName);
    expect(within(card).getByText(consumer.packet)).toBeInTheDocument();
    expect(within(card).getByText("علی احمدی")).toBeInTheDocument();
    expect(within(card).getByText(consumer.sentCount.toLocaleString("fa-IR"))).toBeInTheDocument();
    expect(card.querySelector("blockquote")).toHaveTextContent(consumer.userExperience);
    expect(card).toHaveClass("landing-stories__card--purple");
  });

  it("does not invent a missing experience", () => {
    render(<SuccessStoriesSection consumers={[{ ...consumer, userExperience: "" }]} />);
    expect(screen.queryByText("تجربه کاربر")).not.toBeInTheDocument();
  });

  it("hides empty results", () => {
    const { container } = render(<SuccessStoriesSection consumers={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
