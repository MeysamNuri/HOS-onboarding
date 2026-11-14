import { NumberConverter } from "@/core/helper/numberConverter";
import type { IServicePacketOBG } from "@/core/types/models";

export const formatPrice = (price: number) =>
  NumberConverter.latinToArabic(
    NumberConverter.formatNumberWithCommas(Number(price ?? 0) / 10),
  );

export const formatCount = (count: number) =>
  NumberConverter.latinToArabic(
    NumberConverter.formatNumberWithCommas(Number(count ?? 0)),
  );

export const getDurationInMonths = (duration: number) =>
  Math.max(1, Math.round(Number(duration ?? 30) / 30));

export const isSamePlan = (
  firstPlan?: IServicePacketOBG,
  secondPlan?: IServicePacketOBG,
) =>
  firstPlan?.code === secondPlan?.code &&
  firstPlan?.serviceId === secondPlan?.serviceId;
