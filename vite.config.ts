import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import tanstackRouter from "@tanstack/router-plugin/vite";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    viteReact(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "#": resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    allowedHosts: ["smp.seplag.mt.gov.br", "brasilapi.com.br"],
  },
  build: {
    outDir: "build",
  },
});
