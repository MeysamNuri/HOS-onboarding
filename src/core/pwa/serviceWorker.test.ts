import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { beforeEach, describe, expect, it, vi } from "vitest";

const workerSource = readFileSync(resolve("public/sw.js"), "utf8");
const origin = "https://holoo.example";
const cacheName = "holoo-onboarding-offline-v1";

type WorkerEvent = {
  request?: Request;
  waitUntil: (promise: Promise<unknown>) => void;
  respondWith: (promise: Promise<Response>) => void;
};

describe("PWA service worker", () => {
  let listeners: Record<string, (event: WorkerEvent) => void>;
  const fetchMock = vi.fn();
  const addAll = vi.fn();
  const match = vi.fn();
  const put = vi.fn();
  const cachesMock = {
    open: vi.fn(),
    keys: vi.fn(),
    delete: vi.fn(),
  };
  const skipWaiting = vi.fn();
  const claim = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    listeners = {};
    addAll.mockResolvedValue(undefined);
    match.mockResolvedValue(new Response("offline page"));
    cachesMock.open.mockResolvedValue({ addAll, match, put });
    cachesMock.keys.mockResolvedValue([]);
    cachesMock.delete.mockResolvedValue(true);
    fetchMock.mockResolvedValue(new Response("live content"));

    class WorkerRequest extends Request {
      constructor(input: string, options?: RequestInit) {
        super(new URL(input, origin), options);
      }
    }

    runInNewContext(workerSource, {
      self: {
        location: { origin },
        addEventListener: (name: string, callback: (event: WorkerEvent) => void) => {
          listeners[name] = callback;
        },
        skipWaiting,
        clients: { claim },
      },
      caches: cachesMock,
      fetch: fetchMock,
      URL,
      Request: WorkerRequest,
      Response,
    });
  });

  const dispatch = (name: string, request?: Request) => {
    const waitUntil = vi.fn();
    const respondWith = vi.fn();
    listeners[name]({ request, waitUntil, respondWith });
    return { waitUntil, respondWith };
  };

  const navigation = (path = "/orders?token=private") => {
    const request = new Request(origin + path);
    Object.defineProperty(request, "mode", { value: "navigate" });
    return request;
  };

  it("precaches only the public offline page and logo without credentials", async () => {
    const event = dispatch("install");
    await event.waitUntil.mock.calls[0][0];
    expect(cachesMock.open).toHaveBeenCalledWith(cacheName);
    const requests: Request[] = addAll.mock.calls[0][0];
    expect(requests.map((request) => request.url)).toEqual([
      origin + "/offline.html",
      origin + "/holooFavIcon.png",
    ]);
    expect(requests.every((request) => request.credentials === "omit" && request.cache === "reload")).toBe(true);
    expect(skipWaiting).not.toHaveBeenCalled();
  });

  it("rejects installation if the offline assets cannot be cached", async () => {
    addAll.mockRejectedValueOnce(new Error("Offline asset unavailable"));
    const event = dispatch("install");
    await expect(event.waitUntil.mock.calls[0][0]).rejects.toThrow("Offline asset unavailable");
  });

  it("cleans only this app's previous caches and does not claim open pages", async () => {
    cachesMock.keys.mockResolvedValueOnce([
      cacheName,
      "holoo-onboarding-offline-v0",
      "another-application-cache",
    ]);
    const event = dispatch("activate");
    await event.waitUntil.mock.calls[0][0];
    expect(cachesMock.delete).toHaveBeenCalledTimes(1);
    expect(cachesMock.delete).toHaveBeenCalledWith("holoo-onboarding-offline-v0");
    expect(claim).not.toHaveBeenCalled();
    expect(skipWaiting).not.toHaveBeenCalled();
  });

  it("passes navigation to the network without caching private content or URLs", async () => {
    const request = navigation();
    const event = dispatch("fetch", request);
    const response = await event.respondWith.mock.calls[0][0];
    expect(await response.text()).toBe("live content");
    expect(fetchMock).toHaveBeenCalledWith(request);
    expect(cachesMock.open).not.toHaveBeenCalled();
    expect(put).not.toHaveBeenCalled();
  });

  it("returns the offline page on navigation network failure", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("Failed to fetch"));
    const event = dispatch("fetch", navigation());
    const response = await event.respondWith.mock.calls[0][0];
    expect(await response.text()).toBe("offline page");
    expect(match).toHaveBeenCalledWith("/offline.html");
    expect(put).not.toHaveBeenCalled();
  });

  it("does not replace HTTP errors with an offline response", async () => {
    fetchMock.mockResolvedValueOnce(new Response("Unauthorized", { status: 401 }));
    const event = dispatch("fetch", navigation());
    expect((await event.respondWith.mock.calls[0][0]).status).toBe(401);
    expect(match).not.toHaveBeenCalled();
  });

  it("provides the original logo offline", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("Failed to fetch"));
    const event = dispatch("fetch", new Request(origin + "/holooFavIcon.png"));
    await event.respondWith.mock.calls[0][0];
    expect(match).toHaveBeenCalledWith("/holooFavIcon.png");
  });

  it("returns a controlled response if the offline cache has been evicted", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("Failed to fetch"));
    match.mockResolvedValueOnce(undefined);
    const event = dispatch("fetch", navigation());
    expect((await event.respondWith.mock.calls[0][0]).status).toBe(503);
  });

  it.each([
    new Request(origin + "/api/orders"),
    new Request(origin + "/payment", { method: "POST", body: "private" }),
    new Request("https://api.example/orders"),
    new Request(origin + "/private-document.pdf"),
    new Request(origin + "/assets/main.js"),
    new Request(origin + "/holooFavIcon.png?token=private"),
    new Request(origin + "/holooFavIcon.png", { headers: { Authorization: "Bearer private" } }),
    new Request(origin + "/holooFavIcon.png", { headers: { Range: "bytes=0-10" } }),
  ])("does not intercept API, private data or unrelated assets: %s", (request) => {
    const event = dispatch("fetch", request);
    expect(event.respondWith).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(cachesMock.open).not.toHaveBeenCalled();
  });
});
