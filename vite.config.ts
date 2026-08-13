import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import path from "node:path";

// Tauri exposes the dev host on this env var when running on a physical device.
const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      routesDirectory: "src/routes",
      generatedRouteTree: "src/routeTree.gen.ts",
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@chron": path.resolve(import.meta.dirname, "."),
    },
  },
  // Tauri-recommended dev-server tuning (see https://v2.tauri.app/start/frontend/vite/).
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? { protocol: "ws", host, port: 1421 }
      : undefined,
    watch: {
      // Never rebuild the frontend when the Rust side changes.
      ignored: ["**/src-tauri/**"],
    },
  },
  // Env vars starting with these prefixes are exposed to the frontend.
  envPrefix: ["VITE_", "TAURI_ENV_*"],
  build: {
    // Match Tauri's minimum supported webview.
    target: "es2022",
    minify: process.env.TAURI_ENV_DEBUG ? false : "esbuild",
    sourcemap: !!process.env.TAURI_ENV_DEBUG,
  },
});
