import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr(), tailwindcss()],
  optimizeDeps: {
    include: ["react-i18next", "i18next"],
  },
  server: {
    host: "0.0.0.0",
  },
  test: {
    environment: "jsdom",
  },
});
