import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { updateParam, getCurrentParams } from "../utils/urlUtil";

export const useLanguage = () => {
  const { i18n } = useTranslation();

  // App remembers the chosen language only one day. Then it resets to en.
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const DEFAULT_LANGUAGE = "en";

  const resetLanguage = (i18n, defaultLanguage = DEFAULT_LANGUAGE) => {
    i18n.changeLanguage(defaultLanguage);
    localStorage.setItem("language", defaultLanguage);
    localStorage.setItem("language_timestamp", Date.now().toString());
  };

  useEffect(() => {
    const langFromUrl = new URLSearchParams(window.location.search).get("lang");
    const savedLang = localStorage.getItem("language");
    const savedTimestamp = localStorage.getItem("language_timestamp");

    if (langFromUrl) {
      changeLanguage(langFromUrl);
    } else if (savedLang && savedTimestamp) {
      const currentTime = Date.now();
      const elapsedTime = currentTime - parseInt(savedTimestamp, 10);
      if (elapsedTime < ONE_DAY_MS) {
        changeLanguage(savedLang);
      } else {
        resetLanguage(i18n);
      }
    }
  }, [i18n]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);

    // Update localStorage
    const currentTime = Date.now();
    localStorage.setItem("language", lang);
    localStorage.setItem("language_timestamp", currentTime.toString());

    // Update URL preserving hash but don't add default language to URL
    const currentParams = getCurrentParams();
    const DEFAULT_LANGUAGE = "en";

    // Only update URL if language is non-default or other params exist
    if (lang !== DEFAULT_LANGUAGE || Object.keys(currentParams).length > 0) {
      const newUrl = updateParam("lang", lang);
      window.history.replaceState(null, "", newUrl);
    }
  };

  return { changeLanguage };
};
