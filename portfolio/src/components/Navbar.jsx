import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { buildUrl, getCurrentParams } from "../utils/urlUtil";

const Navbar = ({ isDarkMode, toggleDarkMode, changeLanguage, t }) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 991);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const collapseVariants = {
    open: { height: "auto", opacity: 1 },
    collapsed: { height: 0, opacity: 0 },
  };

  const dropdownVariants = {
    open: { opacity: 1, scale: 1, display: "block" },
    collapsed: { opacity: 0, scale: 0.95, display: "none" },
  };

  const handlePageChange = (path) => {
    // Get all current query parameters and preserve them
    const currentParams = getCurrentParams();
    const urlWithParams = buildUrl(path, currentParams);

    setTimeout(() => {
      navigate(urlWithParams, { replace: true });
    }, 130);
  };

  const closeNavbar = () => setIsCollapsed(true);
  const closeDropdown = () => setIsDropdownOpen(false);

  const navItems = [
    { label: t("navbar.about_me"), path: "/" },
    { label: t("navbar.cv"), path: "/curriculum-vitae" },
    { label: t("navbar.projects"), path: "/projects" },
    { label: t("navbar.albums"), path: "/albums" },
    { label: t("navbar.links"), path: "/links" },
  ];

  const renderNavItems = () =>
    navItems.map((item) => (
      <li className='nav-item' key={item.path}>
        <button
          className={`nav-link ${isDarkMode ? "text-white" : "text-black"}`}
          onClick={() => {
            handlePageChange(item.path);
            closeDropdown();
            closeNavbar();
          }}
        >
          {item.label}
        </button>
      </li>
    ));

  const renderDropdown = () => (
    <li className='nav-item dropdown ms-2 ms-sm-3'>
      <button
        className={`btn btn-sm dropdown-toggle ${
          isDarkMode ? "btn-secondary" : "btn-light"
        }`}
        id='languageDropdown'
        aria-expanded='false'
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {t("navbar.language")}
      </button>
      <motion.ul
        className='dropdown-menu'
        aria-labelledby='languageDropdown'
        initial='collapsed'
        animate={isDropdownOpen ? "open" : "collapsed"}
        variants={dropdownVariants}
        transition={{ duration: 0.3 }}
      >
        {["en", "de", "kz"].map((lang) => (
          <li key={lang}>
            <button
              className='dropdown-item'
              onClick={() => {
                changeLanguage(lang);
                closeDropdown();
                closeNavbar();
              }}
            >
              {lang === "en" && "english 🇬🇧"}
              {lang === "de" && "deutsch 🇩🇪"}
              {lang === "kz" && "қазақша 🇰🇿"}
            </button>
          </li>
        ))}
      </motion.ul>
    </li>
  );

  const renderDarkModeToggle = () => (
    <li className='nav-item ms-2 ms-sm-3'>
      <div className='form-check form-switch'>
        <input
          className='form-check-input'
          type='checkbox'
          id='darkModeToggle'
          checked={isDarkMode}
          onChange={toggleDarkMode}
        />
        <label className='form-check-label' htmlFor='darkModeToggle'>
          🌚
        </label>
      </div>
    </li>
  );

  return (
    <nav
      className={`navbar navbar-expand-lg ${
        isDarkMode ? "navbar-dark bg-dark" : "navbar-light"
      } border-bottom`}
    >
      <div className='container'>
        {/* Brand */}
        <a
          href='#'
          className='navbar-brand d-flex align-items-center gap-2 text-decoration-none'
          onClick={() => handlePageChange("/")}
        >
          <svg className='bi' width='40' height='32'>
            <use xlinkHref='#bootstrap'></use>
          </svg>
          <span className={`fs-4 ${isDarkMode ? "text-white" : "text-dark"}`}>
            👨🏽‍💻 nurzhanat zhussup
          </span>
        </a>

        {/* Toggle Button for Mobile */}
        {isMobile && (
          <button
            className='navbar-toggler'
            type='button'
            aria-expanded={!isCollapsed ? "true" : "false"}
            aria-label='Toggle navigation'
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <span className='navbar-toggler-icon'></span>
          </button>
        )}

        {/* Collapsible Navbar for Mobile */}
        {isMobile ? (
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                className='navbar-collapse'
                initial='collapsed'
                animate='open'
                exit='collapsed'
                variants={collapseVariants}
                transition={{ duration: 0.3 }}
              >
                <ul className='navbar-nav ms-auto d-flex flex-column align-items-center'>
                  {renderNavItems()}
                  {renderDropdown()}
                  {renderDarkModeToggle()}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          // Regular Navbar for larger screens without animation
          <div className='navbar-collapse show'>
            <ul className='navbar-nav ms-auto d-flex align-items-center'>
              {renderNavItems()}
              {renderDropdown()}
              {renderDarkModeToggle()}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
