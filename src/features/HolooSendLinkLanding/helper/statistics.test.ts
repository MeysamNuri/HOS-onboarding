import { describe, expect, it } from "vitest";
import { getPacketColors, getPacketTone } from "./statistics";

describe("packet colors", () => {
  it("assigns distinct colors to every supported packet", () => {
    const packets = ["آغاز", "نوپا", "رشد", "کارا", "پیشرو", "حرفه‌ای", "طلایی", "الماس", "پلاتینیوم"];
    expect(new Set(packets.map((packet) => JSON.stringify(getPacketColors(packet)))).size).toBe(packets.length);
  });

  it("normalizes Persian and English names", () => {
    expect(getPacketColors("بسته حرفه‌ای")).toEqual(getPacketColors("PRO"));
    expect(getPacketColors("بسته طلايي")).toEqual(getPacketColors("gold"));
  });

  it("uses a neutral default for missing names", () => {
    for (const packet of [undefined, null, "", "   "]) {
      expect(getPacketTone(packet)).toBe("default");
      expect(getPacketColors(packet)).toEqual(getPacketColors(""));
    }
  });

  it("keeps colors stable for other named packets", () => {
    expect(getPacketColors("آزمایشی")).toEqual(getPacketColors("آزمایشی"));
    expect(getPacketColors("آزمایشی")).not.toEqual(getPacketColors("سازمانی"));
  });
});
