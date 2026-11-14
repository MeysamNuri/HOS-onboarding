import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { CSSProperties, ReactNode } from "react";
import CompanionSection from ".";
const companions = Array.from({ length: 8 }, (_, index) => ({ businessName: `فروشگاه ${index}`, firstName: "علی", lastName: "احمدی", packet: "بسته طلایی" }));
const companionStories = companions.map((item) => ({ name: item.businessName, field: `${item.firstName} ${item.lastName}`, plan: item.packet, tone: "gold" }));

vi.mock("swiper/react", () => ({
  Swiper: ({ children, style, autoplay }: { children: ReactNode; style: CSSProperties; autoplay: { reverseDirection: boolean } }) => (
    <div data-testid="companion-carousel" style={style} data-reverse={String(autoplay.reverseDirection)}>{children}</div>
  ),
  SwiperSlide: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

describe("CompanionSection", () => {
  it("hides empty results without showing sample businesses", () => {
    const { container } = render(<CompanionSection companions={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
  it("keeps the carousel fluid when the viewport has enough space", () => {
    const widthSpy = vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(1400);
    try {
      render(<CompanionSection companions={companions} />);
      expect(screen.getByTestId("companion-carousel").style.width).toBe("");
    } finally {
      widthSpy.mockRestore();
    }
  });

  it("keeps the carousel fluid and reverses autoplay in the RTL carousel", () => {
    const widthSpy = vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(800);
    try {
      render(<CompanionSection companions={companions} />);
      expect(screen.getByTestId("companion-carousel").style.width).toBe("");
      expect(screen.getByTestId("companion-carousel")).toHaveAttribute("data-reverse", "true");
    } finally {
      widthSpy.mockRestore();
    }
  });

  it("preserves each user icon and renders the plan and detail badge", () => {
    render(<CompanionSection companions={companions} />);
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(companionStories.length);
    cards.forEach((card, index) => {
      const story = companionStories[index];
      expect(card).toHaveClass(
        `landing-companions__card--${story.tone}`,
      );
      expect(card.querySelector(".landing-companions__avatar [aria-label='user']")).toBeInTheDocument();
      expect(card.querySelector(".landing-companions__info b")).toHaveTextContent(story.name);
      expect(within(card).getByText(story.plan)).toBeInTheDocument();
      expect(card.querySelector(".landing-companions__info strong")).toHaveTextContent(story.field);
      expect(card.querySelector(".landing-companions__medal")).toBeInTheDocument();
      expect(card.querySelector(".landing-companions__medal svg")).toBeInTheDocument();
    });
  });
});
