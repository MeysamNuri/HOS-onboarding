import type { RootState,AppDispatch } from "@core/constants/store";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useSearchParams } from "react-router";
import type { IServicePacketOBG } from '../../types/models';
import json from '@core/constants/config.json'
import { setSelectedPackage } from "@/core/api/slices";

export default function useHolooOnlineServiceHooks({ path }: { path: string }) {

    const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

    const [openPlansModal, setOpenPlansModal] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState<IServicePacketOBG>()
    const [activationLoading, setActivationLoading] = useState(false)
    const [openPackageDetailModal, setOpenPackageDetailsModal] = useState(false)
    const agentCode = searchParams.get("agentcode");
    const serial = searchParams.get("serial");
    const utm = searchParams.get("utm");
    const openModalStorage = localStorage.getItem("openModalStorage")

    const BACK_URL = json.backUrl;

    const params = new URLSearchParams();
    if (serial) {

        params.set("serial", serial);
    }
    if (utm) {

        params.set("utm", utm);
    }
    if (agentCode) {

        params.set("agentcode", agentCode);
    }
    const state = `sendLink?${params.toString()}`;

    const encodedState = encodeURIComponent(state);

    const authToken = localStorage.getItem("authToken")

    const { pathname } = useLocation();
    const userInfo = useSelector(
        (state: RootState) => state.userInfo.value
    );


    useEffect(() => {

        const timeOut = setTimeout(() => {
            if (userInfo && openModalStorage === "activationModal") {
                setOpenPlansModal(true)

            }
        }, 2000);
        return () => {
            clearTimeout(timeOut)
        }

    }, [userInfo])

    const handleOpenpackageDetails = (plan: IServicePacketOBG) => {
                    dispatch(setSelectedPackage(plan))
       
        setOpenPackageDetailsModal(true)
    }

    const handleClosePackageDetail = () => {
        setOpenPackageDetailsModal(false)
    }

    const handleCloseModal = () => {
        setOpenPlansModal(false)
        localStorage.removeItem("openModalStorage")

    }
    const hanleOpenModal = (plan: IServicePacketOBG) => {
        const currentPlan = path ?? pathname.split("/")[1] ?? "";
        localStorage.setItem("serviceCode", currentPlan)
        localStorage.setItem("packetCode", plan?.code)
        setSelectedPlan(plan)

        if (!authToken) {
            localStorage.removeItem("openModalStorage")
            setActivationLoading(true)
            window.location.href = `https://portfolio.invalid/sso/authorize?client_id=portfolio-demo&response_type=code&redirect_uri=${BACK_URL}/home&scope=openid%20profile%20persona:read&state=${encodedState}`;
            return;
        }

        localStorage.setItem("openModalStorage", "activationModal")
        setActivationLoading(false)
        setOpenPlansModal(true)

    }


    return {

        openPlansModal,
        handleCloseModal,
        selectedPlan,
        hanleOpenModal,
        activationLoading,
        handleClosePackageDetail,
        openPackageDetailModal,
        handleOpenpackageDetails

    }
}
