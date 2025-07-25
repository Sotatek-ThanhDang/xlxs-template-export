import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "handsontable/styles/handsontable.min.css";
import "handsontable/styles/ht-theme-main.min.css";
import { registerAllModules } from "handsontable/registry";

import App from "./App";
import XlxsSettingsProvider from "./feature/xlsx-preview/context/XlsxSettingsContext";

registerAllModules();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <XlxsSettingsProvider>
      <App />
    </XlxsSettingsProvider>
  </StrictMode>
);
