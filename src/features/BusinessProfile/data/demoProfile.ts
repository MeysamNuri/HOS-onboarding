import type { BusinessProfile } from "../types";
import banner from "../assets/demo-banner.png";
import map from "../assets/demo-map.png";

export const demoProfile: BusinessProfile = {
  name: "لوازم یدکی نمونه",
  tagline: "بهترین و باکیفیت‌ترین قطعات سمند، پژو و دنا پلاس",
  banner: { imageUrl: banner, alt: "فروش ویژه لوازم یدکی؛ انتخابی بهتر برای خودروی شما" },
  introduction: "فروشگاه لوازم یدکی نمونه در زمینه تأمین قطعات خودروهای سمند، پژو و دنا پلاس فعالیت می‌کند. تلاش ما این است که با راهنمایی در انتخاب قطعه مناسب و پاسخ‌گویی به پرسش‌های مشتریان، خریدی مطمئن و آسان را فراهم کنیم.",
  productsDescription: "در فروشگاه ما قطعات مصرفی، لوازم جانبی، قطعات موتور و سیستم ترمز خودروهای سمند، پژو و دنا پلاس ارائه می‌شود. برای اطلاع از موجودی و انتخاب قطعه متناسب با خودروی خود، از طریق شماره‌های درج‌شده با ما در ارتباط باشید.",
  successStory: "کارمان را با یک فروشگاه کوچک و با هدف تأمین قطعات موردنیاز مشتریان آغاز کردیم. همراهی و اعتماد مشتریان به ما کمک کرد تا تنوع محصولات را بیشتر کنیم و خدمات بهتری ارائه دهیم. امروز هم پاسخ‌گویی و حفظ این اعتماد، مهم‌ترین بخش مسیر ماست.",
  phones: ["00000000000", "00000000000"],
  address: "نشانی نمایشی — فاقد موقعیت واقعی",
  website: "https://portfolio.example",
  map: { imageUrl: map, link: "" },
  socialLinks: [
    { platform: "instagram", url: "https://portfolio.example/instagram" },
    { platform: "telegram", url: "https://portfolio.example/telegram" },
    { platform: "whatsapp", url: "https://portfolio.example/whatsapp" },
    { platform: "bale", url: "https://portfolio.example/bale" },
    { platform: "rubika", url: "https://portfolio.example/rubika" },
  ],
};
