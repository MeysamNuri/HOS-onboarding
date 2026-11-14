import { afterEach, describe, expect, it, vi } from "vitest";
import type { BaseQueryApi } from "@reduxjs/toolkit/query";
import { portfolioBaseQuery } from "./portfolioBaseQuery";

const api = {} as BaseQueryApi;

afterEach(() => vi.restoreAllMocks());

describe("offline portfolio API", () => {
  it("returns synthetic statistics without making a request", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const result = await portfolioBaseQuery("Statistics/GetStatistics", api, {});
    expect(result).toMatchObject({ data: { Status: true, Data: { activeUsersCount: 1200 } } });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("blocks account and payment operations without transmitting credentials", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    for (const url of ["Auth/GetToken", "Payment/Create", "User/GetUserInfo"]) {
      const result = await portfolioBaseQuery({ url, method: "POST", body: { token: "synthetic-test-value" } }, api, {});
      expect(result).toMatchObject({ error: { status: "CUSTOM_ERROR" } });
    }
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
