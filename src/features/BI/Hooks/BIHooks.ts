import { getTranslation } from "@/core/helper/translationUtility";
import { usePaymentDataMutation } from "@/features/Services/reducers/endpoints";
import { useCallback, useEffect } from "react";
import { toast } from "react-hot-toast";

export default function useBIHooks() {
    const orderId = localStorage.getItem("orderId");
    const [checkPaymentData, { isLoading: checkPaymentLoading }] = usePaymentDataMutation()

    const handleCheckPaymentData = useCallback(async () => {
        if (!orderId || orderId === "undefined") return;

        try {
            const response = await checkPaymentData({
                PaymentDate: new Date(),
                IsSucessPayment: true,
                PaymentData: "",
                Id: orderId,
            }).unwrap();

            if (!response?.Status) {
                response?.Message?.forEach((msg: string) => {
                    if (msg === null) return;
                    toast.error(getTranslation(msg))
                }

                );
            }
        } catch (error) {
            console.error("Payment check failed:", error);
        }
    }, [orderId, checkPaymentData]);

    useEffect(() => {
        if (orderId) {
            handleCheckPaymentData();
        }

    }, [handleCheckPaymentData, orderId]);
    return {
        checkPaymentLoading,
    }
}