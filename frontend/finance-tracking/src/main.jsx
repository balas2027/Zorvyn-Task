import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "@/App.jsx";
import { ActionNotifierProvider } from "@/components/common/ActionNotifier.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ActionNotifierProvider>
      <App />
    </ActionNotifierProvider>
  </StrictMode>,
);
