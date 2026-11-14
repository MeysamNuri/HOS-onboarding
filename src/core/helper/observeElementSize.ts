export const observeElementSize = (element: Element, onResize: () => void) => {
  let frame: number | undefined;
  let disposed = false;
  let previousWidth: number | undefined;
  let previousHeight: number | undefined;

  const measure = () => {
    frame = undefined;
    if (disposed) return;
    const { width, height } = element.getBoundingClientRect();
    if (width === previousWidth && height === previousHeight) return;
    previousWidth = width;
    previousHeight = height;
    onResize();
  };

  const schedule = () => {
    if (!disposed && frame === undefined) frame = window.requestAnimationFrame(measure);
  };

  const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(schedule);
  observer?.observe(element);
  window.addEventListener("resize", schedule);
  schedule();

  return () => {
    disposed = true;
    observer?.disconnect();
    window.removeEventListener("resize", schedule);
    if (frame !== undefined) window.cancelAnimationFrame(frame);
  };
};
