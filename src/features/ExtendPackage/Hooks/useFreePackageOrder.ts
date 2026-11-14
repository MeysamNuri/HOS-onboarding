import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { convertToDomesticFormat } from "@/core/helper/convertPhoneNumber";
import { getTranslation } from "@/core/helper/translationUtility";
import type { IPostOrder, IPostOrderRes, IServicePacketOBG } from "@/core/types/models";
import type { IResponse } from "@/core/types/responseModel";
import { usePostOrderMutation } from "@/features/Services/reducers/endpoints";
import {
  QUICK_RENEW_GUIDE_RETURN_PATH_KEY,
  QUICK_RENEW_PATH,
} from "@/features/Services/guideNavigation";

import { ServicesCodeName } from "../types";

interface FreePackageOrderOptions {
  selectedPlan?: IServicePacketOBG;
  agentCode?: string | null;
  discountCode?: string | null;
}

interface FreePackageSubmitValues {
  phone: string;
  serial: string;
}

const FREE_PACKAGE_LIMIT_ERROR =
  "The_Free_Service_Limit_For_This_ServiceType_Has_Been_Reached";

const DEFAULT_ERROR_MESSAGE = "عملیات ثبت بسته رایگان انجام نشد. لطفا مجددا تلاش کنید";

const translateMessages = (messages?: string[]) =>
  messages?.filter(Boolean).map((message) => getTranslation(message)) ?? [];

export default function useFreePackageOrder({
  selectedPlan,
  agentCode,
  discountCode,
}: FreePackageOrderOptions) {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const [submitPostOrder, { isLoading }] = usePostOrderMutation();
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [errorTitle, setErrorTitle] = useState("");

  const showOrderError = useCallback((messages?: string[]) => {
    const translatedMessages = translateMessages(messages);
    const hasFreePackageLimitError = messages?.includes(FREE_PACKAGE_LIMIT_ERROR);

    setErrorTitle(
      hasFreePackageLimitError ? "بسته رایگان فقط یک‌بار قابل استفاده است" : "",
    );
    setErrorMessages(
      translatedMessages.length > 0 ? translatedMessages : [DEFAULT_ERROR_MESSAGE],
    );
    setErrorModal(true);
  }, []);

  const handleSubmit = useCallback(
    async ({ phone, serial }: FreePackageSubmitValues) => {
      if (!selectedPlan || Number(selectedPlan.salesPrice) !== 0) return;

      const payload: IPostOrder = {
        Mobile: convertToDomesticFormat(phone),
        Serial: serial,
        ServiceCode: selectedPlan.serviceId
          ? ServicesCodeName[selectedPlan.serviceId]
          : "",
        PacketCode: selectedPlan.code ?? "",
        IsSuccessPayment: false,
        AgentCode: agentCode ?? "",
        DiscountCode: discountCode ?? "",
        Campaign: sessionStorage.getItem("campaign") ?? "",
        Source: sessionStorage.getItem("source") ?? "",
        Media: sessionStorage.getItem("medium") ?? "",
      };

      try {
        const response = await submitPostOrder(payload).unwrap();

        if (response.Status) {
          localStorage.setItem("orderId", response.Data.orderId);
          localStorage.setItem("packetCode", selectedPlan.code ?? "");
          localStorage.setItem("paymentURL", response.Data.paymentUrl ?? "");
          localStorage.removeItem("openModalStorage");
          if (pathname === QUICK_RENEW_PATH) {
            sessionStorage.setItem(
              QUICK_RENEW_GUIDE_RETURN_PATH_KEY,
              `${pathname}${search}`,
            );
          }
          navigate("/sendLink-help", { replace: true });
          return;
        }

        showOrderError(response.Message);
      } catch (error) {
        const apiError = error as { data?: Partial<IResponse<IPostOrderRes>> };
        showOrderError(apiError.data?.Message);
      }
    }, [
      agentCode,
      discountCode,
      navigate,
      pathname,
      search,
      selectedPlan,
      showOrderError,
      submitPostOrder,
    ],
  );

  const handleCloseError = useCallback(() => {
    setErrorModal(false);
  }, []);

  return {
    errorMessages,
    errorModal,
    errorTitle,
    isLoading,
    handleCloseError,
    handleSubmit,
  };
}
