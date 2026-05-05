import { useEffect } from "react";

export function useThemeFollowsOS() {
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = (matches: boolean) => {
      document.documentElement.setAttribute(
        "data-theme",
        matches ? "dark" : "light",
      );
    };
    apply(mql.matches);
    const handler = (e: MediaQueryListEvent) => apply(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
}
