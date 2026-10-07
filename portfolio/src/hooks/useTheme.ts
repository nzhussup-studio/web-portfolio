import { useCallback, useEffect, useRef, useState } from "react";
import { resolveTheme, type Theme } from "../app/preferences";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return resolveTheme(new URLSearchParams(window.location.search).get("theme"));
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const transitionTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;

    const url = new URL(window.location.href);
    if (theme === "light") url.searchParams.delete("theme");
    else url.searchParams.set("theme", theme);
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  }, [theme]);

  useEffect(() => () => {
    window.clearTimeout(transitionTimer.current);
    document.documentElement.classList.remove("is-theme-transition");
  }, []);

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion) {
      window.clearTimeout(transitionTimer.current);
      root.classList.remove("is-theme-transition");
      void root.offsetWidth;
      root.classList.add("is-theme-transition");
      transitionTimer.current = window.setTimeout(() => {
        root.classList.remove("is-theme-transition");
      }, 700);
    }
    setTheme((current) => (current === "light" ? "dark" : "light"));
  }, []);

  return { theme, toggleTheme };
}
