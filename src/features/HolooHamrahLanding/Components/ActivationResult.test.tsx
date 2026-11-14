import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, useLocation } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { store } from "@/core/constants/store";
import ActivationResult from "./ActivationResult";
import translations from "@/core/constants/errorMessaeg.json";

vi.mock("lottie-react", () => ({ default: () => null }));
vi.mock("@/core/components/customModal", () => ({ default: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }));
afterEach(cleanup);

function CurrentPath() {
  return <span data-testid="current-path">{useLocation().pathname}</span>;
}

const renderResult = (result?: object, showPath = false) => render(
  <Provider store={store}>
    <MemoryRouter initialEntries={[{ pathname: "/holoo-hamrah", state: { hamrahActivation: result } }]}>
      <ActivationResult />
      {showPath && <CurrentPath />}
    </MemoryRouter>
  </Provider>,
);

describe("Hamrah activation result", () => {
  it("shows the translated backend message in the error heading", () => {
    renderResult({ success: false, messages: ["GuaranteeDate_Is_Expired"] });
    expect(screen.getByRole("heading", { name: translations.GuaranteeDate_Is_Expired })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "بستن" })).toHaveClass("buttons-styles", "payment-error__close");
  });
  it("translates the exact free-service-limit code from Message", () => {
    renderResult({ success: false, messages: ["The_Free_Service_Limit_For_This_ServiceType_Has_Been_Reached"] });
    expect(screen.getByRole("heading", { name: translations.The_Free_Service_Limit_For_This_ServiceType_Has_Been_Reached })).toBeInTheDocument();
    expect(screen.queryByText("The_Free_Service_Limit_For_This_ServiceType_Has_Been_Reached")).not.toBeInTheDocument();
  });
  it("only offers closing the error modal and stays on the landing", () => {
    renderResult({ success: false, messages: ["خطای سرویس"] }, true);
    expect(screen.queryByRole("button", { name: "پرداخت مجدد" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "مشاهده بسته‌ها" })).not.toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "بستن" }));
    expect(screen.queryByText("خطای سرویس")).not.toBeInTheDocument();
    expect(screen.getByTestId("current-path")).toHaveTextContent("/holoo-hamrah");
  });
  it("shows selected package details on failure without order details", () => {
    renderResult({ success: false, messages: ["خطا"], selectedPlan: { name: "بسته پایه API", duration: 90, salesPrice: 0 } });
    expect(screen.getByText("بسته پایه API")).toBeInTheDocument();
    expect(screen.getByText("۹۰ روزه")).toBeInTheDocument();
    expect(screen.getByText("رایگان")).toBeInTheDocument();
  });
  it("shows a nonzero selected price in tomans", () => {
    renderResult({ success: false, messages: ["خطا"], selectedPlan: { name: "بسته پایه API", duration: 30, salesPrice: 100000 } });
    expect(screen.getByText(/تومان/)).toHaveTextContent("۱۰,۰۰۰ تومان");
    expect(screen.queryByText("رایگان")).not.toBeInTheDocument();
  });
  it("does not show a modal for an ordinary landing visit", () => {
    const { container } = renderResult();
    expect(container).toBeEmptyDOMElement();
  });
  it("shows the purchase information and clears the result on dismissal", () => {
    renderResult({ success: true, messages: [], orderDetails: { orders: [{ packetName: "هلو همراه رایگان", serial: "123", packetSalesPrice: 0 }] } });
    expect(screen.getByText("فرآیند فعالسازی بسته با موفقیت انجام شد")).toBeInTheDocument();
    expect(screen.getByText("هلو همراه رایگان")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "مشاهده راهنما" }));
    expect(screen.queryByText("فرآیند فعالسازی بسته با موفقیت انجام شد")).not.toBeInTheDocument();
  });
  it("shows the reserved and current packages using the original order response", () => {
    renderResult({ success: true, messages: [], orderDetails: { orders: [{ packetName: "بسته رزرو هلو همراه", isReserved: true, currentService: { packetName: "بسته فعلی هلو همراه" } }] } });
    expect(screen.getByText("خرید بسته رزرو با موفقیت انجام شد")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "بسته رزرو هلو همراه" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "بسته فعلی هلو همراه" })).toBeInTheDocument();
  });
  it("shows API errors on the landing", () => {
    renderResult({ success: false, messages: ["این بسته قبلاً فعال شده است"] });
    expect(screen.getByText("این بسته قبلاً فعال شده است")).toBeInTheDocument();
  });
});
