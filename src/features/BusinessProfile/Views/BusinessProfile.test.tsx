import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { transferableAbortController } from "node:util";
import userEvent from "@testing-library/user-event";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { baseApi } from "@/core/api/baseApi";
import { BusinessProfileRoutes } from "../routes";
import type { BusinessProfile } from "../types";

vi.mock("@/core/api/portfolioBaseQuery", async () => {
  const { fetchBaseQuery } = await import("@reduxjs/toolkit/query/react");
  return { portfolioBaseQuery: fetchBaseQuery({ baseUrl: "https://api.example.invalid/api" }) };
});

const profile: BusinessProfile = {
  name: "لوازم یدکی نمونه",
  tagline: "بهترین قطعات خودرو",
  introduction: "معرفی فروشگاه نمونه",
  productsDescription: "قطعات مصرفی و لوازم جانبی",
  successStory: "داستان موفقیت فروشگاه",
  phones: ["00000000000"],
  address: "نشانی نمایشی — فاقد موقعیت واقعی",
  website: "https://portfolio.invalid",
  banner: {
    imageUrl: "https://portfolio.invalid/banner.png",
    alt: "فروش ویژه",
    link: "https://portfolio.invalid/sale",
  },
  map: {
    imageUrl: "https://portfolio.invalid/map.png",
    link: "https://portfolio.invalid/map",
  },
  socialLinks: [{ platform: "telegram", url: "https://portfolio.invalid/example" }],
};
const stores: ReturnType<typeof makeStore>[] = [];
function makeStore() {
  return configureStore({
    reducer: { [baseApi.reducerPath]: baseApi.reducer },
    middleware: (getDefault) => getDefault().concat(baseApi.middleware),
  });
}
function renderPage(slug = "mohammadnia") {
  const store = makeStore();
  stores.push(store);
  const router = createMemoryRouter(BusinessProfileRoutes, {
    initialEntries: ["/business/" + slug],
  });
  render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>,
  );
  return router;
}
function response(data = profile) {
  return new Response(JSON.stringify({ Status: true, Data: data }), {
    headers: { "Content-Type": "application/json" },
  });
}

beforeEach(() => {
  vi.stubEnv("VITE_BUSINESS_PROFILE_USE_API", "true");
  vi.stubGlobal(
    "AbortController",
    class {
      constructor() {
        return transferableAbortController();
      }
    },
  );
});

afterEach(() => {
  vi.unstubAllEnvs();
  cleanup();
  stores
    .splice(0)
    .forEach((store) => store.dispatch(baseApi.util.resetApiState()));
  vi.unstubAllGlobals();
});

describe("BusinessProfile route and API", () => {
  it("shows the design data without requesting the backend by default", async () => {
    vi.stubEnv("VITE_BUSINESS_PROFILE_USE_API", undefined);
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    renderPage();
    expect(await screen.findByRole("heading", { level: 1, name: "لوازم یدکی نمونه" })).toBeInTheDocument();
    expect(screen.getByText("نشانی نمایشی — فاقد موقعیت واقعی")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /فروش ویژه/ })).toHaveAttribute("src", expect.stringContaining("demo-banner.png"));
    expect(screen.getByRole("img", { name: /موقعیت لوازم/ })).toHaveAttribute("src", expect.stringContaining("demo-map.png"));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("requests the slug and renders the business and working contact links", async () => {
    const fetchMock = vi.fn().mockResolvedValue(response());
    vi.stubGlobal("fetch", fetchMock);
    renderPage("فروشگاه");
    expect(
      await screen.findByRole("heading", { level: 1, name: profile.name }),
    ).toBeInTheDocument();
    const request = fetchMock.mock.calls[0][0] as Request;
    expect(new URL(request.url).pathname).toBe("/api/Business/GetBySlug");
    expect(new URL(request.url).searchParams.get("slug")).toBe("فروشگاه");
    expect(
      screen.getByRole("link", { name: profile.phones[0] }),
    ).toHaveAttribute("href", "tel:00000000000");
    expect(screen.getByRole("link", { name: "تلگرام" })).toHaveAttribute(
      "href",
      "https://portfolio.invalid/example",
    );
    expect(screen.getByRole("link", { name: "فروش ویژه" })).toHaveAttribute(
      "href",
      "https://portfolio.invalid/sale",
    );
    expect(
      screen.getByRole("heading", { name: "ویترین محصولات" }),
    ).toBeInTheDocument();
    expect(document.title).toContain(profile.name);
  });
  it("shows a loading state, then a not found state for HTTP 404", async () => {
    let resolveResponse!: (value: Response) => void;
    vi.stubGlobal(
      "fetch",
      vi.fn(
        () =>
          new Promise<Response>((resolve) => {
            resolveResponse = resolve;
          }),
      ),
    );
    renderPage();
    expect(screen.getByRole("status")).toHaveTextContent("در حال دریافت");
    await waitFor(() => expect(resolveResponse).toBeDefined());
    await act(async () => resolveResponse(new Response("{}", { status: 404 })));
    expect(
      await screen.findByRole("heading", { name: "کسب‌وکار پیدا نشد" }),
    ).toBeInTheDocument();
  });
  it("allows retrying a failed request", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(new Response("{}", { status: 500 }))
        .mockResolvedValueOnce(response()),
    );
    renderPage();
    await userEvent.click(
      await screen.findByRole("button", { name: "تلاش مجدد" }),
    );
    expect(
      await screen.findByRole("heading", { level: 1, name: profile.name }),
    ).toBeInTheDocument();
  });
  it("fetches a new profile on slug navigation without showing the previous business", async () => {
    let resolveNext!: (value: Response) => void;
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(response())
      .mockImplementationOnce(
        () =>
          new Promise<Response>((resolve) => {
            resolveNext = resolve;
          }),
      );
    vi.stubGlobal("fetch", fetchMock);
    const router = renderPage();
    await screen.findByRole("heading", { level: 1, name: profile.name });
    await act(async () => {
      await router.navigate("/business/second");
    });
    expect(
      screen.queryByRole("heading", { level: 1, name: profile.name }),
    ).not.toBeInTheDocument();
    await waitFor(() => expect(resolveNext).toBeDefined());
    await act(async () =>
      resolveNext(response({ ...profile, name: "فروشگاه دوم" })),
    );
    expect(
      await screen.findByRole("heading", { level: 1, name: "فروشگاه دوم" }),
    ).toBeInTheDocument();
    expect(
      new URL((fetchMock.mock.calls[1][0] as Request).url).searchParams.get(
        "slug",
      ),
    ).toBe("second");
  });
  it("omits absent optional sections and unsafe external links", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          response({
            name: "فروشگاه",
            introduction: "توضیحات",
            phones: [],
            website: "javascript:alert(1)",
          }),
        ),
    );
    renderPage();
    await screen.findByRole("heading", { level: 1, name: "فروشگاه" });
    expect(
      screen.queryByRole("heading", { name: "ویترین محصولات" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", { name: "شبکه‌های اجتماعی" }),
    ).not.toBeInTheDocument();
    expect(document.querySelector('a[href^="javascript:"]')).toBeNull();
  });
});
