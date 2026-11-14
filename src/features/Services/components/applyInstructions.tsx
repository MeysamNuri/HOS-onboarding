import { useLocation } from "react-router";
import { getRenewalCampaignUrl } from "@/core/helper/renewalCampaign";

import AparatVideo from "@/core/components/guideVideo";
import mobileProposalBannerOne from "@core/assets/images/banner-propose/mobile/Banner1.png";
import mobileProposalBannerFour from "@core/assets/images/banner-propose/mobile/banner4.png";

const guideProposalBanners = [
    mobileProposalBannerOne,
    mobileProposalBannerFour,
];
const baleChannelUrl = "https://portfolio.invalid/HolooOnlineC";

interface ApplyInstructionsProps {
    selectedTabId: number;

}

export default function ApplyInstructions({ selectedTabId }: ApplyInstructionsProps) {
    const { pathname } = useLocation();
    const renewalCampaignUrl = getRenewalCampaignUrl(pathname);

    if (selectedTabId !== 1) {
        return null;
    }

    return (
        <div >
            <div className="guide-proposal-banners">
                {guideProposalBanners.map((banner, index) => (
                    index === 0 ? (
                        <a
                            key={banner}
                            className="guide-proposal-banners__link"
                            href={baleChannelUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                className="guide-proposal-banners__image"
                                src={banner}
                                alt="پیوستن به کانال بله هلو آنلاین"
                            />
                        </a>
                    ) : (
                        <a key={banner} className="guide-proposal-banners__link guide-proposal-banners__link--campaign" href={renewalCampaignUrl}>
                <img className="guide-proposal-banners__image" src={banner} alt="تخفیف تمدید بسته" />
              </a>
                    )
                ))}
            </div>
            <AparatVideo />


        </div>
    )
}
