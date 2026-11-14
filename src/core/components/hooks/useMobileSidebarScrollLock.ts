import { useLayoutEffect } from "react";

export function useMobileSidebarScrollLock(open: boolean) {
    useLayoutEffect(() => {
        if (!open) return;

        const scrollX = window.scrollX;
        const scrollY = window.scrollY;
        const root = document.documentElement;
        const body = document.body;
        const properties: [HTMLElement, string, string][] = [
            [root, "overflow", "hidden"],
            [root, "overscroll-behavior", "none"],
            [body, "position", "fixed"],
            [body, "top", -scrollY + "px"],
            [body, "left", -scrollX + "px"],
            [body, "width", "100%"],
        ];
        const previousStyles = properties.map(([element, property, value]) => {
            const previousValue = element.style.getPropertyValue(property);
            const priority = element.style.getPropertyPriority(property);
            element.style.setProperty(property, value);
            return { element, property, previousValue, priority };
        });

        return () => {
            previousStyles.forEach(({ element, property, previousValue, priority }) => {
                if (previousValue) {
                    element.style.setProperty(property, previousValue, priority);
                } else {
                    element.style.removeProperty(property);
                }
            });
            window.scrollTo({ left: scrollX, top: scrollY, behavior: "instant" });
        };
    }, [open]);
}
