import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { flushSync } from "react-dom";
import { useLocation } from "react-router-dom";
import { AppShell } from "@/components/layout/app-shell";
import { NerdTerminal } from "@/features/terminal/NerdTerminal";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";
import type { Language } from "./preferences";
import { AppRouter } from "./router";
import { captureText, rewriteText } from "./textTransition";

function persistedNerdMode() {
  return typeof window !== "undefined" && window.sessionStorage.getItem("nerd-mode") === "active";
}

export default function App() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [interfaceTransition, setInterfaceTransition] = useState<"idle" | "language">("idle");
  const [nerdMode, setNerdMode] = useState(persistedNerdMode);
  const interfaceRoot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.sessionStorage.setItem("nerd-mode", nerdMode ? "active" : "inactive");
    if (!nerdMode) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [nerdMode]);

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
    >
      <div className={nerdMode ? "nerd-gui is-hidden" : "nerd-gui"} aria-hidden={nerdMode || undefined}>
        <AppShell
          language={language}
          onLanguageChange={changeLanguage}
          theme={theme}
          onThemeToggle={toggleTheme}
          nerdModeAvailable
          onNerdModeToggle={() => setNerdMode(true)}
        >
          <AppRouter language={language} />
        </AppShell>
      </div>
      {nerdMode && <NerdTerminal onExit={() => setNerdMode(false)} />}
    </div>
  );
}
