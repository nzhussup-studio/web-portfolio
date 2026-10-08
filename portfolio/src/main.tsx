import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "yet-another-react-lightbox/styles.css";
import "./i18n/config";
import "./styles/global.css";
import App from "@/app/App";
import { AppProviders } from "@/app/providers";

const root = document.getElementById("root");
if (!root) throw new Error("Root element was not found");

createRoot(root).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
