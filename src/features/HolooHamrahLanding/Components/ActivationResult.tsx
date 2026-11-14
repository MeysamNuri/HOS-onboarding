import { useLocation, useNavigate } from "react-router";
import BottomModal from "@/core/components/customModal";
import OrderDetailsModal from "@/features/Services/components/orderDetailsModal";
import OrderDetailsError from "@/features/Services/components/orderDetailsError";
import type { HamrahActivationResult } from "../Hooks/useHamrahActivation";

export default function ActivationResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.hamrahActivation as HamrahActivationResult | undefined;
  const close = () => {
    const state = { ...location.state };
    delete state.hamrahActivation;
    navigate(location.pathname + location.search + location.hash, { replace: true, state });
  };

  if (!result) return null;

  return (
    <BottomModal open onClose={close} showHandler={false} height="100vh" width="680px">
      {result.success ? (
        <OrderDetailsModal  onCancel={close} orderDetailsLoading={false} checkPaymentLoading={false} orderDetailsData={result.orderDetails} checkPaymentResult={result.payment} />
      ) : (
        <OrderDetailsError onClose={close} messages={result.messages} orderDetailsData={result.orderDetails} selectedPlan={result.selectedPlan} />
      )}
    </BottomModal>
  );
}
