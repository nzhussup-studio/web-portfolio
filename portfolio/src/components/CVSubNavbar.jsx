import { getCurrentParams, buildUrl } from "../utils/urlUtil";

const CVSubNavbar = ({ isDarkMode, t }) => {
  const currentParams = getCurrentParams();

  const buildSectionUrl = (hash) => {
    return buildUrl(`/curriculum-vitae#${hash}`, currentParams);
  };

  return (
    <nav className='mb-4'>
      <ul className='nav justify-content-center text-decoration-underline'>
        <li className='nav-item'>
          <a
            className={`nav-link ${isDarkMode ? "text-white" : "text-black"}`}
            href={buildSectionUrl("work-experience")}
          >
            {t("cv_page.navigations.work_experience")}
          </a>
        </li>
        <li className='nav-item'>
          <a
            className={`nav-link ${isDarkMode ? "text-white" : "text-black"}`}
            href={buildSectionUrl("education")}
          >
            {t("cv_page.navigations.education")}
          </a>
        </li>
        <li className='nav-item'>
          <a
            className={`nav-link ${isDarkMode ? "text-white" : "text-black"}`}
            href={buildSectionUrl("skills")}
          >
            {t("cv_page.navigations.skills")}
          </a>
        </li>
        <li className='nav-item'>
          <a
            className={`nav-link ${isDarkMode ? "text-white" : "text-black"}`}
            href={buildSectionUrl("certifications")}
          >
            {t("cv_page.navigations.certifications")}
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default CVSubNavbar;
