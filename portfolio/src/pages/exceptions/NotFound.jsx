import React from "react";
import PageWrapper from "../../utils/SmoothPage";

const NotFound = ({ t }) => {
  return (
    <PageWrapper>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>{t("exceptions.not_found.title")}</h1>
        <p>{t("exceptions.not_found.description")}</p>
      </div>
    </PageWrapper>
  );
};

export default NotFound;
