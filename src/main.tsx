import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
// Fontsource stylesheets are imported here, not from globals.css. The Tailwind
// PostCSS plugin inlines a CSS @import without rewriting the relative url()
// paths, so the woff2 files never reach the bundle.
import "@fontsource-variable/manrope";
import "@fontsource-variable/jetbrains-mono";
import "./styles/globals.css";

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Missing #root element in index.html");
}

createRoot(rootEl).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
