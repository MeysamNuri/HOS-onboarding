import type { IServicePacketOBG } from "@/core/types/models";

const createPlan = (
  code: string,
  name: string,
  lable: string,
  type: "Normal" | "Heavy",
  salesPrice: number,
  sendCount: number,
  duration = 60,
): IServicePacketOBG => ({
  serviceId: 3,
  code,
  name,
  salesPrice,
  basePrice: salesPrice === 0 ? 0 : Math.round(salesPrice * 1.25),
  usageCount: sendCount,
  duration,
  isActive: true,
  isItHaveAgentDiscount: false,
  color: "",
  description: lable,
  discountPercent: salesPrice === 0 ? "100" : "25",
  priority: 0,
  lable,
  pricePerSend: 0,
  sendingCosts: 0,
  baseSubscriptionPrice: 0,
  sendCount,
  type,
  category: type === "Normal" ? "Normal" : "Heavy",
  featureList: ["نمایش آنلاین و دانلود PDF"],
});

export const fallbackLandingPlans: IServicePacketOBG[] = [
  createPlan("START", "آغازین", "مناسب شروع و تست", "Normal", 0, 50, 30),
  createPlan("NOVA", "نوپا", "مناسب کسب‌وکارهای کوچک", "Normal", 24_900_000, 500),
  createPlan("GROWTH", "رشد", "مناسب رشد کسب‌وکار", "Normal", 24_900_000, 500),
  createPlan("WORK", "کار", "مناسب کسب‌وکارهای فعال", "Heavy", 24_900_000, 500),
  createPlan("LEAD", "پیشرو", "برای کسب‌وکارهای رو به رشد", "Normal", 24_900_000, 500),
  createPlan("PRO", "حرفه‌ای", "برای ارتباط‌های پرتعداد", "Normal", 24_900_000, 1_500),
  createPlan("GOLD", "طلایی", "برای نیازهای گسترده‌تر", "Heavy", 24_900_000, 2_500),
  createPlan("DIAMOND", "الماس", "انتخاب محبوب کسب‌وکارها", "Heavy", 24_900_000, 4_000),
  createPlan("PLATINUM", "پلاتینیوم", "بیشترین ظرفیت ارتباط", "Heavy", 24_900_000, 5_000),
];

export const whyFeatures = [
  { icon: "bolt", text: "امکان نمایش آنلاین و سریع در هر زمان و مکان روی گوشی مشتری" },
  { icon: "campaign", text: "امکان تعیین شعار تبلیغاتی جهت نمایش به مشتری" },
  { icon: "print", text: "امکان تعیین نسخه چاپی قابل دانلود، ساده یا پیشرفته" },
  { icon: "link", text: "امکان اشتراک‌گذاری لینک مشاهده فاکتور توسط مشتری" },
  { icon: "receipt", text: "امکان تعیین متن زیرنویس فاکتور و اطلاعات پرداخت" },
];
