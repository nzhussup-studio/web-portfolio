import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "yet-another-react-lightbox/styles.css";
import "./i18n";
import "./index.css";
import App from "./App";
import { AppProviders } from "./app/providers";

const root = document.getElementById("root");
if (!root) throw new Error("Root element was not found");

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <AppProviders>
        <App />
      </AppProviders>
    </BrowserRouter>
  </StrictMode>,
);
