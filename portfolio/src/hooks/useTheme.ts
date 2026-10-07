import { useCallback, useEffect, useState } from "react";
import { resolveTheme, type Theme } from "../app/preferences";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return resolveTheme(new URLSearchParams(window.location.search).get("theme"));
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;

    const url = new URL(window.location.href);
    if (theme === "light") url.searchParams.delete("theme");
    else url.searchParams.set("theme", theme);
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  }, []);

  return { theme, toggleTheme };
}
