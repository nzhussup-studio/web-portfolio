import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { resolveLanguage, type Language } from "@/app/preferences";

export function useLanguage() {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<Language>(() =>
    resolveLanguage(new URLSearchParams(window.location.search).get("lang")),
  );

  useEffect(() => {
    void i18n.changeLanguage(language);
    document.documentElement.lang = language;

    const url = new URL(window.location.href);
    if (language === "en") url.searchParams.delete("lang");
    else url.searchParams.set("lang", language);
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  }, [i18n, language]);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
  }, []);

  return { language, setLanguage };
}
