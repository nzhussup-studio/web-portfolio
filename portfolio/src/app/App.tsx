import { AppShell } from "../components/layout/AppShell";
import { useLanguage } from "../hooks/useLanguage";
import { useTheme } from "../hooks/useTheme";
import { AppRouter } from "./router";

export default function App() {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <AppShell
      language={language}
      onLanguageChange={setLanguage}
      theme={theme}
      onThemeToggle={toggleTheme}
    >
      <AppRouter language={language} />
    </AppShell>
  );
}
