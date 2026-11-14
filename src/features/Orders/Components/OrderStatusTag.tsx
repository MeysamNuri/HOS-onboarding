import { Tag } from "antd";
import { statusMap } from "../types";
import type { IOrersHstoryItems } from "../types";
import "./orderStatusTag.scss";

export default function OrderStatusTag({ status, isSuccessPayment }: Pick<IOrersHstoryItems, "status" | "isSuccessPayment">) {
  const effectiveStatus = isSuccessPayment ? status : "PaymentFailed";
  const entry = Object.prototype.hasOwnProperty.call(statusMap, effectiveStatus)
    ? statusMap[effectiveStatus as keyof typeof statusMap]
    : undefined;

  return <Tag className={`order-status-tag ${entry?.className ?? ""}`}>{entry?.text ?? "نامشخص"}</Tag>;
}
