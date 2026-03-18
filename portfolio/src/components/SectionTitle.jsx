import React from "react";

const SectionTitle = ({ icon, title, isDarkMode, t }) => (
  <h4 className='d-flex align-items-center mb-3'>
    <div
      className={`icon-square text-body-emphasis ${
        isDarkMode ? "bg-body-secondary" : "bg-light"
      } d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3`}
    >
      {icon}
    </div>
    {t(title)}
  </h4>
);

export default SectionTitle;
