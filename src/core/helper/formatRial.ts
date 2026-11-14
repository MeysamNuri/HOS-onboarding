import { toPersianNumber } from "@/core/helper/translationUtility";
import { NumberConverter } from "@/core/helper/numberConverter";
export const formatRial = (value: number) =>
  `${toPersianNumber(
    NumberConverter.formatNumberWithCommas(value??0 )
  )}`;
