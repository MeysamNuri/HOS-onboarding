
import { Form, Grid } from "antd";
import { useCallback, useEffect, useState } from "react";
import type { IFormTypes, IInvoiceUserSettingSubmit } from "@core/types/models";
import {
  useGetActiveUserSerialsQuery,
  useGetInvoiceUserSettingQuery,
  usePostInvoiceUserSettingMutation,
  usePutInvoiceUserSettingMutation,
} from "../reducers/endpoints";
import { skipToken } from "@reduxjs/toolkit/query";
import { toast } from "react-hot-toast";
import { getTranslation } from "@/core/helper/translationUtility";
import json from '@core/constants/config.json'
const { useBreakpoint } = Grid;

export default function useSettingskHooks() {
  const [settingsForm] = Form.useForm();
  const [enabledRemain, setEnabledRemain] = useState(false);
  const [showSimple, setShowSimple] = useState(false);
  const [showAdvance, setShowAdvance] = useState(false);
  const [showInformal, setShowInformal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedSerial, setSelctedSerial] = useState("")
  const oderId = localStorage.getItem("orderId");
  const storageSerial = localStorage.getItem("serial");
  const screens = useBreakpoint();

  const isDesktop = screens.lg;
  const querySerial = selectedSerial ?? storageSerial;
  const BACK_URL = json.backUrl;

  const isLogin = !!localStorage.getItem("authToken")
  const [isEditMode, setIsEditMode] = useState(false);
  const { data: usersSerialsList, isLoading: userListLoading, refetch: serialRefetch } = useGetActiveUserSerialsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })


  // const navigate = useNavigate()
  /* ================= API ================= */
  const { data: inviceUserSettingData, isLoading: getUserSettingLoading, refetch: refetchGetInviceSettings } =
    useGetInvoiceUserSettingQuery(querySerial ? { serial: querySerial } : skipToken);

  const [createSetting, { isLoading: invoiceSettingLoading }] =
    usePostInvoiceUserSettingMutation();
  const [updateSetting] = usePutInvoiceUserSettingMutation();

  useEffect(() => {
    serialRefetch()
  }, [])



  useEffect(() => {
    if (!inviceUserSettingData?.Status) {
      inviceUserSettingData?.Message?.forEach((msg) => {
        if (msg === null) return;

        toast.error(getTranslation(msg))
      }
      );
    }
  }, [inviceUserSettingData])



  useEffect(() => {
    if (!isLogin) {
      window.location.replace(`https://portfolio.invalid/sso/authorize?client_id=portfolio-demo&response_type=code&redirect_uri=${BACK_URL}/home&scope=openid%20profile%20persona:read&state=settings`)
      return;
    }
  }, [isLogin])
  /* ================= Helpers ================= */
  const buildPayload = useCallback(
    (values: IFormTypes): IInvoiceUserSettingSubmit => ({
      Serial: querySerial ?? "",
      StoreRegistrationLogo: "",
      InvoiceTitle: "",
      InvoiceType: values.invoiceType,
      BusinessName: values.storeName,
      InvoiceFooterText: values.footerText,
      AdvertisingSlogan: values.storeSlogan,
      IsAllowedToShowRemain: enabledRemain
    }),
    [querySerial,enabledRemain]
  );

  const handleSubmitSetting = async (values: IFormTypes) => {
    const payload = buildPayload(values);
    try {
      const response = isEditMode
        ? await updateSetting(payload).unwrap()
        : await createSetting(payload).unwrap();
      refetchGetInviceSettings()
      if (response.Status) {
        toast.success("تنظیمات با موفقیت ذخیره شد");
        return;
      }

      response?.Message?.forEach((msg) => {
        if (msg === null) return;
        toast.error(getTranslation(msg))
      }
      );
    } catch {
      toast.error("خطا در ثبت تنظیمات");
    }
  };

  /* ================= Load server data ================= */
  useEffect(() => {
    if (!inviceUserSettingData) return;
    if (inviceUserSettingData.Data?.serialId) {
      setIsEditMode(true);
    }
    else {
      setIsEditMode(false);
    }
    setEnabledRemain( inviceUserSettingData?.Data?.isAllowedToShowRemain)
    settingsForm.setFieldsValue({
      storeName: inviceUserSettingData.Data?.businessName,
      storeSlogan: inviceUserSettingData.Data?.advertisingSlogan,
      footerText: inviceUserSettingData.Data?.invoiceFooterText,
      invoiceType: inviceUserSettingData.Data?.invoiceType ?? "simple",
    });
  }, [inviceUserSettingData, settingsForm]);


  useEffect(() => {
    setSelctedSerial(
      storageSerial || usersSerialsList?.Data?.serials?.[0] || ""
    );
    settingsForm?.setFieldsValue({
      serial: storageSerial || usersSerialsList?.Data?.serials?.[0] || ""
    })
  }, [usersSerialsList])


  const [value, setValue] = useState("simple");

  useEffect(() => {
    if (inviceUserSettingData?.Data?.invoiceType) {
      setValue(inviceUserSettingData?.Data?.invoiceType)
    }
  }, [inviceUserSettingData])



  return {

    settingsForm,
    invoiceSettingLoading,
    getUserSettingLoading,
    handleSubmitSetting,
    setShowSimple,
    setShowAdvance,
    setShowInfoModal,
    showInfoModal,
    showSimple,
    showAdvance,
    oderId,
    inviceUserSettingData,
    usersSerialsList,
    userListLoading,
    setSelctedSerial,
    selectedSerial,
    value,
    isDesktop,
    setValue,
    enabledRemain,
    setEnabledRemain,
    setShowInformal,
    showInformal

  };
}
