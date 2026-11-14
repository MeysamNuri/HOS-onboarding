import { orderTypeMapping, sentLinksstatusMapping, serviceTypeMapping, statusMapping } from "../types/models";
import { renderJalaliDate2 } from "./dateConverter";


export const getFilterValue = (key: string, value: string) => {
    if (key === "serviceStatus") {
        return (
            statusMapping[value as keyof typeof statusMapping] ?? value
        );
    }
    if (key === "status") {
        return (
            sentLinksstatusMapping[value as keyof typeof sentLinksstatusMapping] ?? value
        );
    }
    if (key === "reportType") {
        return (
            orderTypeMapping[value as keyof typeof orderTypeMapping] ?? value
        );
    }

    if (key === "serviceTypes") {
        return (
            serviceTypeMapping[value as keyof typeof serviceTypeMapping] ?? value
        );
    }
    if (key === "serial") {
        return (
           value
        );
    }
    if (key === "search") {
        return (
           value
        );
    }
    if (key === "fromDate" || key === "sendDateFrom") {
        return (renderJalaliDate2(value).split("-")[1])
    }
    if (key === "toDate" || key === "sendDateTo") {
        return (renderJalaliDate2(value).split("-")[1])
    }

    // return null;
};