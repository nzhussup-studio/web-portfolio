import React from "react";
import PageWrapper from "../../utils/SmoothPage";
import { p } from "framer-motion/client";

const Loading = ({ t }) => {
  return (
    <PageWrapper>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <div
          className='spinner-border'
          role='status'
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className='sr-only'></span>
        </div>
        <h2 style={{ marginTop: "20px" }}>{t("common.loading")}</h2>
        <p>{t("common.please_wait")}</p>
      </div>
    </PageWrapper>
  );
};

export default Loading;
