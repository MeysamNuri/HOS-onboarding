import type { CSSProperties } from "react";

const normalizePacket = (packet?: string | null) =>
  (packet ?? "").toLowerCase().replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/بسته|package/g, "").replace(/[\s\u200c-]+/g, "").trim();

const packetThemes = [
  { names: ["gold", "طلایی"], tone: "gold", hue: 43 },
  { names: ["diamond", "الماس"], tone: "blue", hue: 192 },
  { names: ["pro", "حرفه‌ای", "حرفه ای"], tone: "purple", hue: 273 },
  { names: ["start", "simple", "آغاز", "ساده"], tone: "start", hue: 156 },
  { names: ["nova", "نوپا", "نویا"], tone: "nova", hue: 210 },
  { names: ["growth", "رشد"], tone: "growth", hue: 110 },
  { names: ["work", "کارا", "ویژه"], tone: "work", hue: 345 },
  { names: ["lead", "پیشرو"], tone: "lead", hue: 25 },
  { names: ["platinum", "پلاتینیوم", "پلاتین"], tone: "platinum", hue: 235 },
];

const getPacketTheme = (packet?: string | null) => {
  const name = normalizePacket(packet);
  if (!name) return { tone: "default", hue: 0, saturation: 0 };
  const theme = packetThemes.find((item) => item.names.some((alias) => normalizePacket(alias) === name));
  if (theme) return { ...theme, saturation: 75 };
  let hash = 0;
  for (const character of name) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return { tone: "custom", hue: hash % 360, saturation: 65 };
};

export const getPacketTone = (packet?: string | null) => getPacketTheme(packet).tone;

export const getPacketColors = (packet?: string | null): CSSProperties => {
  const { hue, saturation } = getPacketTheme(packet);
  const accent = `hsl(${hue} ${saturation}% 42%)`;
  const tint = `hsl(${hue} ${saturation}% 90%)`;
  const border = `hsl(${hue} ${saturation}% 82%)`;
  return {
    "--story-accent": accent,
    "--story-tint": tint,
    "--story-border": border,
    "--landing-companion-accent": accent,
    "--landing-companion-border": border,
    "--landing-companion-label-bg": tint,
    "--landing-companion-medal": accent,
  } as CSSProperties;
};
