import { useEffect, useRef, useState, type AnimationEvent } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { useLanguage } from "../hooks/useLanguage";
import { useTheme } from "../hooks/useTheme";
import type { Language } from "./preferences";
import { AppRouter } from "./router";

export default function App() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [interfaceTransition, setInterfaceTransition] = useState<"idle" | "out" | "in">("idle");
  const pendingUpdate = useRef<(() => void | Promise<void>) | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (language === "en") url.searchParams.delete("lang");
    else url.searchParams.set("lang", language);
    if (theme === "light") url.searchParams.delete("theme");
    else url.searchParams.set("theme", theme);
    window.history.replaceState(
      window.history.state,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  }, [language, location.key, theme]);

  function transitionInterface(update: () => void | Promise<void>) {
    if (interfaceTransition !== "idle") return;
    pendingUpdate.current = update;
    setInterfaceTransition("out");
  }

  async function finishInterfaceTransition(event: AnimationEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;

    if (interfaceTransition === "out") {
      await pendingUpdate.current?.();
      pendingUpdate.current = null;
      setInterfaceTransition("in");
      return;
    }

    if (interfaceTransition === "in") setInterfaceTransition("idle");
  }

  function changeLanguage(next: Language) {
    if (next !== language) {
      transitionInterface(async () => {
        await i18n.changeLanguage(next);
        setLanguage(next);
      });
    }
  }

  return (
    <div
      className={`interface-transition interface-transition-${interfaceTransition}`}
      onAnimationEnd={finishInterfaceTransition}
    >
      <AppShell
        language={language}
        onLanguageChange={changeLanguage}
        theme={theme}
        onThemeToggle={() => transitionInterface(toggleTheme)}
      >
        <AppRouter language={language} />
      </AppShell>
    </div>
  );
}
