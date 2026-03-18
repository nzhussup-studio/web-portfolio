import React from "react";

const SkillBadge = ({ skill, isDarkMode }) => (
  <span
    className={`badge ${
      isDarkMode ? "bg-body-secondary" : "bg-light"
    } text-muted rounded-pill`}
    style={{ fontSize: "14px" }}
  >
    {skill}
  </span>
);

export default SkillBadge;
