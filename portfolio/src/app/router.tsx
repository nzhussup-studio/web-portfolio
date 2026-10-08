import { useEffect, useState, type AnimationEvent } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { PageState } from "@/components/feedback/page-state";
import { AboutPage } from "@/features/about/AboutPage";
import { AlbumDetailPage } from "@/features/albums/AlbumDetailPage";
import { AlbumsPage } from "@/features/albums/AlbumsPage";
import { CVPage } from "@/features/cv/CVPage";
import { ProjectsPage } from "@/features/projects/ProjectsPage";
import type { Language } from "./preferences";
import { shouldTransitionPage } from "./routeTransition";

export function AppRouter({ language }: { language: Language }) {
  const { t } = useTranslation();
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transition, setTransition] = useState<"idle" | "out" | "in">("idle");

  useEffect(() => {
    if (shouldTransitionPage(displayLocation.pathname, location.pathname)) {
      setTransition("out");
    } else if (location.key !== displayLocation.key) {
      setDisplayLocation(location);
    }
  }, [displayLocation, location]);

  function finishTransition(event: AnimationEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;

    if (transition === "out") {
      setDisplayLocation(location);
      setTransition("in");
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    if (transition === "in") setTransition("idle");
  }

  return (
    <div
      className={`route-transition route-transition-${transition}`}
      onAnimationEnd={finishTransition}
    >
      <Routes location={displayLocation}>
        <Route path="/" element={<AboutPage language={language} />} />
        <Route path="/curriculum-vitae" element={<CVPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/albums" element={<AlbumsPage />} />
        <Route path="/albums/:albumID" element={<AlbumDetailPage />} />
        <Route path="/links" element={<Navigate to="/" replace />} />
        <Route
          path="*"
          element={(
            <PageState
              eyebrow="404 / lost"
              title={t("exceptions.not_found.title")}
              message={t("exceptions.not_found.description")}
              link={{ label: t("exceptions.not_found.back"), to: "/" }}
            />
          )}
        />
      </Routes>
    </div>
  );
}
