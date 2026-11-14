import { cleanup, renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import useSimpleServicePacket from "./useSimpleServicePacket";

const mocks = vi.hoisted(() => ({ query: vi.fn() }));
vi.mock("@/core/api/baseApi", () => ({ useGetServicePacketQuery: mocks.query }));
const wrapper = ({ children }: { children: ReactNode }) => <MemoryRouter>{children}</MemoryRouter>;
beforeEach(() => { vi.clearAllMocks(); sessionStorage.clear(); });
afterEach(cleanup);

describe("simple service catalog", () => {
  it.each(["BI", "SendInvoice"] as const)("loads %s and selects simple rather than another zero-priced plan", (serviceCode) => {
    const selected = { code: "simple", name: "بسته واقعی", duration: 90, salesPrice: 0 };
    mocks.query.mockReturnValue({ currentData: { Status: true, Data: { servicePacket: [{ code: "other", salesPrice: 0 }, selected] } } });
    const { result } = renderHook(() => useSimpleServicePacket(serviceCode), { wrapper });
    expect(mocks.query).toHaveBeenCalledWith({ serviceCode, agentCode: "", discountCode: "" }, { skip: false });
    expect(result.current.selectedPlan).toEqual(selected);
  });
  it("accepts the API's Simple casing", () => {
    mocks.query.mockReturnValue({ currentData: { Status: true, Data: { servicePacket: [{ code: "Simple" }] } } });
    const { result } = renderHook(() => useSimpleServicePacket("BI"), { wrapper });
    expect(result.current.selectedPlan?.code).toBe("Simple");
  });
  it("does not reuse the previous service's cached data while the new service loads", () => {
    mocks.query.mockReturnValue({ data: { Status: true, Data: { servicePacket: [{ code: "Simple" }] } }, currentData: undefined, isFetching: true });
    const { result } = renderHook(() => useSimpleServicePacket("SendInvoice"), { wrapper });
    expect(result.current.selectedPlan).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
  });
  it("skips loading until a home activation card is selected", () => {
    mocks.query.mockReturnValue({});
    renderHook(() => useSimpleServicePacket("BI", false), { wrapper });
    expect(mocks.query).toHaveBeenCalledWith(expect.any(Object), { skip: true });
  });
});
