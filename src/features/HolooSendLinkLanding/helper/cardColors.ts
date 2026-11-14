import type { CSSProperties } from "react";

const cardPalette = [
  { background: "#FFE0E0", accent: "#A83F3F" },
  { background: "#FFF5DB", accent: "#886512" },
  { background: "#C9FFBE", accent: "#34752A" },
  { background: "#E3C6FF", accent: "#7536A6" },
  { background: "#B5EBFF", accent: "#246C86" },
];

export const createCardPalette = () => {
  const palette = [...cardPalette];
  for (let index = palette.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [palette[index], palette[randomIndex]] = [palette[randomIndex], palette[index]];
  }
  return palette;
};

export const getCardColors = (palette: ReturnType<typeof createCardPalette>, index: number): CSSProperties => {
  const { background, accent } = palette[index % palette.length];
  return {
    "--story-accent": accent,
    "--story-tint": background,
    "--story-border": background,
    "--landing-companion-accent": accent,
    "--landing-companion-border": background,
    "--landing-companion-label-bg": background,
    "--landing-companion-medal": accent,
  } as CSSProperties;
};
