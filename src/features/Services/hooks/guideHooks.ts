import { useCallback, useEffect, useState } from "react";

import {

  useGetOrderMutation,
  usePaymentDataMutation,

} from "../reducers/endpoints";
import { setUserPlansValue } from "@/features/HomePage/reducers/userPlansSlice";
import type { AppDispatch, RootState } from "@core/constants/store";
import json from '@core/constants/config.json'
import { toast } from "react-hot-toast";
import { getTranslation } from "@/core/helper/translationUtility";
import { useNavigate, useSearchParams } from 'react-router'
import { useDispatch, useSelector } from "react-redux";
import { Grid } from "antd";
import {
  isQuickRenewReturnPath,
  QUICK_RENEW_GUIDE_RETURN_PATH_KEY,
} from "../guideNavigation";

const guideFeatureList = [
  {
    id: 1,
    value: "فاکتور آنلاین"
  },
  {
    id: 2,
    value: "معین اشخاص"
  },
  {
    id: 3,
    value: "نصب نسخه جدید هلو"
  },
]

export default function useGuidHooks() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const authToken = localStorage.getItem("authToken")
  const BACK_URL = json.backUrl;

  const orderId = localStorage.getItem("orderId") ?? "";
  const paymentUrl = localStorage.getItem("paymentURL") ?? "";
  const [checkPaymentData, { data: checkPaymentResult, isLoading: checkPaymentLoading }] = usePaymentDataMutation()
  const [callOrderService, { isLoading: orderDetailsLoading, data: orderDetailsData }] = useGetOrderMutation()
  const selectedPlan = localStorage.getItem("serviceCode")
  const quickRenewReturnPath = sessionStorage.getItem(
    QUICK_RENEW_GUIDE_RETURN_PATH_KEY,
  );
  const packetCode = localStorage.getItem("packetCode")
  const [paymentErrorModal, setPaymentErrorModal] = useState(false)
  const [selectedTab, setSelectedTab] = useState(() => {
    const requestedTabId = Number(searchParams.get("tab"));
    return guideFeatureList.find((item) => item.id === requestedTabId) ?? guideFeatureList[0];
  })
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const isDesktop = screens.lg;

  const getHelpFile = () => {
    if (selectedTab?.id === 1) {
      return isDesktop
        ? "https://portfolio.invalid/cdn/uploads/30c3f5a8b874488bb9a4d09bee719158/DESKTOP.pdf"
        : "https://portfolio.invalid/cdn/uploads/a825f3f4fc994885a928d47fefeb2ca0/MOBILE2.pdf";
    }

    if (selectedTab?.id === 2) {
      return isDesktop
        ? "https://portfolio.invalid/cdn/uploads/047d406e1e2245c7a96fb91cddd31148/Moein_Help.pdf"
        : "https://portfolio.invalid/cdn/uploads/047d406e1e2245c7a96fb91cddd31148/Moein_Help.pdf"
    }
    if (selectedTab?.id === 3) {
      return isDesktop
        ? "https://portfolio.invalid/cdn/uploads/38ff143f89e8440fadee7df15abfe620/HolooUpdateHelp.pdf"
        : "https://portfolio.invalid/cdn/uploads/38ff143f89e8440fadee7df15abfe620/HolooUpdateHelp.pdf"
    }

    return "";
  };

  const handleCheckPaymentData = useCallback(async () => {
    if (!orderId || orderId === "undefined") return;

    try {
      const response = await checkPaymentData({
        PaymentDate: new Date(),
        IsSucessPayment: true,
        PaymentData: "",
        Id: orderId,
      }).unwrap();

      if (response?.Status) {
        window._paq.push([
          "trackEvent",
          "Order",     // Category
          packetCode == "Simple" ? "SuccessZeroPayment" : "SuccessPayment",      // Action
          packetCode  // Name/Label
        ]);
      }
      if (response?.Data.isSuccess) {
        localStorage.removeItem("paymentURL")

      }
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



  //handle modals state========
  const [showOrderDetails, setShowOrderDetails] = useState(false)

  const handleSettings = () => {
    if (!authToken) {
      window.location.href = `https://portfolio.invalid/sso/authorize?client_id=portfolio-demo&response_type=code&redirect_uri=${BACK_URL}/home&scope=openid%20profile%20persona:read&state=plans/SendInvoice/sendInvoice-guide`;
      return;
    }

    navigate("/settings")
    localStorage.removeItem("orderId")
  }
  const handleCancelModal = () => {
    localStorage.removeItem("orderId")
    setShowOrderDetails(false)
  }
  const handleGuideBack = () => {
    if (isQuickRenewReturnPath(quickRenewReturnPath)) {
      sessionStorage.removeItem(QUICK_RENEW_GUIDE_RETURN_PATH_KEY);
      navigate(quickRenewReturnPath!, { replace: true });
      return;
    }

    window.history.back();
  }
  //end=======


  //handle call get order=====================


  const handleOrderDetails = useCallback(async () => {
    if (!orderId || orderId === "undefined") return;

    try {
      const response = await callOrderService({

        OrderId: orderId
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
  }, [orderId, callOrderService]);


  useEffect(() => {
    handleOrderDetails()
  }, [handleOrderDetails])
  useEffect(() => {
    const shouldShowOrderDetails =
      selectedPlan === "sendLink" || isQuickRenewReturnPath(quickRenewReturnPath);

    if (orderDetailsData && checkPaymentResult?.Data?.isSuccess && shouldShowOrderDetails) {
      setShowOrderDetails(true)
    }

  }, [orderDetailsData, checkPaymentResult, quickRenewReturnPath, selectedPlan])


  //handle erro payment modal===========

  useEffect(() => {
    if (checkPaymentResult?.Data?.isSuccess === false) {
      if (!orderId || orderId === "undefined") return;
      setPaymentErrorModal(true)
    }
  }, [checkPaymentResult])

  const handleCloseErrormodal = () => {
    setPaymentErrorModal(false)
    localStorage.removeItem("orderId")
    localStorage.removeItem("paymentURL")



  }
  //end===========
  const handleSetting = () => {
    navigate("/settings")
  }
  useEffect(() => {
    dispatch(
      setUserPlansValue({
        serviceCode: "",
        packetCode: "",
        serial: "",
        phoneNumber: "",
        agentCode: "",
        discountCode: ""
      })
    );
  }, [])
  const handleDownloadPDF = () => {
    if (selectedTab?.id === 1) {
      window.open(
        "https://portfolio.invalid/hos/Help/Last/SendInvoice_Help_D.pdf",
        "_blank",
        "noopener,noreferrer"
      );
    }
    else if (selectedTab?.id === 2) {
      window.open(
        "https://portfolio.invalid/hos/Help/Last/Moein_Help.pdf",
        "_blank",
        "noopener,noreferrer"
      );
    }
    else if (selectedTab?.id === 3) {
      window.open(
        "https://portfolio.invalid/hos/Help/Last/HolooUpgradeHelp.pdf",
        "_blank",
        "noopener,noreferrer"
      );
    }

  }
  const handleMobileDownloadPDF = () => {
    if (selectedTab?.id === 1) {
      window.open(
        "https://portfolio.invalid/hos/Help/Last/SendInvoice_Help_M.pdf",
        "_blank",
        "noopener,noreferrer"
      );
    }
    else if (selectedTab?.id === 2) {
      window.open(
        "https://portfolio.invalid/hos/Help/Last/Moein_Help.pdf",
        "_blank",
        "noopener,noreferrer"
      );
    }
    else if (selectedTab?.id === 3) {
      window.open(
        "https://portfolio.invalid/hos/Help/Last/HolooUpgradeHelp.pdf",
        "_blank",
        "noopener,noreferrer"
      );
    }

  }
  const handleSharePDF = async () => {
    const url =
      selectedTab?.id === 2
        ? `${window.location.origin}/sendLink-help?tab=2` :
        selectedTab?.id === 3
          ? `${window.location.origin}/sendLink-help?tab=3`
          : window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url,
        });
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };
  const onInstallGuide = () => {
    setSelectedTab({
      id: 3,
      value: "نصب نسخه جدید هلو"
    })

  }
  const isSidebarOpen = useSelector(
    (state: RootState) => state.sidebar.isOpen
  );
  return {
    orderId,
    navigate,
    selectedPlan,
    handleSettings,
    handleGuideBack,
    checkPaymentLoading,
    handleCancelModal,
    orderDetailsLoading,
    showOrderDetails,
    orderDetailsData,
    checkPaymentResult,
    handleCloseErrormodal,
    paymentErrorModal,
    isDesktop,
    handleSetting,
    paymentUrl,
    handleDownloadPDF,
    handleMobileDownloadPDF,
    isSidebarOpen,
    handleSharePDF,
    guideFeatureList,
    setSelectedTab,
    selectedTab,
    getHelpFile,
    onInstallGuide

  }
}
