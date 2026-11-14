import { useEffect, useMemo, useState } from "react";
import {
  useNavigate,
  useLocation,
  useSearchParams
} from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-hot-toast'
import { Form, type RadioChangeEvent } from "antd";
import type { AppDispatch, RootState } from "@/core/constants/store";
import { setUserPlansValue } from "../../../features/HomePage/reducers/userPlansSlice";
import { useGetActiveUserSerialsQuery } from "@/features/Services/reducers/endpoints";
import { setInseretedSerial } from "@/core/api/slices";
import {
  QUICK_RENEW_GUIDE_RETURN_PATH_KEY,
  QUICK_RENEW_PATH,
} from "@/features/Services/guideNavigation";
interface OrderModalProps {
  onCancel: () => void;
  isFromNavbar?: boolean;
  packetCode?: string;
  onSubmit?: (values: { phone: string; serial: string }) => void | Promise<void>;
}
export default function useModalForm({ onCancel, isFromNavbar, packetCode: homePacketCode, onSubmit }: OrderModalProps) {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();

  const paramSerial = searchParams.get("serial");
  const storageSerial = localStorage.getItem("serial") || "";
  const defaultSerial = paramSerial || storageSerial
  const { pathname, search } = useLocation();
  const serviceCode = localStorage.getItem("serviceCode")
  const packetCode = localStorage.getItem("packetCode")
  const agentCode = searchParams.get("agentcode");
  const discountCode = searchParams.get("discountcode");
  const [showInsertInput, setShowInsertInput] = useState(false);
  const [selectedSerial, setSelectedSerial] = useState(() => defaultSerial);
  const isLogin = !!localStorage.getItem("authToken");

  useEffect(() => {
    if (!paramSerial) return;

    setSelectedSerial(paramSerial);
    localStorage.setItem("serial", paramSerial);
  }, [paramSerial]);
  const [submittable, setSubmittable] = useState(false);

  const {
    data: activeSerials,
    isLoading: isLoadingSerials,

  } = useGetActiveUserSerialsQuery(
    undefined, {
    skip: !isLogin
  }
  );

  useEffect(() => {
    if (!isFromNavbar) {
      // Send event to Matomo
      window._paq.push([
        "trackEvent",
        "Order",     // Category
        "OrderCheckout",      // Action
        packetCode,    // Name/Label
      ]);
    }


  }, [isFromNavbar])

  const frontSerials = useMemo(() => {
    const serials = activeSerials?.Data?.serials ?? [];
    const exists = serials.includes(defaultSerial);
    return defaultSerial && !exists
      ? [defaultSerial, ...serials]
      : serials;
  }, [activeSerials, defaultSerial]);



  // Redux user info as fallback
  const userInfo = useSelector((state: RootState) => state.userInfo?.value);

  // Determine current plan path
  const currentPlan = serviceCode === "" ? pathname.split("/")[1] : serviceCode;
  // Handle radio selection
  const handleSerialChange = (e: RadioChangeEvent) => {
    setSelectedSerial(e.target.value);
  };

  const handleFinish = async (values: { serial: string }) => {
    const chosenSerial = values.serial ?? selectedSerial;

    dispatch(setInseretedSerial(chosenSerial))

    if (isFromNavbar) {

      onCancel();
      return;
    }

    if (chosenSerial === "") return toast.error("شماره سریال الزامی می باشد")

    if (onSubmit) {
      await onSubmit({
        phone: userInfo?.phoneNumber || "",
        serial: chosenSerial,
      });
      form.resetFields();
      onCancel();
      return;
    }

    // Dispatch to Redux
    dispatch(
      setUserPlansValue({
        serviceCode: currentPlan ?? "",
        packetCode: homePacketCode ?? packetCode ?? "",
        serial: chosenSerial,
        phoneNumber: userInfo?.phoneNumber || "",
        agentCode: agentCode ?? "",
        discountCode: discountCode ?? "",
      })
    );
    if (pathname === QUICK_RENEW_PATH) {
      sessionStorage.setItem(
        QUICK_RENEW_GUIDE_RETURN_PATH_KEY,
        `${pathname}${search}`,
      );
    }
    navigate("/sendLink")
    form.resetFields();
    onCancel()


  };

  // Watch form changes to enable/disable submit button
  const formValues = Form.useWatch([], form);
  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, formValues]);


  return {
    setShowInsertInput,
    showInsertInput,
    submittable,
    handleSerialChange,
    handleFinish,
    isLoadingSerials,
    frontSerials,
    form, selectedSerial, userInfo, currentPlan
  }
}
