import { useGetActiveUserSerialsQuery } from "@/features/Services/reducers/endpoints";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useGetActiveServicesQuery } from "../reducers/endpoints";
import json from '@core/constants/config.json'
import type { TabsProps } from "antd";

export default function useActiveServicesHooks() {
    const paramSerial = new URLSearchParams(window.location.search).get("serial");
    const {
        data: usersSerialsList,
        isLoading: userListLoading,
    } = useGetActiveUserSerialsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });
    const storageSerial = localStorage.getItem("serial") || "";
    const defaultSerial = paramSerial || storageSerial;
    const [selectedSerial, setSelectedSerial] = useState(() => defaultSerial);

    useEffect(() => {
        if (paramSerial) {
            localStorage.setItem("serial", paramSerial);
        }
    }, [paramSerial]);

    const SelctedSerial = useCallback((serial: string) => {
        if (!serial) return;

        localStorage.setItem("serial", serial);
        setSelectedSerial(serial);
    }, []);

    useEffect(() => {
        if (!defaultSerial) return;

        setSelectedSerial(defaultSerial);

    }, [defaultSerial]);
    const { data: activeServicesData, isFetching } = useGetActiveServicesQuery(
        { serial: selectedSerial },
        { skip: !selectedSerial }
    )
    const [isMobile, setIsMobile] = useState(false);

    const [activeTab, setActiveTab] = useState("active");
    const [selectedTab, setSelectedTab] = useState({
        id: 1,
        value: "اشتراک آنلاین اسناد",
        englishName: "SendInvoice"

    })
    const isLogin = !!localStorage.getItem("authToken")
    // Use in query

    const BACK_URL = json.backUrl;

    useEffect(() => {
        if (selectedSerial) return;

        const serial = localStorage.getItem("serial") || usersSerialsList?.Data?.serials?.[0];

        if (serial) {
            SelctedSerial(serial);
        }
    }, [selectedSerial, SelctedSerial, usersSerialsList?.Data?.serials]);

    useEffect(() => {
        const checkScreen = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkScreen();
        window.addEventListener("resize", checkScreen);
        return () => window.removeEventListener("resize", checkScreen);
    }, []);
    const goBack = () => {
        window.history.back();
    };

    const servicesList = [
        {
            id: 1,
            value: "اشتراک آنلاین اسناد",
            englishName: "SendInvoice"
        },
        {
            id: 2,
            value: "هلو همراه",
            englishName: "BI"
        },
        {
            id: 3,
            value: "دستیار هلو",
            englishName: "AI"

        },
    ]

    const filteredActiveServices = useMemo(() => {
        const services = activeServicesData?.Data?.services ?? [];
        return services.filter(
            (service) => service.serviceDescription === selectedTab?.englishName
        );
    }, [activeServicesData?.Data?.services, selectedTab?.value]);

    const statusOfPackets = useMemo(() => {
        const isReserved = activeTab !== "active";

        return filteredActiveServices.filter(
            (item) => item.isReserved === isReserved
        );
    }, [activeTab, filteredActiveServices]);

    const reservedServiceDescriptions = useMemo(() => {
        const services = activeServicesData?.Data?.services ?? [];
        return new Set(
            services
                .filter((item) => item.isReserved === true)
                .map((item) => item.serviceDescription)
        );
    }, [activeServicesData?.Data?.services]);

    const hasReservedPackage = useCallback(
        (serviceDescription: string) => reservedServiceDescriptions.has(serviceDescription),
        [reservedServiceDescriptions]
    );


    useEffect(() => {
        if (!isLogin) {
            window.location.replace(`https://portfolio.invalid/sso/authorize?client_id=portfolio-demo&response_type=code&redirect_uri=${BACK_URL}/home&scope=openid%20profile%20persona:read&state=active-services`)
            return;
        }
    }, [isLogin])

    const items: TabsProps["items"] = [
        {
            key: "active",
            label: "بسته های فعال",

        },
        {
            key: "reserved",
            label: "بسته های رزرو",

        },
    ]
return {
        isMobile,
        goBack,
        usersSerialsList,
        userListLoading,
        selectedSerial,
        SelctedSerial,
        setSelctedSerial: SelctedSerial,
        activeServicesData,
        isFetching,
        defaultSerial: selectedSerial,
        servicesList,
        setSelectedTab,
        selectedTab,
        statusOfPackets,
        hasReservedPackage,
        items,
        setActiveTab,
        activeTab
    }
}
