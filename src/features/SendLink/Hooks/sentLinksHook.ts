import { useCallback, useEffect, useMemo, useState } from "react";
import { useGetUserMessagesQuery } from "../reducers/endpoints";
import type {  ISendLinksItems, IUserSendLinks } from "../types";
import { useSelector } from 'react-redux';
import json from '@core/constants/config.json'
import { getTranslation } from "@/core/helper/translationUtility";
import { toast } from "react-hot-toast";
import { message } from "antd";


export default function useSentLinksHooks() {
    const [isMobile, setIsMobile] = useState(false);
    const [goToPage, setGoToPage] = useState<number | null>(null);
    const [mobileAllSentLinks, setMobileAllSentLinks] = useState<any[]>([]);
    const [selectedRecordDetails, setSelectedRecordDetails] = useState<ISendLinksItems>()
    const [showDetailssModal,setShowDetailsModal]=useState(false)
    const filters = useSelector((state: any) => state?.sendLinksfilters);
    const handleCopy = useCallback(async (link: string) => {
        try {
            await navigator.clipboard?.writeText(link ?? "");
            message.success("کپی شد!");
        } catch (err) {
            console.error("Copy failed", err);
            message.error("خطا در کپی");
        }
    }, []);
    // Use in query

    const BACK_URL = json.backUrl;

    const isLogin = !!localStorage.getItem("authToken")


    useEffect(() => {
        if (!isLogin) {
            window.location.replace(`https://portfolio.invalid/sso/authorize?client_id=portfolio-demo&response_type=code&redirect_uri=${BACK_URL}/home&scope=openid%20profile%20persona:read&state=sent-links`)
            return;
        }
    }, [isLogin])

    const [pageModel, setPageModel] = useState({
        pageNumber: 1,
        itemsPerPage: 10
    })
    const queryArgs: IUserSendLinks = useMemo(() => {

        return {
            serial: filters.serial || undefined,
            reportType: filters.reportType || "",
            status: filters.status || "",
            search: filters.search || "",
            pageNumber: pageModel.pageNumber,
            itemsPerPage: pageModel.itemsPerPage,
            sendDateFrom: filters.sendDateFrom || "",
            sendDateTo: filters.sendDateTo || "",
        };
    }, [filters, pageModel]);

    const { data: ordersHistoryData, isFetching } = useGetUserMessagesQuery(queryArgs, {
        refetchOnMountOrArgChange: true,
    });

    useEffect(() => {
        if (!ordersHistoryData?.Status) {
            ordersHistoryData?.Message?.map((item) => {
                if (item === null) return;
                toast.error(getTranslation(item))
            })
        }
    }, [ordersHistoryData])

    useEffect(() => {
        setPageModel({
            ...pageModel,
            pageNumber: 1,

        });
        setGoToPage(null)
    }, [filters])


    const handlePageChange = (page: number, pageSize: number) => {
        setPageModel({
            ...pageModel,
            pageNumber: page,
            // optionally update itemsPerPage if you want to sync pageSize
            itemsPerPage: pageSize,
        });
    };
    const handlePageSizeChange = (pageSize: number) => {
        setPageModel({
            pageNumber: 1,
            itemsPerPage: pageSize,
        });
    };

    useEffect(() => {
        const checkScreen = () => {
            setIsMobile(window.innerWidth <= 1000);
        };

        checkScreen();
        window.addEventListener("resize", checkScreen);
        return () => window.removeEventListener("resize", checkScreen);
    }, []);
    const goBack = () => {
        window.history.back();
    };

    const totalPages = Math.ceil(
        (ordersHistoryData?.Data?.totalCount || 0) /
        (pageModel?.itemsPerPage || 10)
    );

    const handleGoToPage = () => {
        if (!goToPage) return;

        if (goToPage >= 1 && goToPage <= totalPages) {
            handlePageChange(goToPage, pageModel?.itemsPerPage || 10);
        }
    };
    useEffect(() => {
        handleGoToPage()
    }, [goToPage])

    useEffect(() => {
        const newItems = ordersHistoryData?.Data?.items ?? [];

        if (pageModel.pageNumber === 1) {
            setMobileAllSentLinks(newItems);
        } else {
            setMobileAllSentLinks(prev => [...prev, ...newItems]);
        }
    }, [ordersHistoryData]);

    const handeleRecordDetails = (record: ISendLinksItems) => {
        setShowDetailsModal(true)
        setSelectedRecordDetails(record)

    }
    const hadleCloseDetailsModal=()=>{
        setShowDetailsModal(false)
    }
    return {
        isMobile,
        goBack,
        isLogin,
        handlePageChange,
        handlePageSizeChange,
        ordersHistoryData,
        isFetching,
        pageModel,
        handleCopy,
        setGoToPage,
        goToPage,
        totalPages,
        mobileAllSentLinks,
        handeleRecordDetails,
        selectedRecordDetails,
        hadleCloseDetailsModal,
        showDetailssModal

    }
}
