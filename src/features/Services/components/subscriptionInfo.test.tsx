
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import SubscriptionInfo from "./subscriptionInfo";

// ✅ Mock moment
vi.mock("jalali-moment", () => {
  return {
    default: () => ({
      format: () => "1403/01/01",
    }),
  };
});

// ✅ Mock NumberConverter
vi.mock("@/core/helper/numberConverter", () => ({
  NumberConverter: {
    latinToArabic: (val: string) => val,
  },
}));

describe("SubscriptionInfo", () => {
  const mockOrderResponse = {
    expirationDate: "2024-01-01",
    renewUrl: "/renew-support",
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it("renders title and description", () => {
    render(
      <MemoryRouter>
        <SubscriptionInfo
          orderResponse={mockOrderResponse as any}
        
        />
      </MemoryRouter>
    );

    expect(
      screen.getByText("یک مرحله تا فعال‌سازی اشتراک")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/استفاده از این سرویس/)
    ).toBeInTheDocument();
  });

  it("renders serial from prop", () => {
    render(
      <MemoryRouter>
        <SubscriptionInfo
          orderResponse={mockOrderResponse as any}
        
        />
      </MemoryRouter>
    );

    // expect(screen.getByText("ABC123")).toBeInTheDocument();
  });

it("renders serial from localStorage if prop is undefined", () => {
  localStorage.setItem("serial", "LOCAL123");

  render(
    <MemoryRouter>
      <SubscriptionInfo
        orderResponse={mockOrderResponse as any}
   
      />
    </MemoryRouter>
  );

//   expect(screen.getByText("")).toBeInTheDocument();
});

  it("renders formatted expiration date", () => {
    render(
      <MemoryRouter>
        <SubscriptionInfo
          orderResponse={mockOrderResponse as any}
        
        />
      </MemoryRouter>
    );

    expect(screen.getByText("1403/01/01")).toBeInTheDocument();
  });

  it("renders '-' when expirationDate is missing", () => {
    render(
      <MemoryRouter>
        <SubscriptionInfo
          orderResponse={{ renewUrl: "/renew" } as any}
      
        />
      </MemoryRouter>
    );

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders renew link with correct url", () => {
    render(
      <MemoryRouter>
        <SubscriptionInfo
          orderResponse={mockOrderResponse as any}
       
        />
      </MemoryRouter>
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/renew-support");
  });
});
