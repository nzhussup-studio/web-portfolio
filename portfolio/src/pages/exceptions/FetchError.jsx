import React from "react";
import PageWrapper from "../../utils/SmoothPage";

const FetchError = ({ t }) => {
  return (
    <PageWrapper>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>{t("exceptions.internal_server_error.title")}</h1>
        <p>{t("exceptions.internal_server_error.description")}</p>
      </div>
    </PageWrapper>
  );
};

export default FetchError;
