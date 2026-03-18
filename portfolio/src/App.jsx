import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import AboutMe from "./pages/AboutMe";
import CurriculumVitae from "./pages/CurriculumVitae";
import Projects from "./pages/Projects";
import Links from "./pages/Links";
import NotFound from "./pages/exceptions/NotFound";
import Footer from "./components/Footer";
import { useTranslation } from "react-i18next";
import WarningPopup from "./components/WarningPopup";
import { useTheme } from "./hooks/useTheme";
import { useLanguage } from "./hooks/useLanguage";
import { Suspense } from "react";
import PageWrapper from "./utils/SmoothPage";
import AlbumPreview from "./pages/albums/AlbumPreview";
import Album from "./pages/albums/Album";

const App = () => {
  const { t, i18n } = useTranslation();
  const [isDarkMode, toggleDarkMode] = useTheme();
  const { changeLanguage } = useLanguage();
  const [showWarning, setShowWarning] = useState(false);
  const location = useLocation();

  // Display warning for certain languages and pages
  useEffect(() => {
    if (i18n.language === "de" || i18n.language === "kz") {
      if (
        location.pathname === "/curriculum-vitae" ||
        location.pathname === "/projects" ||
        location.pathname === "/albums"
      ) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    } else {
      setShowWarning(false);
    }
  }, [i18n.language, location.pathname]);

  return (
    <>
      <PageWrapper>
        <Navbar
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          changeLanguage={changeLanguage}
          t={t}
        />
        {showWarning && (
          <WarningPopup
            showWarning={showWarning}
            t={t}
            text={
              location.pathname === "/curriculum-vitae"
                ? t("warnings.partially_available")
                : t("warnings.only_available_in_english")
            }
          />
        )}

        <Suspense fallback={<div>Loading...</div>}>
          <Routes location={location}>
            <Route
              path='/'
              element={<AboutMe isDarkMode={isDarkMode} t={t} />}
            />
            <Route
              path='/curriculum-vitae'
              element={<CurriculumVitae isDarkMode={isDarkMode} t={t} />}
            />
            <Route
              path='/projects'
              element={<Projects isDarkMode={isDarkMode} t={t} />}
            />
            <Route
              path='/albums'
              element={<AlbumPreview isDarkMode={isDarkMode} t={t} />}
            />
            <Route
              path='/albums/:albumID'
              element={<Album isDarkMode={isDarkMode} t={t} />}
            />
            <Route path='/links' element={<Links t={t} />} />
            <Route path='*' element={<NotFound t={t} />} />
          </Routes>
        </Suspense>

        <Footer t={t} />
      </PageWrapper>
    </>
  );
};

export default App;
