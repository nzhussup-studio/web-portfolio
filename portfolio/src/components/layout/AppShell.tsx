import type { PropsWithChildren } from "react";
import type { Language, Theme } from "../../app/preferences";
import { BackToTop } from "../navigation/BackToTop";
import { Header } from "../navigation/Header";
import { Footer } from "./Footer";

type AppShellProps = PropsWithChildren<{
  language: Language;
  onLanguageChange: (language: Language) => void;
  theme: Theme;
  onThemeToggle: () => void;
}>;

export function AppShell({
  children,
  language,
  onLanguageChange,
  theme,
  onThemeToggle,
}: AppShellProps) {
  return (
    <div className="app-shell">
      <Header
        language={language}
        onLanguageChange={onLanguageChange}
        theme={theme}
        onThemeToggle={onThemeToggle}
      />
      <main id="main-content">{children}</main>
      <BackToTop />
      <Footer />
    </div>
  );
}
