import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ApplyInstructions from "./applyInstructions";
import { getRenewalCampaignUrl } from "@/core/helper/renewalCampaign";
import { MemoryRouter } from "react-router";
import bannerFour from "@core/assets/images/banner-propose/mobile/banner4.png";

vi.mock("@/core/components/guideVideo", () => ({ default: () => <div /> }));

describe("ApplyInstructions banners", () => {
  it("links banner4 to the renewal campaign without changing the Bale link", () => {
    const renewalCampaignUrl = getRenewalCampaignUrl("/sendLink-help");
    render(<MemoryRouter initialEntries={["/sendLink-help"]}><ApplyInstructions selectedTabId={1} /></MemoryRouter>);
    const banner = screen.getByAltText("تخفیف تمدید بسته");
    expect(banner).toHaveAttribute("src", bannerFour);
    expect(banner.closest("a")).toHaveAttribute("href", renewalCampaignUrl);
    expect(screen.getByRole("link", { name: "پیوستن به کانال بله هلو آنلاین" })).toHaveAttribute("href", "https://portfolio.invalid/HolooOnlineC");
    const url = new URL(renewalCampaignUrl, "https://portfolio.invalid");
    expect(url.pathname).toBe("/quickrenew");
    expect(Object.fromEntries(url.searchParams)).toEqual({ packetcode: "OneMonth2000-3", mtm_source: "sendLink-help", mtm_medium: "CTA", mtm_campaign: "AbanDiscount", discountcode: "140508" });
    expect(renewalCampaignUrl).toContain("mtm_source=sendLink-help&");
    expect(renewalCampaignUrl).not.toContain("%2F");
  });
});
