import { beforeAll, describe, expect, it, vi } from "vitest";
import { installApp } from "./installApp";

beforeAll(() => {
  vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: false })));
});

function dispatchPrompt(outcome: "accepted" | "dismissed") {
  const event = new Event("beforeinstallprompt", { cancelable: true });
  const prompt = vi.fn().mockResolvedValue(undefined);
  Object.assign(event, { prompt, userChoice: Promise.resolve({ outcome }) });
  window.dispatchEvent(event);
  return { event, prompt };
}

describe("installApp", () => {
  it("returns unavailable without a browser installation event", async () => {
    expect(await installApp()).toBe("unavailable");
  });

  it("captures an early event and prompts only once", async () => {
    const { event, prompt } = dispatchPrompt("accepted");
    expect(event.defaultPrevented).toBe(true);
    const installation = installApp();
    expect(prompt).toHaveBeenCalledOnce();
    expect(await installApp()).toBe("pending");
    expect(await installation).toBe("accepted");
    expect(await installApp()).toBe("unavailable");
  });

  it("handles dismissal without reusing the consumed prompt", async () => {
    dispatchPrompt("dismissed");
    expect(await installApp()).toBe("dismissed");
    expect(await installApp()).toBe("unavailable");
  });

  it("releases the pending state after an error", async () => {
    const { prompt } = dispatchPrompt("accepted");
    prompt.mockRejectedValueOnce(new Error("Installation failed"));
    await expect(installApp()).rejects.toThrow("Installation failed");
    expect(await installApp()).toBe("unavailable");
  });

  it("does not prompt after installation", async () => {
    const { prompt } = dispatchPrompt("accepted");
    window.dispatchEvent(new Event("appinstalled"));
    expect(await installApp()).toBe("installed");
    expect(prompt).not.toHaveBeenCalled();
  });
});
