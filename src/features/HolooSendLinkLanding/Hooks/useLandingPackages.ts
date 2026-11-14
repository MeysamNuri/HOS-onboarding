import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import { useGetServicePacketQuery } from "@/core/api/baseApi";
import useHolooOnlineServiceHooks from "@/core/components/hooks/HolooServicesPlansListHooks";

import { fallbackLandingPlans } from "../data/landingData";
import useSimplePackageActivation from "@/core/components/hooks/useSimplePackageActivation";

export default function useLandingPackages() {
  const [searchParams] = useSearchParams();
  const agentCode = searchParams.get("agentcode") ?? "";
  const [isAgentDiscountEnabled, setIsAgentDiscountEnabled] = useState(
    Boolean(agentCode),
  );
  const [agentName, setAgentName] = useState("");
  const { data, isFetching } = useGetServicePacketQuery({
    serviceCode: "SendInvoice",
    agentCode: isAgentDiscountEnabled ? agentCode : "",
    discountCode: null,
  });

  useEffect(() => {
    setIsAgentDiscountEnabled(Boolean(agentCode));
  }, [agentCode]);

  useEffect(() => {
    if (data?.Data?.agentName) {
      setAgentName(data.Data.agentName);
    }
  }, [data?.Data?.agentName]);
  const {
    activationLoading,
    handleCloseModal,
    handleClosePackageDetail,
    handleOpenpackageDetails,
    hanleOpenModal,
    openPackageDetailModal,
    openPlansModal,
    selectedPlan,
  } = useHolooOnlineServiceHooks({ path: "sendLink" });

  const activation = useSimplePackageActivation(selectedPlan, "SendInvoice");

  const servicePlans = data?.Data?.servicePacket ?? [];
  const plans = servicePlans.length ? servicePlans : fallbackLandingPlans;

  const handleFreeActivation = () => {
    const freePlan =
      plans.find((plan) => plan.code === "Simple") ??
      plans.find((plan) => plan.salesPrice === 0) ??
      fallbackLandingPlans[0];

    hanleOpenModal({ ...freePlan, code: "Simple" });
  };

  return {
    activationLoading,
    agentCode,
    agentName,
    handleCloseModal,
    handleClosePackageDetail,
    handleFreeActivation,
    handleSelectPlan: hanleOpenModal,
    handleShowPlanDetails: handleOpenpackageDetails,
    isLoading: isFetching && !servicePlans.length,
    isAgentDiscountEnabled,
    openPackageDetailModal,
    openPlansModal,
    plans,
    selectedPlan,
    setIsAgentDiscountEnabled,
    ...activation,
  };
}
