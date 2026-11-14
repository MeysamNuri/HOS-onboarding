import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserMutation } from "@/core/api/baseApi";
import type { AppDispatch, RootState } from "@/core/constants/store";
import { setUserValue } from "@/features/HomePage/reducers/userInfoSlice";

export default function useUserInfo() {
  const dispatch = useDispatch<AppDispatch>();
  let authToken: string | null = null;
  try {
    authToken = localStorage.getItem("authToken");
  } catch {
    authToken = null;
  }
  const userInfo = useSelector((state: RootState) => state.userInfo.value);
  const [getUser, { data: userDataRes, isLoading, isUninitialized, isError }] = useGetUserMutation();

  useEffect(() => {
    if (authToken) {
      void getUser();
    } else {
      dispatch(setUserValue(null));
    }
  }, [authToken, dispatch, getUser]);

  useEffect(() => {
    if (authToken && userDataRes?.Status) {
      dispatch(setUserValue(userDataRes.Data));
    }
  }, [authToken, dispatch, userDataRes]);

  return {
    userDataRes,
    isUserLoading: Boolean(authToken) && (isUninitialized || isLoading),
    isUserReady: Boolean(authToken && !isLoading && !isError && userDataRes?.Status && userDataRes.Data?.phoneNumber?.trim() && userInfo?.phoneNumber === userDataRes.Data.phoneNumber),
    refreshUser: getUser,
  };
}
