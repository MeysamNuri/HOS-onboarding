import { useGetActiveUserSerialsQuery } from '@/features/Services/reducers/endpoints';
import { useCallback, useEffect, useState } from 'react';
import {
    useSearchParams,
    useNavigate,
    useLocation
} from 'react-router';
import useGetToken from './getTokenHook';
import { useGetLogoutMutation } from '@/core/api/baseApi';
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/core/constants/store";
import type { RootState } from "@core/constants/store";
import { Grid } from 'antd';
import json from "@core/constants/config.json";
import { setSidebarOpen } from '@/core/api/sideBarSlice';
import { setInseretedSerial } from '@/core/api/slices';

export default function useSideBarHooks() {
    const { useBreakpoint } = Grid;
    const navigate = useNavigate()
    const screens = useBreakpoint();
    const isDesktop = screens.lg;
    const [searchParams] = useSearchParams();

    const { isLogin, userDataRes } = useGetToken()
    const [openChooseSerialModal, setOpenChooseSerialModal] = useState(false)
    const [userName, setUserName] = useState("")
    const [collapsed, setCollapsed] = useState(true);
    const BACK_URL = json.backUrl;
    const location = useLocation();
    const route = location.pathname.split("/")[1] || "home";
    const [selected, setSelected] = useState(route);
    const campaign = searchParams.get("mtm_campaign") || "";
    const source = searchParams.get("mtm_source") || "";
    const medium = searchParams.get("mtm_medium") || "";
    const discountcode = searchParams.get("discountcode") || "";

    useEffect(() => {
        if (campaign !== "" || source !== "" || medium !== ""|| discountcode!=="") {
            sessionStorage.setItem("campaign", campaign);
            sessionStorage.setItem("source", source);
            sessionStorage.setItem("medium", medium);
            sessionStorage.setItem("discountcode", discountcode);
        }


    }, [campaign, source, medium,discountcode])
    useEffect(() => {
        if (isDesktop) {
            setCollapsed(false)
        }
    }, [isDesktop])

    useEffect(() => {
        if (route) {
            setSelected(route);
        }
    }, [route]);


    const [logoutUser, { isLoading: logoutLoading }] = useGetLogoutMutation()

    const userDetails = userDataRes?.Data

    const {
        data: usersSerialsList,
        isLoading: userListLoading,
    } = useGetActiveUserSerialsQuery(undefined, {
        skip: !isLogin,
    });

    const dispatch = useDispatch<AppDispatch>();

    //hanle serial data=============
    const paramSerial = searchParams.get("serial");
    const logout = searchParams.get("logout");
    const userSerial = useSelector(
        (state: RootState) => state.insertedSerial
    );
    const [selectedSerialByUser, setSelectedSerialByUser] = useState(() =>
        localStorage.getItem("authToken")
            ? localStorage.getItem("serial") || ""
            : ""
    );

    const clearSerial = useCallback(() => {
        if (localStorage.getItem("serial") !== null) {
            localStorage.removeItem("serial");
        }

        if (selectedSerialByUser) {
            setSelectedSerialByUser("");
        }

        if (userSerial?.inserteSerial) {
            dispatch(setInseretedSerial(""));
        }
    }, [dispatch, selectedSerialByUser, userSerial?.inserteSerial]);

    useEffect(() => {
        const clearSerialWhenTokenIsMissing = () => {
            if (!localStorage.getItem("authToken")) {
                clearSerial();
            }
        };

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "authToken" || event.key === null) {
                clearSerialWhenTokenIsMissing();
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                clearSerialWhenTokenIsMissing();
            }
        };

        clearSerialWhenTokenIsMissing();

        const intervalId = window.setInterval(clearSerialWhenTokenIsMissing, 1000);
        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("focus", clearSerialWhenTokenIsMissing);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            window.clearInterval(intervalId);
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("focus", clearSerialWhenTokenIsMissing);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [clearSerial]);

    useEffect(() => {
        if (localStorage.getItem("authToken") && userSerial?.inserteSerial) {
            setSelectedSerialByUser(userSerial.inserteSerial);
        }
    }, [userSerial]);
    useEffect(() => {
        if (localStorage.getItem("authToken") && paramSerial) {
            setSelectedSerialByUser(paramSerial);
        }
    }, [paramSerial]);

    useEffect(() => {
        dispatch(setSidebarOpen(collapsed))
    }, [collapsed])

    useEffect(() => {
        if (!localStorage.getItem("authToken")) {
            clearSerial();
            return;
        }

        if (selectedSerialByUser) return;

        const initialSerial =
            localStorage.getItem("serial") ||
            usersSerialsList?.Data?.serials?.[0] ||
            "";

        if (initialSerial) {
            setSelectedSerialByUser(initialSerial);
        }
    }, [clearSerial, selectedSerialByUser, usersSerialsList]);

    useEffect(() => {
        if (!localStorage.getItem("authToken")) {
            localStorage.removeItem("serial");
            return;
        }

        if (selectedSerialByUser) {
            localStorage.setItem("serial", selectedSerialByUser);
            window.dispatchEvent(new Event("serialChanged"));
        }
    }, [selectedSerialByUser]);

    const serial = selectedSerialByUser;


    //end=======================

    useEffect(() => {

        const fullName =
            `${userDetails?.firstName ?? ""} ${userDetails?.lastName ?? ""}`.trim() ||
            `${userDetails?.firstName ?? ""} ${userDetails?.lastName ?? ""}`.trim();
        setUserName(fullName == "" ? "نام شما" : fullName)

    }, [userDataRes, userDetails])

    useEffect(() => {
        if (logout === "success") {
            localStorage.clear()
            clearSerial()
            navigate("/home", { replace: true });
        } else if (logout === "cancel") {
            navigate("/home", { replace: true });

        }
    }, [clearSerial, logout, navigate])

    //open serial modal
    const handleChooseSerialModal = () => {
        setOpenChooseSerialModal(true)
    }
    const hanleCloseSerialModal = () => {
        setOpenChooseSerialModal(false)
    }
    const handleExit = async () => {
        const response = await logoutUser()
        try {
            if (response?.data?.Status) {

                const url = `https://portfolio.invalid/sso/logout?&client_name=سرویس های آنلاین هلو&state=LogoutState` +
                    `&redirect_uri=${BACK_URL}/home`

                window.location.href = url

            }
        } catch (error) {

            return error

        }
    }

    const handleCollapseSideBar = () => {
        setCollapsed(!collapsed)
    }
    return {
        serial,

        userListLoading,
        logoutLoading,
        userName,
        isLogin,
        openChooseSerialModal,
        hanleCloseSerialModal,
        handleChooseSerialModal,
        setSelectedSerialByUser,
        handleExit,
        setSelected,
        selected,
        setCollapsed,
        collapsed,
        isDesktop,
        handleCollapseSideBar
    }
}
