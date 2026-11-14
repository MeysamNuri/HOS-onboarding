import { Button, Spin } from "antd";
import { useSelector } from "react-redux";
import Lottie from "lottie-react";
import failedLottie from "@core/assets/icons/Failed.json";

import award from "@core/assets/images/award_star.svg";
import type { IGetOrderOBJ, IGetOrderRes, IServicePacketOBG } from "@core/types/models";
import type { RootState } from "@/core/constants/store";
import { convertToDomesticFormat } from "@/core/helper/convertPhoneNumber";
import { formatRial } from "@/core/helper/formatRial";
import { NumberConverter } from "@/core/helper/numberConverter";
import { getTranslation } from "@/core/helper/translationUtility";

import "./styles/orderDetailsError.scss";

interface ErrorsProps {
  messages?: string | string[];
  title?: string;
  onClose: () => void;
  orderDetailsData?: IGetOrderRes;
  selectedPlan?: Pick<IServicePacketOBG, "name" | "duration" | "salesPrice">;
  orderDetailsLoading?: boolean;
  checkPaymentLoading?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  serviceCode?: "BI" | "SendInvoice";
}

const toPersianNumber = (value?: string | number | null) =>
  NumberConverter.latinToArabic(String(value ?? "-"));

const formatToman = (value?: number) =>
  value === undefined
    ? "-"
    : value === 0 ? "رایگان" : `${formatRial(Math.max(0, value) / 10)} تومان`;

export default function Errors({
  messages,
  title = "متأسفانه فعال‌سازی بسته انجام نشد",
  onClose,
  orderDetailsData,
  selectedPlan,
  orderDetailsLoading = false,
  checkPaymentLoading = false,
  actionLabel,
  onAction,
  serviceCode,
}: ErrorsProps) {


  console.log(messages,"messages");
  
  const errorText = (Array.isArray(messages) ? messages : [messages])
    .filter((message): message is string => typeof message === "string" && Boolean(message.trim()))
    .map((message) => getTranslation(message.trim()))
    .join("، ") || title;

  const userInfo = useSelector(
    (state: RootState) => state.userInfo?.value,
  );
console.log(errorText,"errorText");

  const orderResult: IGetOrderOBJ | undefined =
    orderDetailsData?.orders?.[0];
  const packageName = orderResult?.packetName ?? selectedPlan?.name;
  const packageDuration = orderResult?.packetDuration ?? selectedPlan?.duration;
  const packagePrice = orderResult?.packetSalesPrice ?? selectedPlan?.salesPrice;
  const serviceKey = (orderResult?.service || serviceCode)?.toLowerCase();
  const serviceName = serviceKey === "bi" ? "هلو همراه" : serviceKey === "sendinvoice" ? "اشتراک آنلاین اسناد" : "";
  const serviceBadgeClass = serviceKey === "bi" ? "payment-error__package-service-badge--bi" : "payment-error__package-service-badge--send-invoice";

  const localSerial = localStorage.getItem("serial");
  const userSerial = orderResult?.serial || localSerial || "-";

  const domesticPhone = convertToDomesticFormat(
    userInfo?.phoneNumber ?? "",
  );

  const customerName =
    `${userInfo?.firstName ?? ""} ${userInfo?.lastName ?? ""}`.trim() ||
    "-";


  if (orderDetailsLoading || checkPaymentLoading) {
    return (
      <div className="payment-error__loading">
        <Spin />
      </div>
    );
  }

  return (
    <section className="payment-error" dir="rtl">
      <header className="payment-error__header">
       <Lottie
          animationData={failedLottie}
          loop={true}
          className="order-details__success-animation"
        />

        <h2>{errorText}</h2>
      </header>

      <div className="payment-error__details">
        <div className="payment-error__card">
          <div className="payment-error__row payment-error__row--phone">
            <span>شماره موبایل</span>
            <strong dir="ltr">
              {toPersianNumber(domesticPhone || "-")}
            </strong>
          </div>

          <div className="payment-error__purchase">
            <div className="payment-error__package">
              <img
                className="payment-error__package-icon"
                src={award}
                alt=""
                aria-hidden="true"
              />

              <div>
                <strong>{packageName || "-"}{serviceName && <span className={`payment-error__package-service-badge ${serviceBadgeClass}`}>{serviceName}</span>}</strong>
                <span>
                  {packageDuration != null
                    ? `${toPersianNumber(packageDuration)} روزه`
                    : "-"}
                </span>
              </div>
            </div>

            <div className="payment-error__price">
              <span>مبلغ</span>
              <strong>
                {formatToman(packagePrice)}
              </strong>
            </div>
          </div>
        </div>

        <div className="payment-error__card payment-error__customer">
          <div className="payment-error__row">
            <span>نام مشتری</span>
            <strong>{customerName}</strong>
          </div>

          <div className="payment-error__row">
            <span>سریال نرم افزار هلو</span>
            <strong dir="ltr">
              {toPersianNumber(userSerial)}
            </strong>
          </div>
        </div>
      </div>

      <footer className="payment-error__footer">
        {actionLabel && onAction && (
          <Button
            block
            htmlType="button"
            className="buttons-outLine"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        )}
        <Button
          block
          htmlType="button"
          className="buttons-styles payment-error__close"
          onClick={onClose}
        >
          بستن
        </Button>
      </footer>
    </section>
  );
}
