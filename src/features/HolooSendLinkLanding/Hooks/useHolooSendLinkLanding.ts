import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router";

import type { AppDispatch, RootState } from "@/core/constants/store";
import useGetToken from "@/core/components/hooks/getTokenHook";
import json from "@/core/constants/config.json";
import { setUserValue } from "@/features/HomePage/reducers/userInfoSlice";
import { useGetLogoutMutation } from "@/core/api/baseApi";
import type { SampleDocumentType } from "../types";

export interface LandingNavigationItem {
  id: string;
  label: string;
  path: string;
  active?: boolean;
  disabled?: boolean;
}

const navigationItems: LandingNavigationItem[] = [
  {
    id: "holoo-link-packages",
    label: "بسته‌های اشتراک آنلاین اسناد",
    path: "/sendLink",
    active: true,
  },
  {
    id: "holoo-mobile-packages",
    label: "بسته‌های هلو همراه",
    path: "/holoo-hamrah",
},
  {
    id: "support",
    label: "پشتیبانی",
    path: "/support",
  },
  {
    id: "activation-guide",
    label: "راهنمای فعال‌سازی",
    path: "/sendLink-help",
  },
];

export default function useHolooSendLinkLanding() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSampleSelection, setOpenSampleSelection] = useState(false);
  const [openInvoiceDemo, setOpenInvoiceDemo] = useState(false);
  const [sampleType, setSampleType] = useState<SampleDocumentType>("invoice");
  const { userDataRes, isLogin } = useGetToken();
  const [logoutUser] = useGetLogoutMutation();
  const userInfo = useSelector((state: RootState) => state.userInfo.value);
  const authToken = localStorage.getItem("authToken");
  const openModalStorage = localStorage.getItem("openModalStorage");
  const BACK_URL = json.backUrl;

  useEffect(() => {
    if (userDataRes?.Status) {
      dispatch(setUserValue(userDataRes.Data));
    }
  }, [dispatch, userDataRes]);

  useEffect(() => {
    const campaign = searchParams.get("mtm_campaign") ?? "";
    const source = searchParams.get("mtm_source") ?? "";
    const medium = searchParams.get("mtm_medium") ?? "";
    const discountCode = searchParams.get("discountcode") ?? "";

    if (campaign || source || medium || discountCode) {
      sessionStorage.setItem("campaign", campaign);
      sessionStorage.setItem("source", source);
      sessionStorage.setItem("medium", medium);
      sessionStorage.setItem("discountcode", discountCode);
    }
  }, [searchParams]);

  useEffect(() => {
    const storedType = localStorage.getItem("sampleType") as SampleDocumentType | null;
    if (authToken && userInfo && openModalStorage === "sampleModal" && storedType) {
      setSampleType(storedType);
      setOpenInvoiceDemo(true);
    }
  }, [authToken, openModalStorage, userInfo]);

  const navigateTo = (path: string) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      const response = await logoutUser().unwrap();
      localStorage.clear();
      if (response?.Data?.link) window.location.href = response.Data.link;
      else navigateTo("/holoo-landing");
    } catch {
      localStorage.clear();
      navigateTo("/holoo-landing");
    }
  };

  const handleSendSample = () => setOpenSampleSelection(true);

  const handleSelectSample = (type: SampleDocumentType) => {
    setSampleType(type);
    setOpenSampleSelection(false);
    localStorage.setItem("openModalStorage", "sampleModal");
    localStorage.setItem("sampleType", type);

    if (!authToken) {
      const state = encodeURIComponent("holoo-landing");
      window.location.href = `https://portfolio.invalid/sso/authorize?client_id=portfolio-demo&response_type=code&redirect_uri=${BACK_URL}/home&scope=openid%20profile%20persona:read&state=${state}`;
      return;
    }

    setOpenInvoiceDemo(true);
  };

  const handleCloseInvoiceDemo = () => {
    setOpenInvoiceDemo(false);
    localStorage.removeItem("openModalStorage");
    localStorage.removeItem("sampleType");
  };

  return {
    handleCloseInvoiceDemo,
    isMobileMenuOpen,
    navigationItems,
    closeMobileMenu: () => setIsMobileMenuOpen(false),
    toggleMobileMenu: () => setIsMobileMenuOpen((currentValue) => !currentValue),
    handleLogin: () => {
      window.location.href = `https://portfolio.invalid/sso/authorize?client_id=portfolio-demo&response_type=code&redirect_uri=${BACK_URL}/home&scope=openid%20profile%20persona:read&state=holoo-landing`;
    },
    handleLogout,
    isLogin,
    userName: userDataRes?.Status
      ? `${userDataRes.Data?.firstName ?? ""} ${userDataRes.Data?.lastName ?? ""}`.trim()
      : "",
    handleManagePackages: () => navigateTo("/active-services"),
    handleNavigation: navigateTo,
    handleSendSample,
    handleSelectSample,
    openSampleSelection,
    closeSampleSelection: () => setOpenSampleSelection(false),
    openInvoiceDemo,
    sampleType,
  };
}
