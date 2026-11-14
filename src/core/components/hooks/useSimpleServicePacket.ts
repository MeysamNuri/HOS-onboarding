import { useSearchParams } from "react-router";
import { useGetServicePacketQuery } from "@/core/api/baseApi";

export default function useSimpleServicePacket(serviceCode: "BI" | "SendInvoice", enabled = true) {
  const [params] = useSearchParams();
  const query = useGetServicePacketQuery({
    serviceCode,
    agentCode: params.get("agentcode") ?? "",
    discountCode: params.get("discountcode") ?? sessionStorage.getItem("discountcode") ?? "",
  }, { skip: !enabled });
  const selectedPlan = query.currentData?.Status
    ? query.currentData.Data?.servicePacket?.find((plan) => plan.code?.toLowerCase() === "simple")
    : undefined;
  return { selectedPlan, isLoading: query.isFetching, refetch: query.refetch };
}
