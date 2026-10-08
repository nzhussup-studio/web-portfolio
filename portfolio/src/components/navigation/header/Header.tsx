import { Moon, SquareTerminal, Sun } from "lucide-react";
import { NavLink } from "react-router-dom";
import type { Language, Theme } from "@/app/preferences";
import { BrandMark } from "@/components/ui/brand-mark";
import { IconButton } from "@/components/ui/icon-button";
import "./Header.css";

type HeaderProps = {
  language: Language;
  onLanguageChange: (language: Language) => void;
  theme: Theme;
  onThemeToggle: () => void;
  nerdModeAvailable?: boolean;
  onNerdModeToggle?: () => void;
};

const navigation = [
  { to: "/", en: "About", kk: "Мен туралы" },
  { to: "/curriculum-vitae", en: "CV", kk: "Түйіндеме" },
  { to: "/projects", en: "Projects", kk: "Жобалар" },
  { to: "/albums", en: "Albums", kk: "Альбомдар" },
] as const;

export function Header({
  language,
  onLanguageChange,
  theme,
  onThemeToggle,
  nerdModeAvailable = false,
  onNerdModeToggle,
}: HeaderProps) {
  return (
    <header className="site-header">
      <div className="site-container header-grid">
        <BrandMark className="wordmark" theme={theme} />

        <nav className="primary-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) => (isActive ? "nav-link is-active" : "nav-link")}
            >
              {item[language]}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          {nerdModeAvailable && (
            <>
              <IconButton
                className="nerd-mode-toggle"
                onClick={onNerdModeToggle}
                aria-label="Enter Nerd Mode"
                title="Nerd Mode"
              >
                <SquareTerminal aria-hidden="true" />
              </IconButton>
              <span className="header-divider" aria-hidden="true" />
            </>
          )}
          <button
            className="language-button"
            type="button"
            onClick={() => onLanguageChange(language === "en" ? "kk" : "en")}
            aria-label={language === "en" ? "Қазақ тіліне ауысу" : "Switch to English"}
          >
            {language === "en" ? "KK" : "EN"}
          </button>
          <span className="header-divider" aria-hidden="true" />
          <IconButton
            className="theme-toggle"
            onClick={onThemeToggle}
            aria-label={theme === "light" ? "Use dark theme" : "Use light theme"}
          >
            {theme === "light" ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
          </IconButton>
        </div>
      </div>
    </header>
  );
}
