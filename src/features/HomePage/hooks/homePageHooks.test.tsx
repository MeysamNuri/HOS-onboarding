import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import useHomePageHooks from "./homePageHooks";

vi.mock("react-redux", () => ({ useSelector: () => ({ phoneNumber: "09121234567" }) }));
vi.mock("antd", () => ({ Grid: { useBreakpoint: () => ({ lg: true }) } }));
const mocks = vi.hoisted(() => ({ catalog: vi.fn(), activation: vi.fn(), plan: { code: "simple", name: "بسته پایه", duration: 30, salesPrice: 0 } }));
vi.mock("@/core/components/hooks/useSimpleServicePacket", () => ({ default: mocks.catalog }));
vi.mock("@/core/components/hooks/useSimplePackageActivation", () => ({ default: mocks.activation }));
beforeEach(() => {
  vi.clearAllMocks();
  mocks.catalog.mockReturnValue({ selectedPlan: mocks.plan, isLoading: false, refetch: vi.fn() });
  mocks.activation.mockReturnValue({ handleSubmit: vi.fn(), isSubmitting: false });
  vi.mocked(localStorage.getItem).mockImplementation((key) => key === "authToken" ? "token" : null);
});
afterEach(cleanup);

describe("home activation entry", () => {
  it("maps the Hamrah card URL to the BI free service", () => {
    const { result } = renderHook(() => useHomePageHooks());
    act(() => result.current.handleOpenModal("holoo-hamrah"));
    expect(localStorage.setItem).toHaveBeenCalledWith("serviceCode", "BI");
    expect(localStorage.setItem).toHaveBeenCalledWith("packetCode", "simple");
    expect(mocks.catalog).toHaveBeenLastCalledWith("BI", true);
    expect(mocks.activation).toHaveBeenLastCalledWith(mocks.plan, "BI");
    expect(result.current.cardPath).toBe("BI");
    expect(result.current.openModal).toBe(true);
  });
  it("restores BI selection after authentication", () => {
    vi.mocked(localStorage.getItem).mockImplementation((key) => ({ authToken: "token", serviceCode: "BI", openModalStorage: "activationModal" })[key] ?? null);
    const { result } = renderHook(() => useHomePageHooks());
    expect(result.current.cardPath).toBe("BI");
    expect(result.current.openModal).toBe(true);
  });
  it("preserves activation routing for other services", () => {
    const { result } = renderHook(() => useHomePageHooks());
    act(() => result.current.handleOpenModal("sendLink"));
    expect(result.current.cardPath).toBe("sendLink");
    expect(localStorage.setItem).toHaveBeenCalledWith("serviceCode", "sendLink");
    expect(mocks.catalog).toHaveBeenLastCalledWith("SendInvoice", true);
    expect(mocks.activation).toHaveBeenLastCalledWith(mocks.plan, "SendInvoice");
  });
});
