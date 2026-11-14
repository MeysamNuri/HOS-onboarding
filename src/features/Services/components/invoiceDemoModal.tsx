import { Button, Typography } from "antd";
import invoiceSuccess from "@core/assets/images/invoice-success.svg";
import invoiceFailed from "@core/assets/images/invoice-error.svg";
import type { IGetSendInvoiceRes } from "../../HomePage/types";
import type { IResponse } from "@/core/types/responseModel";
import { useGetSampleInvoiceMutation } from "@features/HomePage/reducers/endpoints";
import { useGetSendIndividualSampleMutation } from "@features/HolooSendLinkLanding/reducers/endpoints";
import { getTranslation } from "@/core/helper/translationUtility";
import "./styles/invoiceDemoModal.scss";
import { useEffect, useRef } from "react";
import type { InvoiceDemoModalProps } from "@/core/types/models";
import AjaxLoadingComponent from "@/core/components/ajaxLoadingComponent";

const InvoiceDemoModal: React.FC<InvoiceDemoModalProps> = ({ sampleType = "invoice" }) => {
  const [getInvoice, invoiceState] = useGetSampleInvoiceMutation();
  const [getIndividual, individualState] = useGetSendIndividualSampleMutation();
  const requested = useRef(false);
  const isIndividual = sampleType === "individual";
  const state = isIndividual ? individualState : invoiceState;
  const cached = !isIndividual ? localStorage.getItem("sendInvoice") : null;
  const data = state.data ?? (cached ? JSON.parse(cached) : null) as IResponse<IGetSendInvoiceRes> | null;
  const errorMessage = state.error && typeof state.error === "object" && "data" in state.error ? (state.error.data as IResponse<unknown>)?.Message : undefined;
  const messages = data?.Message ?? errorMessage;
  const translatedError = messages?.map((message) => getTranslation(message)).join("، ");
  const { Title, Text } = Typography;

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;
    if (isIndividual) getIndividual(); else getInvoice();
  }, [getIndividual, getInvoice, isIndividual]);

  if (state.isLoading || state.isUninitialized) return <AjaxLoadingComponent />;
  const success = data?.Status;
  const link = data?.Data?.link;
  const documentName = isIndividual ? "معین اشخاص" : "فاکتور";

  return <div className="confirmation-container"><div className="content">
    <div className="checkmark"><img src={success ? invoiceSuccess : invoiceFailed} alt={success ? "Invoice Success" : "Invoice unSuccess"} /></div>
    <Title level={4} className="confirmation-title" style={success ? undefined : { color: "red" }}>
      {success ? "ارسال موفق" : `عدم موفقیت در ارسال ${documentName}`}
    </Title>
    <Text className="confirmation-text">
      {success ? `نمونه ${documentName} با موفقیت به تلفن همراه شما ارسال گردید` : (translatedError || `به دلیل عدم دریافت پاسخ از سرویس، ارسال ${documentName} انجام نشد. لطفا مجددا تلاش کنید`)}
    </Text>
  </div>{success && <a href={link} rel="noopener noreferrer" style={{ width: "100%" }}><Button type="primary" size="large" className="buttons-styles" style={{ width: "100%" }}>نمایش نمونه {documentName}</Button></a>}</div>;
};

export default InvoiceDemoModal;