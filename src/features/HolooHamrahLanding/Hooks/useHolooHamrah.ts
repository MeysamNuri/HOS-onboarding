import { useEffect, useState } from "react";

export default function useHolooHamrah() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      return localStorage.getItem("holoo-hamrah-theme") === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("holoo-hamrah-theme", theme);
    } catch {
      return;
    }
  }, [theme]);

  return { theme, setTheme };
}
