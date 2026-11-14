export const QUICK_RENEW_PATH = "/quickrenew";
export const QUICK_RENEW_GUIDE_RETURN_PATH_KEY = "quickRenewGuideReturnPath";

export const isQuickRenewReturnPath = (path: string | null) =>
  path === QUICK_RENEW_PATH || Boolean(path?.startsWith(`${QUICK_RENEW_PATH}?`));
