import { Moon, SquareTerminal, Sun } from "lucide-react";
import { NavLink } from "react-router-dom";
import type { Language } from "../../app/preferences";
import type { Theme } from "../../app/preferences";

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
        <NavLink className="wordmark" to="/" aria-label="Nurzhanat Zhussup home">
          <img src={`/brand/nz-${theme}.svg`} alt="" aria-hidden="true" />
        </NavLink>

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
              <button
                className="icon-button nerd-mode-toggle"
                type="button"
                onClick={onNerdModeToggle}
                aria-label="Enter Nerd Mode"
                title="Nerd Mode"
              >
                <SquareTerminal aria-hidden="true" />
              </button>
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
          <button
            className="icon-button"
            type="button"
            onClick={onThemeToggle}
            aria-label={theme === "light" ? "Use dark theme" : "Use light theme"}
          >
            {theme === "light" ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
}
