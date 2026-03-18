import { useState, useEffect } from "react";
import { updateParam } from "../utils/urlUtil";

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const DEFAULT_MODE = "light";

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const modeFromUrl = new URLSearchParams(window.location.search).get("mode");

    // Sync theme with URL or localStorage
    const mode = modeFromUrl || savedTheme || DEFAULT_MODE;
    setTheme(mode);
  }, []);

  const setTheme = (mode) => {
    const isDark = mode === "dark";
    setIsDarkMode(isDark);
    document.body.setAttribute("data-bs-theme", mode);
    localStorage.setItem("theme", mode);
  };

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setTheme(newTheme);

    // Update URL preserving other query parameters
    const newUrl = updateParam("mode", newTheme);
    window.history.replaceState(null, "", newUrl);
  };

  return [isDarkMode, toggleTheme];
};
