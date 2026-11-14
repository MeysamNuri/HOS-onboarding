import { useCallback, useEffect, useMemo, useState } from "react";
import { useGetUserOrdersQuery } from "../reducers/endpoints";
import type { IUserOrders } from "../types";
import { useSelector } from "react-redux";
import json from "@core/constants/config.json";
import { getTranslation } from "@/core/helper/translationUtility";
import { toast } from "react-hot-toast";
import { usePaymentDataMutation } from "@/features/Services/reducers/endpoints";
import { useSearchParams } from "react-router";
import { Grid } from "antd";

export default function useOrdersHooks() {
    const { useBreakpoint } = Grid;
    const packetCode = localStorage.getItem("packetCode")

    const screens = useBreakpoint();

    const isDesktop = screens.lg;
    const [goToPage, setGoToPage] = useState<number | null>(null);
    const [mobileAllOrders, setMobileAllOrders] = useState<any[]>([]);

    const filters = useSelector((state: any) => state?.filters);

    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("oderId");

    const [checkPaymentData] = usePaymentDataMutation();

    const BACK_URL = json.backUrl;


    const isLogin = !!localStorage.getItem("authToken");

    const [pageModel, setPageModel] = useState({
        pageNumber: 1,
        itemsPerPage: 10,
    });


    useEffect(() => {
        if (!isLogin) {
            window.location.replace(
                `https://portfolio.invalid/sso/authorize?client_id=portfolio-demo` +
                `&response_type=code` +
                `&redirect_uri=${BACK_URL}/home` +
                `&scope=openid%20profile%20persona:read` +
                `&state=orders/history`
            )

        }
    }, [isLogin, BACK_URL]);

    // Reset page only when filter values change
    useEffect(() => {
        setPageModel({
            ...pageModel,
            pageNumber: 1,

        });

        setGoToPage(null);
    }, [
        filters.serial,
        filters.serviceType,
        filters.serviceStatus,
        filters.fromDate,
        filters.toDate,
    ]);

    const queryArgs: IUserOrders = useMemo(() => {

        return {
            serial: filters?.serial || undefined,
            serviceType: filters?.serviceTypes || "",
            serviceStatus: filters?.serviceStatus || "",
            pageNumber: pageModel?.pageNumber,
            itemsPerPage: pageModel?.itemsPerPage,
            fromDate: filters?.fromDate || "",
            toDate: filters?.toDate || "",
        };
    }, [filters, pageModel]);

    const {
        data: ordersHistoryData,
        isFetching,
        refetch,
    } = useGetUserOrdersQuery(queryArgs, {
        refetchOnMountOrArgChange: true,
    });

    useEffect(() => {
        if (!ordersHistoryData?.Status) {
            ordersHistoryData?.Message?.forEach((item) => {
                if (item === null) return;
                toast.error(getTranslation(item));
            });
        }
    }, [ordersHistoryData]);

    const handlePageChange = (page: number, pageSize: number) => {
        setPageModel((prev) => ({
            ...prev,
            pageNumber: page,
            itemsPerPage: pageSize,
        }));
    };

    const handlePageSizeChange = (pageSize: number) => {

        setPageModel({
            pageNumber: 1,
            itemsPerPage: pageSize,
        });
    };

    const goBack = () => {
        window.history.back();
    };

    const handleCheckPaymentData = useCallback(async () => {
        if (!orderId || orderId === "undefined") return;

        try {
            const response = await checkPaymentData({
                PaymentDate: new Date(),
                IsSucessPayment: true,
                PaymentData: "",
                Id: orderId,
            }).unwrap();

            if (response?.Status) {
                if (response?.Data?.isSuccess)
                    toast.success("پرداخت موفق");

                // Send event to Matomo
                window._paq.push([
                    "trackEvent",
                    "Order",       // Category
                    "SuccessPayment",      // Action
                    packetCode  // Name/Label
                ]);
                refetch();
            } else {
                response?.Message?.forEach((msg: string) => {
                    if (msg === null) return;
                    toast.error(getTranslation(msg));
                });
                // Send event to Matomo
                window._paq.push([
                    "trackEvent",
                    "Order",      // Category
                    "FailedPayment",      // Action
                    packetCode  // Name/Label
                ]);
            }
        } catch (error) {
            console.error("Payment check failed:", error);
        }
    }, [orderId, checkPaymentData, refetch]);

    useEffect(() => {
        if (orderId) {
            handleCheckPaymentData();
        }
    }, [orderId, handleCheckPaymentData]);

    const totalPages = Math.ceil(
        (ordersHistoryData?.Data?.totalCount || 0) /
        (pageModel.itemsPerPage || 10)
    );

    const handleGoToPage = () => {
        if (!goToPage) return;

        if (goToPage >= 1 && goToPage <= totalPages) {
            handlePageChange(goToPage, pageModel.itemsPerPage);
        }
    };

    useEffect(() => {
        handleGoToPage();
    }, [goToPage]);



    useEffect(() => {
        const newItems = ordersHistoryData?.Data?.items ?? [];

        if (pageModel.pageNumber === 1) {
            setMobileAllOrders(newItems);
        } else {
            setMobileAllOrders(prev => [...prev, ...newItems]);
        }
    }, [ordersHistoryData]);


    return {
        isDesktop,
        goBack,
        isLogin,
        handlePageChange,
        handlePageSizeChange,
        ordersHistoryData,
        isFetching,
        pageModel,
        setGoToPage,
        goToPage,
        totalPages,
        mobileAllOrders
    };
}
