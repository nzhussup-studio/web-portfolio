import { useEffect, useRef, useState, type AnimationEvent } from "react";
import { useTranslation } from "react-i18next";
import { flushSync } from "react-dom";
import { useLocation } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { useLanguage } from "../hooks/useLanguage";
import { useTheme } from "../hooks/useTheme";
import type { Language } from "./preferences";
import { AppRouter } from "./router";
import { captureText, rewriteText } from "./textTransition";

export default function App() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [interfaceTransition, setInterfaceTransition] = useState<"idle" | "out" | "in" | "language">("idle");
  const interfaceRoot = useRef<HTMLDivElement>(null);
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

  async function changeLanguage(next: Language) {
    const root = interfaceRoot.current;
    if (next === language || interfaceTransition !== "idle" || !root) return;

    const previousText = captureText(root);
    setInterfaceTransition("language");
    root.setAttribute("aria-busy", "true");
    await i18n.changeLanguage(next);
    flushSync(() => setLanguage(next));
    await rewriteText(root, previousText);
    root.removeAttribute("aria-busy");
    setInterfaceTransition("idle");
  }

  return (
    <div
      ref={interfaceRoot}
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
