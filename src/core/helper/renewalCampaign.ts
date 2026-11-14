export const getRenewalCampaignUrl = (pathname: string) => {
  const params = new URLSearchParams({
    packetcode: "OneMonth2000-3",
    mtm_source: pathname.replace(/^\/+/, ""),
    mtm_medium: "CTA",
    mtm_campaign: "AbanDiscount",
    discountcode: "140508",
  });
  return `/quickrenew?${params.toString()}`;
};
