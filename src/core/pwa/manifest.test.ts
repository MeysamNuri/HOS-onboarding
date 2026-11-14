import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const manifest = JSON.parse(readFileSync(resolve("public/manifest.json"), "utf8"));

describe("PWA assets", () => {
  it("has a stable identity, Persian metadata and a standalone entry point", () => {
    expect(manifest).toMatchObject({
      id: "/",
      name: "خدمات آنلاین حسابداری هلو",
      short_name: "هلو آنلاین",
      lang: "fa",
      dir: "rtl",
      start_url: "/home",
      scope: "/",
      display: "standalone",
      prefer_related_applications: false,
    });
  });

  it("ships 192px and 512px PNGs matching their declared sizes", () => {
    expect(manifest.icons.map((icon: { sizes: string }) => icon.sizes)).toEqual(["192x192", "512x512"]);
    for (const icon of manifest.icons) {
      const content = readFileSync(resolve("public", icon.src.slice(1)));
      expect(content.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
      expect(icon.sizes).toBe(content.readUInt32BE(16) + "x" + content.readUInt32BE(20));
      expect(icon.type).toBe("image/png");
    }
    expect(manifest.icons.some((icon: { purpose: string }) => icon.purpose.includes("maskable"))).toBe(true);
  });

  it("links a real manifest and a 180px Apple touch icon", () => {
    const html = readFileSync(resolve("index.html"), "utf8");
    const icon = readFileSync(resolve("public/icons/apple-touch-icon.png"));
    expect(html).toContain('rel="manifest" href="/manifest.json"');
    expect(html).toContain('rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png"');
    expect(icon.readUInt32BE(16)).toBe(180);
    expect(icon.readUInt32BE(20)).toBe(180);
    expect(existsSync(resolve("public/sw.js"))).toBe(true);
    expect(existsSync(resolve("public/offline.html"))).toBe(true);
  });
});
