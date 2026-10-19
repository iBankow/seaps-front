import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

/**
 * Config de teste separada de `vite.config.ts` de propósito.
 *
 * O vitest 3.2 traz uma cópia aninhada do vite 7, incompatível em tipos com o
 * vite 6 da raiz — importar `defineConfig` de "vitest/config" no mesmo arquivo
 * que os plugins (`@vitejs/plugin-react`, `tanstackRouter`, `tailwindcss`)
 * quebra o `tsc` com TS2769. Sem plugins aqui, não há conflito: o esbuild do
 * próprio vitest transforma TS/TSX usando o `jsx` do tsconfig.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: false,
    setupFiles: ["./src/test/setup.ts"],
  },
});
