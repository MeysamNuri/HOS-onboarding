import { describe, expect, it } from "vitest";
import { phoneHref, safeWebUrl } from "./links";

describe("business contact links", () => {
  it("accepts only absolute HTTP links", () => {
    expect(safeWebUrl("https://portfolio.invalid")).toBe("https://portfolio.invalid/");
    for (const value of [
      "javascript:alert(1)",
      "data:text/html,test",
      "/relative",
      "invalid",
      undefined,
    ]) {
      expect(safeWebUrl(value)).toBeUndefined();
    }
  });
  it("normalizes Persian and Arabic phone numbers", () => {
    expect(phoneHref("۰۰۰۰-۰۰۰۰۰۰۰")).toBe("tel:00000000000");
    expect(phoneHref("+٩٨ (٢١) ١٢٣٤٥٦٧٨")).toBe("tel:+982112345678");
    expect(phoneHref("javascript:alert(1)")).toBeUndefined();
  });
});
