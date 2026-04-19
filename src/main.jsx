import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { seedConfig } from "./lib/seedConfig";

// Seed the user's preferred config into localStorage (runs once)
seedConfig();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
