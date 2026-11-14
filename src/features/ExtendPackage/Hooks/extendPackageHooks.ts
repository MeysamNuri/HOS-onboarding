import { useGetServicePacketQuery } from '@/core/api/baseApi';
import type { IServicePacketOBG } from '@/core/types/models';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router'
import { ServicesCodeName } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from "@core/constants/store";
import { Grid } from 'antd';
import json from '@core/constants/config.json'
import { useGetActiveUserSerialsQuery } from '@/features/Services/reducers/endpoints';
import { setSelectedPackage } from "@/core/api/slices";
import useFreePackageOrder from './useFreePackageOrder';
import { getTranslation } from '@/core/helper/translationUtility';
import { toast } from 'react-hot-toast';

type ServicePacketQueryError = { data?: { Message?: string[] }; error?: string; };

export default function useExtendPackageHooks() {
    const [searchParams] = useSearchParams();
    const [selectedPlan, setSelectedPlan] = useState<IServicePacketOBG>()
    const [openPlansModal, setOpenPlansModal] = useState(false)
    const [activationLoading, setActivationLoading] = useState(false)
    const BACK_URL = json.backUrl;
    const isLogin = !!localStorage.getItem("authToken")
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    const isDesktop = screens.lg;
    // const agentCode = searchParams.get("agentcode");
    const discountCode = searchParams.get("discountcode");
    const agentCode = searchParams.get("agentcode");
    const packetCode = searchParams.get("packetcode");
    const paramSerial = searchParams.get("serial");
    const packetserviceId: number = Number(packetCode?.split("-")[1])
    const codeId = packetCode?.split("-")[0] ?? ""
    const serviceCodeId = ServicesCodeName[packetserviceId]
    const [openPackageDetailModal, setOpenPackageDetailsModal] = useState(false)
    const freePackageOrder = useFreePackageOrder({
        selectedPlan,
        agentCode,
        discountCode,
    });

    const authToken = localStorage.getItem("authToken")
    const {
        data: usersSerialsList,
    } = useGetActiveUserSerialsQuery(undefined, {
        skip: !isLogin,
    });

    const dispatch = useDispatch<AppDispatch>();
    const params = new URLSearchParams();
    if (packetCode) {

        params.set("packetcode", packetCode);
    }
    // if (agentCode) {

    //     params.set("agentcode", agentCode);
    // }
    if (discountCode) {

        params.set("discountcode", discountCode);
    }
    const state = `quickrenew?${params.toString()}`;

    const encodedState = encodeURIComponent(state);
    const {
        data: packetData,
        error: packetError,
        isError: packetDataError,
        isFetching: packetDataLoading,
    } = useGetServicePacketQuery({ serviceCode: serviceCodeId, agentCode: "", discountCode: discountCode! });

    useEffect(() => {
        const queryError = packetError as ServicePacketQueryError | undefined;
        const messages = packetData?.Message?.filter(Boolean) ?? queryError?.data?.Message?.filter(Boolean) ?? [];
    
        if (messages.length > 0) {
            messages.forEach((message) => toast.error(getTranslation(message)));
            return;
        }
    }, [packetData, packetDataError, packetError]);

    useEffect(() => {
        if (!isLogin) {
            window.location.replace(`https://portfolio.invalid/sso/authorize?client_id=portfolio-demo&response_type=code&redirect_uri=${BACK_URL}/home&scope=openid%20profile%20persona:read&state=${encodedState}`)
            return;
        }
    }, [isLogin])
    const findOfferPacket = packetData?.Data?.servicePacket?.find(
        (item) => item.code === codeId && item.serviceId === Number(packetserviceId)
    );
    const userInfo = useSelector(
        (state: RootState) => state.userInfo.value
    );
    const storageSerial = localStorage.getItem("serial") || "";
    const defaultSerial = paramSerial || storageSerial;
    const [selectedSerial, setSelectedSerial] = useState(() => defaultSerial);

    useEffect(() => {
        if (paramSerial) {
            setSelectedSerial(paramSerial);
            localStorage.setItem("serial", paramSerial);
            return;
        }

        if (!selectedSerial && usersSerialsList?.Data?.serials?.[0]) {
            setSelectedSerial(usersSerialsList.Data.serials[0]);
        }
    }, [paramSerial, selectedSerial, usersSerialsList]);

    const serial = selectedSerial;

    const hanleOpenModal = (plan: IServicePacketOBG) => {
        localStorage.setItem("openModalStorage", "activationModal")
        localStorage.setItem("serviceCode", plan.serviceId ? ServicesCodeName[plan.serviceId] : serviceCodeId)
        localStorage.setItem("packetCode", plan?.code ?? codeId)
        setSelectedPlan(plan)
        setActivationLoading(false)
        setOpenPlansModal(true)

    }

    const handleCloseModal = () => {
        setOpenPlansModal(false)
        localStorage.removeItem("openModalStorage")

    }
    const handleClosePackageDetail = () => {
        setOpenPackageDetailsModal(false)
    }
    const handleOpenpackageDetails = (plan: IServicePacketOBG) => {
        dispatch(setSelectedPackage(plan))
        setOpenPackageDetailsModal(true)
    }

    return {
        authToken,
        packetData,
        packetDataLoading,
        // agentCode,
        selectedPlan,
        hanleOpenModal,
        openPlansModal,
        activationLoading,
        handleCloseModal,
        findOfferPacket,
        userInfo,
        serial,
        isDesktop,
        openPackageDetailModal,
        handleClosePackageDetail,
        handleOpenpackageDetails,
        freePackageOrder,
    }
}
