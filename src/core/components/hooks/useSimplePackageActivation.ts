import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { convertToDomesticFormat } from "@/core/helper/convertPhoneNumber";
import type { IGetOrderRes, IPaymentDataRes, IServicePacketOBG } from "@/core/types/models";
import { useGetOrderMutation, usePaymentDataMutation, usePostOrderMutation } from "@/features/Services/reducers/endpoints";

export interface PackageActivationResult {
  success: boolean;
  messages: string[];
  orderDetails?: IGetOrderRes;
  payment?: IPaymentDataRes;
  selectedPlan?: IServicePacketOBG;
  serviceCode?: "BI" | "SendInvoice";
}

const fallbackMessage = "فعال‌سازی بسته انجام نشد. لطفاً دوباره تلاش کنید.";
const errorMessages = (value: unknown): string[] => {
  const response = (value as { data?: unknown })?.data ?? value;
  const payload = response as { Message?: string | string[]; message?: string | string[] } | undefined;
  const messages = payload?.Message ?? payload?.message;
  return (Array.isArray(messages) ? messages : [messages])
    .filter((message): message is string => typeof message === "string" && Boolean(message.trim()));
};

export default function useSimplePackageActivation(selectedPlan?: IServicePacketOBG, serviceCode: "BI" | "SendInvoice" = "BI") {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const [postOrder] = usePostOrderMutation();
  const [checkPayment] = usePaymentDataMutation();
  const [getOrder] = useGetOrderMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitting = useRef(false);
  const [errorResult, setErrorResult] = useState<PackageActivationResult>();

  const handleSubmit = async ({ phone, serial }: { phone: string; serial: string }) => {
    if (submitting.current || !selectedPlan || selectedPlan.code?.toLowerCase() !== "simple") return;
    submitting.current = true;
    setIsSubmitting(true);
    const result: PackageActivationResult = { success: false, messages: [], selectedPlan: { ...selectedPlan }, serviceCode };
    let paymentUrl = "";
    let invoiceSucceeded = false;
    const params = new URLSearchParams(search);
    const activationPage = sessionStorage.getItem("activationPage") || pathname;
    localStorage.setItem("serial", serial);
    localStorage.setItem("serviceCode", serviceCode === "SendInvoice" ? "sendLink" : serviceCode);
    localStorage.setItem("packetCode", selectedPlan.code);
    try {
      if (!phone.trim()) {
        result.messages = ["اطلاعات کاربر و شماره موبایل دریافت نشده است. لطفاً دوباره تلاش کنید."];
        return;
      }
      const response = await postOrder({
        Mobile: convertToDomesticFormat(phone),
        Serial: serial,
        ServiceCode: serviceCode,
        PacketCode: selectedPlan.code,
        IsSuccessPayment: false,
        AgentCode: params.get("agentcode") ?? "",
        DiscountCode: params.get("discountcode") ?? sessionStorage.getItem("discountcode") ?? "",
        Campaign: sessionStorage.getItem("campaign") || (serviceCode === "BI" ? activationPage : ""),
        Source: sessionStorage.getItem("source") || (serviceCode === "BI" ? activationPage : ""),
        Media: sessionStorage.getItem("medium") || (serviceCode === "BI" ? "CTA" : ""),
      }).unwrap();
      const orderId = response.Data?.orderId;
      const orderFailed = !response.Status || response.Data?.isSuccess === false;
      result.messages = orderFailed || !orderId || orderId === "undefined" ? errorMessages(response) : [];
      if (!orderFailed && orderId && orderId !== "undefined") {
        if (Number(selectedPlan.salesPrice) > 0) {
          if (!response.Data.paymentUrl) {
            result.messages = ["لینک پرداخت دریافت نشد. لطفاً دوباره تلاش کنید."];
            return;
          }
          localStorage.setItem("orderId", orderId);
          localStorage.setItem("paymentURL", response.Data.paymentUrl);
          paymentUrl = response.Data.paymentUrl;
          return;
        }
        if (serviceCode === "SendInvoice") {
          localStorage.setItem("orderId", orderId);
          localStorage.setItem("paymentURL", response.Data.paymentUrl ?? "");
          invoiceSucceeded = true;
          return;
        }
      }
      if (orderId && orderId !== "undefined") {
        const [details, payment] = await Promise.allSettled([
          getOrder({ OrderId: orderId }).unwrap(),
          !orderFailed ? checkPayment({ Id: orderId, PaymentDate: new Date(), IsSucessPayment: true, PaymentData: "" }).unwrap() : Promise.resolve(undefined),
        ]);
        if (details.status === "fulfilled" && details.value.Status) result.orderDetails = details.value.Data;
        if (details.status === "fulfilled" && !details.value.Status) result.messages.push(...errorMessages(details.value));
        if (details.status === "rejected") result.messages.push(...errorMessages(details.reason));
        if (payment.status === "rejected") result.messages.push(...errorMessages(payment.reason));
        if (payment.status === "fulfilled" && payment.value) {
          result.payment = payment.value.Data;
          result.success = Boolean(payment.value.Status && payment.value.Data?.isSuccess && result.orderDetails?.orders?.length);
          if (!payment.value.Status || !payment.value.Data?.isSuccess) {
            const messages = errorMessages(payment.value);
            result.messages.push(...(messages.length ? messages : errorMessages({ Message: payment.value.Data?.title })));
          }
        }
        if (response.Status && !result.success && !result.messages.length) {
          result.messages = ["دریافت نتیجهٔ فعال‌سازی کامل نشد. پیش از تلاش مجدد، وضعیت بسته را در خدمات فعال بررسی کنید."];
        }
      }
    } catch (error) {
      result.messages = errorMessages(error);
    } finally {
      if (!result.success && !result.messages.length) result.messages = [fallbackMessage];
      localStorage.removeItem("openModalStorage");
      submitting.current = false;
      setIsSubmitting(false);
      if (paymentUrl) {
        window.location.assign(paymentUrl);
      } else if (invoiceSucceeded) {
        navigate("/sendLink-help", { replace: true });
      } else if (serviceCode === "BI") {
        navigate("/holoo-hamrah", { replace: pathname === "/holoo-hamrah", state: { hamrahActivation: result } });
      } else {
        setErrorResult(result);
      }
    }
  };

  return { handleSubmit, isSubmitting, errorResult, closeError: () => setErrorResult(undefined), navigate };
}
