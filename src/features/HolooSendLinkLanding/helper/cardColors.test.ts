import { describe, expect, it, vi } from "vitest";
import { createCardPalette, getCardColors } from "./cardColors";

describe("landing card colors", () => {
  it("shuffles all five requested colors without dropping or duplicating them", () => {
    const random = vi.spyOn(Math, "random").mockReturnValue(0);
    try {
      const palette = createCardPalette();
      expect(palette.map((color) => color.background)).toEqual([
        "#FFF5DB", "#C9FFBE", "#E3C6FF", "#B5EBFF", "#FFE0E0",
      ]);
      expect(random).toHaveBeenCalledTimes(4);
    } finally {
      random.mockRestore();
    }
  });

  it("keeps neighboring cards different, including across palette repetitions", () => {
    const palette = createCardPalette();
    for (let index = 1; index < 20; index += 1) {
      expect(getCardColors(palette, index)).not.toEqual(
        getCardColors(palette, index - 1),
      );
    }
  });

  it("leaves the card background unchanged and colors labels and borders", () => {
    const palette = createCardPalette();
    palette.forEach((color, index) => {
      const styles = getCardColors(palette, index);
      expect(styles).not.toHaveProperty("backgroundColor");
      expect(styles).not.toHaveProperty("background");
      expect(styles).toMatchObject({
        "--story-tint": color.background,
        "--story-border": color.background,
        "--landing-companion-label-bg": color.background,
        "--landing-companion-border": color.background,
      });
    });
  });

  it("keeps colors stable when reused and repeats the palette for longer lists", () => {
    const palette = createCardPalette();
    expect(getCardColors(palette, 0)).toEqual(getCardColors(palette, 0));
    expect(getCardColors(palette, 5)).toEqual(getCardColors(palette, 0));
    expect(getCardColors(palette, 0)).toMatchObject({
      "--story-tint": palette[0].background,
      "--landing-companion-label-bg": palette[0].background,
    });
  });
});
