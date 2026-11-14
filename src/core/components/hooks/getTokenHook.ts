import { toast } from "react-hot-toast";
import { getTranslation } from "@/core/helper/translationUtility";
import { useGetTokenMutation, useTokenValidationMutation } from '@core/api/baseApi'
import useUserInfo from './useUserInfo';
import { useSearchParams, useNavigate } from "react-router";
import { useEffect } from "react";
import json from '@core/constants/config.json'

export default function useGetToken() {
    const [searchParams] = useSearchParams();

    const [getToken] = useGetTokenMutation()
    const [validateToken] = useTokenValidationMutation()
    const { userDataRes } = useUserInfo()
    const isLogin = !!localStorage.getItem("authToken")
    const BACK_URL = json.backUrl;
    const navigate = useNavigate()

    const urlStateParams = searchParams.get("state");
    const authCode = searchParams.get("code");
    const authToken = localStorage.getItem("authToken")
    const handleGetToken = async (authCode: string) => {

        try {
            const response = await getToken({ Code: authCode }).unwrap()
            if (response?.Status) {
                localStorage.setItem("authToken", response.Data.accessToken);

                if (urlStateParams) {
                    const state = decodeURIComponent(urlStateParams);
                    const [pathname, query = ""] = decodeURIComponent(state).split("?");
                    const searchParams = new URLSearchParams(query);
                    for (const [key, value] of [...searchParams.entries()]) {
                        if (!value) {
                            searchParams.delete(key);
                        }
                    }

                    navigate({
                        pathname: `/${pathname}`,
                        search: searchParams.toString()
                            ? `?${searchParams.toString()}`
                            : "",
                    });

                    return;
                }
            }
        } catch (error) {
            toast.error("خطای سمت سرور در دریافت توکن")
            return error
        }
    }
    const handleValidationToken = async () => {

        try {
            if (authToken) {
                const response = await validateToken({ Token: authToken }).unwrap()
                if (response?.Status && response?.Data?.active) {
                    return;
                }
                localStorage.clear()
                response?.Message.map((item: string) => {
                    toast.error(getTranslation(item))
                })
                window.location.href = `https://portfolio.invalid/sso/authorize?client_id=portfolio-demo&response_type=code&redirect_uri=${BACK_URL}/home&scope=openid%20profile%20persona:read&state=home`;

            }

        } catch (error) {
            return error
        }
    }
    useEffect(() => {
        if (authCode && !!authToken == false) {

            handleGetToken(authCode)
        }
    }, [authCode, authToken])

    useEffect(() => {
        if (!isLogin) return;

        handleValidationToken();

        const intervalId = setInterval(() => {
            handleValidationToken();
        }, 15 * 1000);

        return () => clearInterval(intervalId);
    }, [isLogin]);

    return {
        userDataRes,
        isLogin
    }
}
