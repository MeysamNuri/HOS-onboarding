import { cleanup, renderHook } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import userInfoReducer from "@/features/HomePage/reducers/userInfoSlice";
import useUserInfo from "./useUserInfo";

const mocks = vi.hoisted(() => ({ getUser: vi.fn(), response: { data: undefined as unknown, isLoading: false, isUninitialized: true, isError: false } }));
vi.mock("@/core/api/baseApi", () => ({ useGetUserMutation: () => [mocks.getUser, mocks.response] }));
const profile = { firstName: "کاربر", lastName: "تست", phoneNumber: "09121234567", serials: [], userName: "test" };
const setup = () => {
  const store = configureStore({ reducer: { userInfo: userInfoReducer } });
  const wrapper = ({ children }: { children: ReactNode }) => <Provider store={store}>{children}</Provider>;
  return { store, ...renderHook(() => useUserInfo(), { wrapper }) };
};
beforeEach(() => {
  vi.clearAllMocks();
  mocks.response = { data: undefined, isLoading: false, isUninitialized: true, isError: false };
  vi.mocked(localStorage.getItem).mockImplementation((key) => key === "authToken" ? "token" : null);
});
afterEach(cleanup);

describe("user info independent of sidebar", () => {
  it("does not crash when browser storage is unavailable", () => {
    vi.mocked(localStorage.getItem).mockImplementation(() => { throw new Error("Storage unavailable"); });
    const { result } = setup();
    expect(mocks.getUser).not.toHaveBeenCalled();
    expect(result.current.isUserReady).toBe(false);
  });
  it("loads and stores the profile on a direct landing visit", () => {
    const { result, rerender, store } = setup();
    expect(mocks.getUser).toHaveBeenCalledTimes(1);
    expect(result.current.isUserLoading).toBe(true);
    expect(result.current.isUserReady).toBe(false);
    mocks.response = { data: { Status: true, Data: profile }, isLoading: false, isUninitialized: false, isError: false };
    rerender();
    expect(store.getState().userInfo.value).toEqual(profile);
    expect(result.current.isUserReady).toBe(true);
    expect(mocks.getUser).toHaveBeenCalledTimes(1);
  });
  it("does not fetch a profile for anonymous visitors", () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);
    const { result, store } = setup();
    expect(mocks.getUser).not.toHaveBeenCalled();
    expect(result.current.isUserLoading).toBe(false);
    expect(result.current.isUserReady).toBe(false);
    expect(store.getState().userInfo.value).toBeNull();
  });
  it("keeps activation unavailable if profile loading fails and allows retry", () => {
    mocks.response = { data: undefined, isLoading: false, isUninitialized: false, isError: true };
    const { result } = setup();
    expect(result.current.isUserReady).toBe(false);
    result.current.refreshUser();
    expect(mocks.getUser).toHaveBeenCalledTimes(2);
  });
  it("does not accept a profile without a phone number", () => {
    mocks.response = { data: { Status: true, Data: { ...profile, phoneNumber: "" } }, isLoading: false, isUninitialized: false, isError: false };
    const { result } = setup();
    expect(result.current.isUserReady).toBe(false);
  });
});
