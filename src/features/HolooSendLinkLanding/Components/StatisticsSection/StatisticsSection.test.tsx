import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import StatisticsSection from ".";

describe("StatisticsSection", () => {
  it("maps each backend count to its correct label, including zero", () => {
    render(<StatisticsSection statistics={{ activeUsersCount: 11, sentCount: 22, viewCount: 33, shareCount: 44, downloadCount: 0, topConsumers: [], newCompanions: [] }} />);
    const entries = [["کسب‌وکار هوشمند", 11], ["مصرف کاغذ کمتر", 22], ["تعداد مشاهده مشتریان", 33], ["اشتراک‌گذاری", 44], ["دانلود PDF", 0]] as const;
    for (const [label, value] of entries) {
      const card = screen.getByText(label).closest("article")!;
      expect(within(card).getByText(`+${value.toLocaleString("fa-IR")}`)).toHaveAttribute("dir", "ltr");
    }
  });

  it("shows placeholders rather than sample counts while loading", () => {
    render(<StatisticsSection isLoading />);
    expect(screen.getAllByText("—")).toHaveLength(5);
    expect(screen.getByLabelText("آمار اشتراک آنلاین اسناد")).toHaveAttribute("aria-busy", "true");
  });
});
