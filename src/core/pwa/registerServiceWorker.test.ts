import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { registerServiceWorker } from "./registerServiceWorker";

describe("registerServiceWorker", () => {
  const register = vi.fn();

  beforeEach(() => {
    vi.stubEnv("PROD", true);
    vi.stubGlobal("isSecureContext", true);
    vi.stubGlobal("navigator", { serviceWorker: { register } });
    vi.spyOn(document, "readyState", "get").mockReturnValue("complete");
    register.mockResolvedValue({});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it("registers a root-scoped worker without HTTP-cache updates in production", () => {
    registerServiceWorker();
    expect(register).toHaveBeenCalledWith("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
  });

  it("waits for page load and registers only once", () => {
    vi.spyOn(document, "readyState", "get").mockReturnValue("loading");
    registerServiceWorker();
    expect(register).not.toHaveBeenCalled();
    window.dispatchEvent(new Event("load"));
    window.dispatchEvent(new Event("load"));
    expect(register).toHaveBeenCalledTimes(1);
  });

  it("does not register during development", () => {
    vi.stubEnv("PROD", false);
    registerServiceWorker();
    expect(register).not.toHaveBeenCalled();
  });

  it("does not register on insecure origins", () => {
    vi.stubGlobal("isSecureContext", false);
    registerServiceWorker();
    expect(register).not.toHaveBeenCalled();
  });

  it("supports browsers without service workers", () => {
    vi.stubGlobal("navigator", {});
    expect(registerServiceWorker).not.toThrow();
    expect(register).not.toHaveBeenCalled();
  });

  it("handles registration failure without breaking the app", async () => {
    const error = new Error("Worker unavailable");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    register.mockRejectedValueOnce(error);
    registerServiceWorker();
    await vi.waitFor(() => {
      expect(warn).toHaveBeenCalledWith("PWA service worker registration failed:", error);
    });
  });
});
