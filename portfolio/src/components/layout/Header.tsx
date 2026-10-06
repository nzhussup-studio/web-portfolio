import { Moon, Sun } from "lucide-react";
import { NavLink } from "react-router-dom";
import type { Language } from "../../app/preferences";
import type { Theme } from "../../app/preferences";

type HeaderProps = {
  language: Language;
  onLanguageChange: (language: Language) => void;
  theme: Theme;
  onThemeToggle: () => void;
};

const navigation = [
  { to: "/", en: "About", kz: "Мен туралы" },
  { to: "/curriculum-vitae", en: "CV", kz: "Түйіндеме" },
  { to: "/projects", en: "Projects", kz: "Жобалар" },
  { to: "/albums", en: "Albums", kz: "Альбомдар" },
] as const;

export function Header({
  language,
  onLanguageChange,
  theme,
  onThemeToggle,
}: HeaderProps) {
  return (
    <header className="site-header">
      <div className="site-container header-grid">
        <NavLink className="wordmark" to="/" aria-label="Nurzhanat Zhussup home">
          NZ<span aria-hidden="true">.</span>
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
          <button
            className="language-button"
            type="button"
            onClick={() => onLanguageChange(language === "en" ? "kz" : "en")}
            aria-label={language === "en" ? "Қазақ тіліне ауысу" : "Switch to English"}
          >
            {language === "en" ? "KZ" : "EN"}
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
