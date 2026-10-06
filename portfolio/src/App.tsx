import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { AboutPage } from "./features/about/AboutPage";
import { useLanguage } from "./hooks/useLanguage";
import { useTheme } from "./hooks/useTheme";
import CurriculumVitae from "./pages/CurriculumVitae";
import Projects from "./pages/Projects";
import AlbumPreview from "./pages/albums/AlbumPreview";
import Album from "./pages/albums/Album";
import NotFound from "./pages/exceptions/NotFound";
import { useTranslation } from "react-i18next";

export default function App() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <AppShell
      language={language}
      onLanguageChange={setLanguage}
      theme={theme}
      onThemeToggle={toggleTheme}
    >
      <Routes>
        <Route path="/" element={<AboutPage language={language} />} />
        <Route
          path="/curriculum-vitae"
          element={<CurriculumVitae isDarkMode={isDarkMode} t={t} />}
        />
        <Route path="/projects" element={<Projects isDarkMode={isDarkMode} t={t} />} />
        <Route path="/albums" element={<AlbumPreview isDarkMode={isDarkMode} t={t} />} />
        <Route path="/albums/:albumID" element={<Album isDarkMode={isDarkMode} t={t} />} />
        <Route path="/links" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound t={t} />} />
      </Routes>
    </AppShell>
  );
}
