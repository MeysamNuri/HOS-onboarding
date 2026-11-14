import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import useHamrahActivation from "./useHamrahActivation";
import type { IServicePacketOBG } from "@/core/types/models";

const simplePlan = { code: "Simple", name: "بسته پایه", duration: 30, salesPrice: 0 } as IServicePacketOBG;

const mocks = vi.hoisted(() => ({ navigate: vi.fn(), post: vi.fn(), payment: vi.fn(), details: vi.fn(), pathname: "/home" }));
vi.mock("react-router", () => ({ useNavigate: () => mocks.navigate, useLocation: () => ({ pathname: mocks.pathname, search: "" }) }));
vi.mock("@/features/Services/reducers/endpoints", () => ({
  usePostOrderMutation: () => [(payload: unknown) => ({ unwrap: () => mocks.post(payload) })],
  usePaymentDataMutation: () => [(payload: unknown) => ({ unwrap: () => mocks.payment(payload) })],
  useGetOrderMutation: () => [(payload: unknown) => ({ unwrap: () => mocks.details(payload) })],
}));

beforeEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
  mocks.pathname = "/home";
  mocks.post.mockResolvedValue({ Status: true, Data: { orderId: "order-1" }, Message: [] });
  mocks.payment.mockResolvedValue({ Status: true, Data: { isSuccess: true } });
  mocks.details.mockResolvedValue({ Status: true, Data: { orders: [{ serial: "123", packetName: "هلو همراه" }] } });
});
afterEach(cleanup);

const submit = async () => {
  const hook = renderHook(() => useHamrahActivation(simplePlan));
  await act(async () => hook.result.current.handleSubmit({ phone: "09121234567", serial: "123" }));
  return hook;
};

describe("Hamrah free activation", () => {
  it("passes the original Message list through to the error modal", async () => {
    const messages = ["The_Free_Service_Limit_For_This_ServiceType_Has_Been_Reached"];
    mocks.post.mockResolvedValue({ Status: false, Message: messages, Data: {} });
    await submit();
    expect(mocks.navigate.mock.calls[0][1].state.hamrahActivation.messages).toEqual(messages);
  });
  it("preserves backend errors when the envelope succeeds but the order fails", async () => {
    mocks.post.mockResolvedValue({ Status: true, Message: ["GuaranteeDate_Is_Expired"], Data: { isSuccess: false, orderId: "order-1" } });
    await submit();
    expect(mocks.payment).not.toHaveBeenCalled();
    expect(mocks.navigate.mock.calls[0][1].state.hamrahActivation).toMatchObject({ success: false, messages: ["GuaranteeDate_Is_Expired"] });
  });
  it("keeps backend messages if no order ID was returned", async () => {
    mocks.post.mockResolvedValue({ Status: true, Message: ["Mobile_Is_Required"], Data: {} });
    await submit();
    expect(mocks.navigate.mock.calls[0][1].state.hamrahActivation.messages).toEqual(["Mobile_Is_Required"]);
  });
  it("reads camel-case messages in rejected backend responses", async () => {
    mocks.post.mockRejectedValue({ data: { message: "Serial_Is_Required" } });
    await submit();
    expect(mocks.navigate.mock.calls[0][1].state.hamrahActivation.messages).toEqual(["Serial_Is_Required"]);
  });
  it.each(["Mobile_Is_Required", "GuaranteeDate_Is_Expired"] as const)("displays the backend's current error: %s", async (message) => {
    mocks.post.mockResolvedValue({ Status: false, Message: [message] });
    await submit();
    expect(mocks.navigate.mock.calls[0][1].state.hamrahActivation.messages).toEqual([message]);
  });

  it("translates rejected HTTP responses", async () => {
    mocks.post.mockRejectedValue({ data: { Message: ["Serial_Is_Required"] } });
    await submit();
    expect(mocks.navigate.mock.calls[0][1].state.hamrahActivation.messages).toEqual(["Serial_Is_Required"]);
  });

  it("retains translated errors when payment verification rejects", async () => {
    mocks.payment.mockRejectedValue({ data: { Message: ["Order_Exist"] } });
    await submit();
    expect(mocks.navigate.mock.calls[0][1].state.hamrahActivation.messages).toEqual(["Order_Exist"]);
  });

  it("retains order-detail errors instead of replacing them with a generic message", async () => {
    mocks.details.mockResolvedValue({ Status: false, Message: ["OrderId_Must_Be_Valid_Guid"] });
    await submit();
    expect(mocks.navigate.mock.calls[0][1].state.hamrahActivation.messages).toEqual(["OrderId_Must_Be_Valid_Guid"]);
  });

  it("translates the payment failure message", async () => {
    mocks.payment.mockResolvedValue({ Status: false, Message: ["Order_Exist"], Data: { isSuccess: false } });
    await submit();
    expect(mocks.navigate.mock.calls[0][1].state.hamrahActivation.messages).toEqual(["Order_Exist"]);
  });
  it("does not submit until the API package is available", async () => {
    const hook = renderHook(() => useHamrahActivation(undefined));
    await act(async () => hook.result.current.handleSubmit({ phone: "09121234567", serial: "123" }));
    expect(mocks.post).not.toHaveBeenCalled();
  });
  it("preserves selected package information when the order fails before an order ID exists", async () => {
    mocks.post.mockResolvedValue({ Status: false, Message: ["failed"] });
    await submit();
    expect(mocks.navigate.mock.calls[0][1].state.hamrahActivation.selectedPlan).toEqual(simplePlan);
  });
  it("submits the selected SendInvoice package and shows its error with the same package details", async () => {
    mocks.post.mockResolvedValue({ Status: false, Message: ["failed"] });
    const plan = { ...simplePlan, code: "simple", name: "اشتراک اسناد" };
    const hook = renderHook(() => useHamrahActivation(plan, "SendInvoice"));
    await act(async () => hook.result.current.handleSubmit({ phone: "09121234567", serial: "123" }));
    expect(mocks.post).toHaveBeenCalledWith(expect.objectContaining({ ServiceCode: "SendInvoice", PacketCode: "simple" }));
    expect(hook.result.current.errorResult?.selectedPlan).toEqual(plan);
    expect(mocks.navigate).not.toHaveBeenCalled();
  });
  it("preserves the existing invoice success destination", async () => {
    const hook = renderHook(() => useHamrahActivation(simplePlan, "SendInvoice"));
    await act(async () => hook.result.current.handleSubmit({ phone: "09121234567", serial: "123" }));
    expect(localStorage.setItem).toHaveBeenCalledWith("orderId", "order-1");
    expect(mocks.navigate).toHaveBeenCalledWith("/sendLink-help", { replace: true });
  });
  it("does not send an order when the user phone is missing", async () => {
    const hook = renderHook(() => useHamrahActivation(simplePlan));
    await act(async () => hook.result.current.handleSubmit({ phone: " ", serial: "123" }));
    expect(mocks.post).not.toHaveBeenCalled();
    expect(mocks.navigate.mock.calls[0][1].state.hamrahActivation.success).toBe(false);
  });
  it.each(["/home", "/holoo-hamrah"])("activates BI Simple from %s and carries purchase details to the landing", async (pathname) => {
    mocks.pathname = pathname;
    await submit();
    expect(mocks.post).toHaveBeenCalledWith(expect.objectContaining({ ServiceCode: "BI", PacketCode: "Simple", Serial: "123", Campaign: pathname }));
    expect(mocks.navigate).toHaveBeenCalledWith("/holoo-hamrah", expect.objectContaining({ state: { hamrahActivation: expect.objectContaining({ success: true, orderDetails: { orders: [{ serial: "123", packetName: "هلو همراه" }] } }) } }));
  });

  it("preserves reservation and current package details", async () => {
    const orderDetails = { orders: [{ serial: "123", isReserved: true, currentService: { packetName: "current" } }] };
    mocks.details.mockResolvedValue({ Status: true, Data: orderDetails });
    await submit();
    expect(mocks.navigate.mock.calls[0][1].state.hamrahActivation.orderDetails).toEqual(orderDetails);
  });

  it("routes rejected orders to the landing without confirming payment", async () => {
    mocks.post.mockResolvedValue({ Status: false, Message: ["The_Free_Service_Limit_For_This_ServiceType_Has_Been_Reached"] });
    await submit();
    expect(mocks.payment).not.toHaveBeenCalled();
    expect(mocks.navigate.mock.calls[0][1].state.hamrahActivation).toMatchObject({ success: false, messages: [expect.any(String)] });
  });

  it("preserves order details for unsuccessful payments", async () => {
    mocks.payment.mockResolvedValue({ Status: true, Data: { isSuccess: false } });
    await submit();
    expect(mocks.navigate.mock.calls[0][1].state.hamrahActivation).toMatchObject({ success: false, orderDetails: { orders: [{ serial: "123" }] } });
  });

  it("does not claim success when details cannot be retrieved", async () => {
    mocks.details.mockRejectedValue(new Error("offline"));
    await submit();
    expect(mocks.navigate.mock.calls[0][1].state.hamrahActivation.success).toBe(false);
  });

  it("shows an error on the landing after network failure", async () => {
    mocks.post.mockRejectedValue(new Error("offline"));
    const hook = await submit();
    expect(hook.result.current.isSubmitting).toBe(false);
    expect(mocks.navigate.mock.calls[0][1].state.hamrahActivation).toMatchObject({ success: false, messages: [expect.any(String)] });
  });

  it("prevents duplicate orders while submission is pending", async () => {
    const hook = renderHook(() => useHamrahActivation(simplePlan));
    await act(async () => {
      await Promise.all([
        hook.result.current.handleSubmit({ phone: "09121234567", serial: "123" }),
        hook.result.current.handleSubmit({ phone: "09121234567", serial: "123" }),
      ]);
    });
    expect(mocks.post).toHaveBeenCalledTimes(1);
  });
});
