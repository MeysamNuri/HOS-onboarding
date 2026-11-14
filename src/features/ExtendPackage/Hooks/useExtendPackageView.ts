import useExtendPackageHooks from "./extendPackageHooks";

export default function useExtendPackageView() {
  const packageData = useExtendPackageHooks();

  const plans = packageData.packetData?.Data?.servicePacket ?? [];
  const featuredPlan = packageData.findOfferPacket ?? plans[0];

  return {
    ...packageData,
    featuredPlan,
    plans,
  };
}
