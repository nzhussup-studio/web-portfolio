import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { PageState } from "./components/feedback/PageState";
import { AboutPage } from "./features/about/AboutPage";
import { AlbumDetailPage } from "./features/albums/AlbumDetailPage";
import { AlbumsPage } from "./features/albums/AlbumsPage";
import { CVPage } from "./features/cv/CVPage";
import { ProjectsPage } from "./features/projects/ProjectsPage";
import { useLanguage } from "./hooks/useLanguage";
import { useTheme } from "./hooks/useTheme";
import { useTranslation } from "react-i18next";

export default function App() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <AppShell
      language={language}
      onLanguageChange={setLanguage}
      theme={theme}
      onThemeToggle={toggleTheme}
    >
      <Routes>
        <Route path="/" element={<AboutPage language={language} />} />
        <Route path="/curriculum-vitae" element={<CVPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/albums" element={<AlbumsPage />} />
        <Route path="/albums/:albumID" element={<AlbumDetailPage />} />
        <Route path="/links" element={<Navigate to="/" replace />} />
        <Route path="*" element={<PageState eyebrow="404 / lost" title={t("exceptions.not_found.title")} message={t("exceptions.not_found.description")} link={{ label: t("exceptions.not_found.back"), to: "/" }} />} />
      </Routes>
    </AppShell>
  );
}
