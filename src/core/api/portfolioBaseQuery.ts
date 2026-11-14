import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

const response = (data: unknown) => ({
  RequestUrl: "portfolio-demo",
  Data: data,
  Message: [],
  Status: true,
  HttpStatusCode: 200,
});

export const portfolioBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args) => {
  const url = typeof args === "string" ? args : args.url;
  if (url.includes("Statistics/GetStatistics")) {
    return { data: response({
      activeUsersCount: 1200,
      viewCount: 4800,
      sentCount: 6200,
      downloadCount: 2100,
      shareCount: 900,
      topConsumers: Array.from({ length: 6 }, (_, index) => ({
        businessName: "کسب‌وکار نمونه " + (index + 1),
        packet: "بسته نمایشی",
        guildName: "فروشگاه نمونه",
        guildCode: "",
        userExperience: "این متن و آمار صرفاً برای نمایش نمونه‌کار هستند.",
        firstName: "کاربر",
        lastName: "نمونه " + (index + 1),
        sentCount: 120 + index * 10,
      })),
      newCompanions: Array.from({ length: 8 }, (_, index) => ({
        businessName: "همراه نمونه " + (index + 1),
        firstName: "کاربر",
        lastName: "نمایشی",
        packet: "بسته نمایشی",
      })),
    }) };
  }
  if (url.includes("ServicePacket/GetServicePacket")) {
    return { data: response({ agentName: "", servicePacket: [] }) };
  }
  return { error: {
    status: "CUSTOM_ERROR",
    error: "Portfolio demo: live accounts, payments and backend operations are disabled.",
    data: { Message: ["این عملیات در نسخه نمونه‌کار غیرفعال است."] },
  } };
};
