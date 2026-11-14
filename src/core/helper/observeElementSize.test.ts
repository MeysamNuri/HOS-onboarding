import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { observeElementSize } from "./observeElementSize";

describe("observeElementSize", () => {
  let notify: () => void;
  let pendingFrame: FrameRequestCallback | undefined;
  let element: HTMLDivElement;
  let width: number;
  let height: number;
  let dispose: (() => void) | undefined;
  const disconnect = vi.fn();

  beforeEach(() => {
    width = 100;
    height = 50;
    element = document.createElement("div");
    vi.spyOn(element, "getBoundingClientRect").mockImplementation(() => ({ width, height }) as DOMRect);
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      pendingFrame = callback;
      return 1;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => { pendingFrame = undefined; });
    vi.stubGlobal("ResizeObserver", vi.fn().mockImplementation(function (callback: () => void) {
      notify = callback;
      return { observe: vi.fn(), disconnect };
    }));
  });

  afterEach(() => {
    dispose?.();
    dispose = undefined;
    pendingFrame = undefined;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  const flush = () => {
    const callback = pendingFrame;
    pendingFrame = undefined;
    callback?.(0);
  };

  it("defers resize writes and coalesces repeated notifications into one frame", () => {
    const callback = vi.fn();
    dispose = observeElementSize(element, callback);
    notify();
    notify();
    expect(callback).not.toHaveBeenCalled();
    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
    flush();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("ignores unchanged dimensions and handles actual width and height changes", () => {
    const callback = vi.fn();
    dispose = observeElementSize(element, callback);
    flush();
    notify();
    flush();
    expect(callback).toHaveBeenCalledTimes(1);
    width = 200;
    notify();
    flush();
    height = 80;
    notify();
    flush();
    expect(callback).toHaveBeenCalledTimes(3);
  });

  it("does not recurse when a size update triggers another observer notification", () => {
    const callback = vi.fn(() => notify());
    dispose = observeElementSize(element, callback);
    flush();
    flush();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("cancels pending work and disconnects on cleanup", () => {
    const callback = vi.fn();
    dispose = observeElementSize(element, callback);
    const staleFrame = pendingFrame;
    dispose();
    expect(disconnect).toHaveBeenCalled();
    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(1);
    staleFrame?.(0);
    notify();
    window.dispatchEvent(new Event("resize"));
    expect(callback).not.toHaveBeenCalled();
    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
  });

  it("falls back to window resize when ResizeObserver is unavailable", () => {
    vi.stubGlobal("ResizeObserver", undefined);
    const callback = vi.fn();
    dispose = observeElementSize(element, callback);
    flush();
    width = 200;
    window.dispatchEvent(new Event("resize"));
    flush();
    expect(callback).toHaveBeenCalledTimes(2);
  });
});
