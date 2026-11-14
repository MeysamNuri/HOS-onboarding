import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import translations from "@/core/constants/errorMessaeg.json";
import OrderDetailsError from "./orderDetailsError";

vi.mock("react-redux", () => ({ useSelector: () => null }));
vi.mock("lottie-react", () => ({ default: () => null }));
afterEach(cleanup);

describe("order error message types", () => {
  it("translates the backend Message list", () => {
    render(<OrderDetailsError onClose={vi.fn()} messages={["The_Free_Service_Limit_For_This_ServiceType_Has_Been_Reached"]} />);
    expect(screen.getByRole("heading")).toHaveTextContent(translations.The_Free_Service_Limit_For_This_ServiceType_Has_Been_Reached);
  });

  it("translates a single message", () => {
    render(<OrderDetailsError onClose={vi.fn()} messages="Mobile_Is_Required" />);
    expect(screen.getByRole("heading")).toHaveTextContent(translations.Mobile_Is_Required);
  });

  it("translates all messages separately", () => {
    render(<OrderDetailsError onClose={vi.fn()} messages={["Mobile_Is_Required", "Serial_Is_Required"]} />);
    expect(screen.getByRole("heading")).toHaveTextContent(translations.Mobile_Is_Required + "، " + translations.Serial_Is_Required);
  });

  it.each([undefined, [], "", ["", " "]])("falls back to title for empty messages", (messages) => {
    render(<OrderDetailsError onClose={vi.fn()} messages={messages} title="عنوان خطا" />);
    expect(screen.getByRole("heading")).toHaveTextContent("عنوان خطا");
  });
});
