import { Button, Spin } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import Lottie from "lottie-react";
import moment from "jalali-moment";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import doneLottie from "@core/assets/icons/Done.json";
import award from "@core/assets/images/award_star.svg";
import type {
  IGetOrderOBJ,
  IGetOrderRes,
  IPaymentDataRes,
} from "@core/types/models";
import type { RootState } from "@/core/constants/store";
import { convertToDomesticFormat } from "@/core/helper/convertPhoneNumber";
import { isEmptyDate } from "@/core/helper/dateConverter";
import { formatRial } from "@/core/helper/formatRial";
import { NumberConverter } from "@/core/helper/numberConverter";
import { QUICK_RENEW_GUIDE_RETURN_PATH_KEY } from "../guideNavigation";

import "./styles/orderDetailsModal.scss";

interface IOrderDetailsModalProps {
  onCancel: () => void;
  orderDetailsLoading: boolean;
  orderDetailsData: IGetOrderRes | undefined;
  checkPaymentResult: IPaymentDataRes | undefined;
  checkPaymentLoading: boolean;
}

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
  accent?: boolean;
  divider?: boolean;
}

const toPersianNumber = (value?: string | number | null) =>
  NumberConverter.latinToArabic(String(value ?? "-"));

const formatDateTime = (value?: string) => {
  if (isEmptyDate(value)) return "-";

  return NumberConverter.latinToArabic(
    moment(value).format("jYYYY/jMM/jDD HH:mm"),
  );
};

const DateTimeValue = ({ value }: { value?: string }) => (
  <bdi className="order-details__date-time" dir="ltr">
    {formatDateTime(value)}
  </bdi>
);

const formatToman = (value?: number) =>
  `${formatRial(Math.max(0, value ?? 0) / 10)} تومان`;

function DetailRow({ label, value, accent = false, divider = false }: DetailRowProps) {
  return (
    <div
      className={`order-details__row${accent ? " order-details__row--accent" : ""}${
        divider ? " order-details__row--divider" : ""
      }`}
    >
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function OrderDetailsModal({
  checkPaymentLoading,
  onCancel,
  orderDetailsLoading,
  orderDetailsData,
}: IOrderDetailsModalProps) {
  const navigate = useNavigate();
  const userInfo = useSelector((state: RootState) => state.userInfo?.value);
  const orderResult: IGetOrderOBJ | undefined = orderDetailsData?.orders[0];
  const currentService = orderResult?.currentService;
  const isReserved = Boolean(orderResult?.isReserved && currentService);
  const localSerial = localStorage.getItem("serial");
  const userSerial = orderResult?.serial || localSerial || "-";
  const domesticPhone = convertToDomesticFormat(userInfo?.phoneNumber ?? "");
  const customerName = `${userInfo?.firstName ?? ""} ${userInfo?.lastName ?? ""}`.trim() || "-";
  const totalPrice = orderResult?.packetSalesPrice ?? 0;
  const serviceKey = orderResult?.service?.toLowerCase();
  const serviceName = serviceKey === "bi" ? "هلو همراه" : serviceKey === "sendinvoice" ? "اشتراک آنلاین اسناد" : "";
  const serviceBadgeClass = serviceKey === "bi" ? "order-details__package-service-badge--bi" : "order-details__package-service-badge--send-invoice";
  const discountPrice = orderResult?.discountPrice ?? 0;
  const finalPrice = Math.max(0, totalPrice - discountPrice);
  const currentPackageName = currentService?.packetName || currentService?.name || "-";
  const currentRemainQuantity =
    currentService?.remainQuantity ?? orderResult?.remainQuantity ?? 0;
  const currentRemainDays = currentService?.remainDays ?? orderResult?.remainDays ?? 0;

  const handleViewActiveServices = () => {
    sessionStorage.removeItem(QUICK_RENEW_GUIDE_RETURN_PATH_KEY);
    onCancel();
    navigate("/active-services");
  };

  if (orderDetailsLoading || checkPaymentLoading) {
    return <Spin className="order-details-loading" />;
  }

  return (
    <div className={`order-details${isReserved ? " order-details--reserved" : ""}`}>
      <header className="order-details__header">
        <Lottie
          animationData={doneLottie}
          loop={true}
          className="order-details__success-animation"
        />
        <h1>
          {isReserved
            ? "خرید بسته رزرو با موفقیت انجام شد"
            : "فرآیند فعالسازی بسته با موفقیت انجام شد"}
        </h1>
        <p>کسب و کارتان پر برکت</p>
      </header>

      {isReserved ? (
        <>
          <div className="order-details__package-comparison">

              <article className="order-details__package-card order-details__package-card--reserved">
              <strong>بسته رزرو شده</strong>
              <h2>{orderResult?.packetName || "-"}</h2>
              <p>
                {toPersianNumber(orderResult?.usageCount)} ارسال | {toPersianNumber(orderResult?.packetDuration)} روز اعتبار
              </p>
            </article>
            <article className="order-details__package-card order-details__package-card--current">
              <strong>بسته فعلی</strong>
              <h2>{currentPackageName}</h2>
              <p>
                {toPersianNumber(currentRemainQuantity)} ارسال و {toPersianNumber(currentRemainDays)} روز باقی‌مانده
              </p>
            </article>
          
          </div>

          <div className="order-details__activation-note">
            <ClockCircleOutlined />
            <div>
              <strong>زمان فعال‌سازی بسته جدید</strong>
              <p>
                {orderResult?.packetName || "بسته جدید"} پس از پایان بسته فعلی، خودکار فعال می‌شود؛ مهلت
                <b> {toPersianNumber(orderResult?.packetDuration)} روزه </b>
                استفاده بسته از آن زمان لحاظ می‌شود.
              </p>
            </div>
          </div>

        </>
      ) : (
        <>
          <div className="order-details__purchase-summary">
            <DetailRow
              label="شماره موبایل"
              value={toPersianNumber(domesticPhone || "-")}
            />
            <div className="order-details__purchase-package">
              <div className="order-details__package-info">
                <img src={award} alt="" aria-hidden="true" />
                <div>
                  <strong>{orderResult?.packetName || "-"}{serviceName && <span className={`order-details__package-service-badge ${serviceBadgeClass}`}>{serviceName}</span>}</strong>
                  <span>{toPersianNumber(orderResult?.packetDuration)} روزه</span>
                </div>
              </div>
              <div className="order-details__purchase-price">
                <span>مبلغ</span>
                <strong>{formatToman(totalPrice)}</strong>
              </div>
            </div>
          </div>

        </>
      )}

      <div className="order-details__details-grid">
        <section className="order-details__section order-details__section--customer">
          <h2>اطلاعات</h2>
          <div className="order-details__panel">
            <DetailRow label="نام مشتری" value={customerName} />
            {isReserved && (
              <DetailRow
                label="شماره موبایل"
                value={toPersianNumber(domesticPhone || "-")}
              />
            )}
            <DetailRow
              label="سریال نرم افزار هلو"
              value={toPersianNumber(userSerial)}
            />
            {!isReserved && (
              <>
                <DetailRow
                  label="تاریخ و زمان شروع"
                  value={<DateTimeValue value={orderResult?.fromDate} />}
                />
                <DetailRow
                  label="تاریخ و زمان پایان"
                  value={<DateTimeValue value={orderResult?.toDate} />}
                />
              </>
            )}
          </div>
        </section>

        <section className="order-details__section order-details__section--transaction">
          <h2>جزئیات تراکنش</h2>
          <div className="order-details__panel">
            <DetailRow
              label="تاریخ"
              value={<DateTimeValue value={orderResult?.paymentDate} />}
            />
            <DetailRow label="مبلغ" value={formatToman(totalPrice)} />
            <DetailRow label="تخفیف" value={formatToman(discountPrice)} accent />
            <DetailRow label="مبلغ نهایی" value={formatToman(finalPrice)} divider />
          </div>
        </section>
      </div>

      <footer className="order-details__footer">
        {isReserved && (
          <Button
            type="text"
            className="order-details__action order-details__action--close"
            onClick={onCancel}
          >
            بستن
          </Button>
        )}
        <Button
          type="primary"
          className="order-details__action order-details__action--primary"
          onClick={isReserved ? handleViewActiveServices : onCancel}
        >
          {isReserved ? "مشاهده بسته‌های فعال" : "مشاهده راهنما"}
        </Button>
      </footer>
    </div>
  );
}
