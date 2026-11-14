
import { useEffect, useState } from "react";
import type { IPostOrder, IPostOrderRes, IUserPlans } from "@core/types/models";
import { usePostOrderMutation } from "../reducers/endpoints";

import { getTranslation } from "@/core/helper/translationUtility";
import { useNavigate } from 'react-router'
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@core/constants/store";
import { setUserPlansValue } from "@/features/HomePage/reducers/userPlansSlice";
import { convertToDomesticFormat } from "@/core/helper/convertPhoneNumber";

export default function usePersonalCallbackURL() {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>();
    const campaign = sessionStorage.getItem("campaign");
    const source = sessionStorage.getItem("source");
    const medium = sessionStorage.getItem("medium");
    const activationPage = sessionStorage.getItem("activationPage") || window.location.pathname;
    const discountcode = sessionStorage.getItem("discountcode");
    const [showGuaranteeExpireModal, setShowGuaranteeExpireModal] = useState(false);
    const [submitPostOrder, { isLoading: postLoading }] = usePostOrderMutation()
    const [showErrors, setShowErrors] = useState<string[]>([])
    const [errorModal, setErrorModal] = useState(false)
    const [limittedOrderResponse, setLimittedOrderResponse] = useState("")
    const [orderResponse, setOrderResponse] = useState<IPostOrderRes>()
    const userPlans: IUserPlans | null = useSelector(
        (state: RootState) => state.userPlans.value
    );


    const validServiceCode = userPlans?.serviceCode === "sendLink" ? "SendInvoice" : userPlans?.serviceCode

    const handlePostOrder = async () => {
        const domestic = convertToDomesticFormat(userPlans?.phoneNumber ?? "");
        const payload: IPostOrder = {
            Mobile: domestic,
            Serial: userPlans?.serial ?? "",
            ServiceCode: validServiceCode ?? "",
            PacketCode: userPlans?.packetCode ?? "",
            AgentCode: userPlans?.agentCode ?? "",
            DiscountCode: discountcode ?? "",
            IsSuccessPayment: false,
            Campaign: userPlans?.serviceCode === "BI" && !campaign ? activationPage : campaign ?? "",
            Source: userPlans?.serviceCode === "BI" && !source ? activationPage : source ?? "",
            Media: userPlans?.serviceCode === "BI" && !medium ? "CTA" : medium ?? ""


        };
        try {
            const response = await submitPostOrder(payload).unwrap();

            localStorage.setItem("orderId", response?.Data?.orderId)
            localStorage.setItem("packetCode", userPlans?.packetCode ?? "")
            localStorage.setItem("paymentURL", response?.Data?.paymentUrl ?? "")

            if (response?.Status) {
                if (userPlans?.packetCode === "Simple" && userPlans?.serviceCode === "sendLink") {
                    navigate(`/sendLink-help`, { replace: true })
                    localStorage.removeItem("openModalStorage")
                    return
                }
                else if (userPlans?.packetCode === "Simple" && userPlans?.serviceCode === "BI") {
                    navigate(`/holoo-hamrah`, { replace: true })
                    localStorage.removeItem("openModalStorage")
                    return
                }
                window.location.replace(response.Data.paymentUrl);
                // Send event to Matomo
                window._paq.push([
                    "trackEvent",
                    "Order",     // Category
                    "SuccessOrder",      // Action
                    userPlans?.packetCode    // Name/Label
                ]);


                return;
            }
            if (!response?.Status) {


                const hasGuaranteeError = response?.Message?.includes("GuaranteeDate_Is_Expired");
                const limitedOrder = response?.Message?.includes("The_Free_Service_Limit_For_This_ServiceType_Has_Been_Reached");

                if (limitedOrder) {
                    setLimittedOrderResponse("بسته پایه فقط یکبار قابل استفاده است");
                }

                else if (!limitedOrder) {
                    setLimittedOrderResponse("")
                }
                else if (hasGuaranteeError) {
                    setShowGuaranteeExpireModal(true);
                    setOrderResponse(response?.Data)
                    setErrorModal(false);
                }

                setErrorModal(true)



                const errors = response?.Message?.map((item: string) =>
                    getTranslation(item)
                );

                setShowErrors(errors);
                if (userPlans?.serviceCode === "BI") navigate("/BI-guide", { replace: true });
                // Send event to Matomo
                window._paq.push([
                    "trackEvent",
                    "Order",     // Category
                    "FailedOrder",      // Action
                    userPlans?.packetCode    // Name/Label
                ]);

            }

        } catch (error) {
            if (userPlans?.serviceCode === "BI") navigate("/BI-guide", { replace: true });
            return error
        }
    }

    const handleCloseError = () => {
        setErrorModal(false)
        localStorage.removeItem("serviceCode")
        dispatch(
            setUserPlansValue({
                serviceCode: "",
                packetCode: "",
                serial: "",
                phoneNumber: "",
                agentCode: "",
                discountCode: "",

            })
        );
    }
    const handleCloseGuranteeModal = () => {
        setShowGuaranteeExpireModal(false)

    }

    useEffect(() => {
        if (
            userPlans?.phoneNumber &&
            userPlans?.serviceCode &&
            userPlans?.packetCode &&
            userPlans?.serial
        ) {
            handlePostOrder();
        }
    }, [
        userPlans?.phoneNumber,
        userPlans?.serviceCode,
        userPlans?.packetCode,
        userPlans?.serial,
    ]);

    return {
        postLoading,

        showGuaranteeExpireModal,
        showErrors,
        errorModal,
        limittedOrderResponse,
        orderResponse,
        handleCloseGuranteeModal,
        handleCloseError,

    }

} 