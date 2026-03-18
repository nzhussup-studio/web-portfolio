import React from "react";
import PageWrapper from "../../utils/SmoothPage";

const Unavailable = ({ t }) => {
  return (
    <PageWrapper>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>{t("exceptions.unavailable.title")}</h1>
        <p>{t("exceptions.unavailable.description")}</p>
      </div>
    </PageWrapper>
  );
};

export default Unavailable;
