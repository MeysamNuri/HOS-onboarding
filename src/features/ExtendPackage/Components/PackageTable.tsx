import { Button } from "antd";

import { NumberConverter } from "@/core/helper/numberConverter";
import type { IServicePacketOBG } from "@/core/types/models";

import { PackageIcon } from "./QuickRenewPackageCard";
import {
  formatCount,
  formatPrice,
  getDurationInMonths,
  isSamePlan,
} from "../utils/packageUtils";

interface PackageTableProps {
  plans: IServicePacketOBG[];
  popularPlan?: IServicePacketOBG;
  selectedPlan?: IServicePacketOBG;
  activationLoading: boolean;
  onSelect: (plan: IServicePacketOBG) => void;
  onShowDetails: (plan: IServicePacketOBG) => void;
}

export default function PackageTable({
  plans,
  popularPlan,
  selectedPlan,
  activationLoading,
  onSelect,
  onShowDetails,
}: PackageTableProps) {
  return (
    <div className="quick-renew__table-wrapper">
      <table className="quick-renew__table">
        <thead>
          <tr>
            <th>نام بسته</th>
            <th>شرح</th>
            <th>نوع کاربر</th>
            <th>ارتباط با مشتری</th>
            <th>مدت</th>
            <th>قیمت کل</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr
              key={`${plan.serviceId}-${plan.code}`}
              className={isSamePlan(plan, popularPlan) ? "is-popular" : undefined}
            >
              <td>
                <div className="quick-renew__table-package">
                  <span className="quick-renew__table-package-icon" aria-hidden="true">
                    <PackageIcon plan={plan} />
                  </span>
                  <strong>{NumberConverter.latinToArabic(plan.name)}</strong>
                  {isSamePlan(plan, popularPlan) && (
                    <span className="quick-renew__table-popular-badge">پیشنهاد ویژه</span>
                  )}
                </div>
              </td>
              <td>{plan.lable || "-"}</td>
              <td>{plan.type === "Normal" ? "عادی" : "پرمصرف"}</td>
              <td>تا {formatCount(plan.sendCount)} ارتباط</td>
              <td>
                {NumberConverter.latinToArabic(String(getDurationInMonths(plan.duration)))} ماه
              </td>
              <td className="quick-renew__table-price">
                {!!plan.basePrice && plan.basePrice !== plan.salesPrice && (
                  <del>{formatPrice(plan.basePrice)} تومان</del>
                )}
                <strong>
                  {plan.salesPrice === 0 ? "رایگان" : `${formatPrice(plan.salesPrice)} تومان`}
                </strong>
              </td>
              <td>
                <button type="button" onClick={() => onShowDetails(plan)}>
                  جزئیات
                </button>
                <Button
                  loading={plan.code === selectedPlan?.code && activationLoading}
                  onClick={() => onSelect(plan)}
                >
                  انتخاب بسته
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
