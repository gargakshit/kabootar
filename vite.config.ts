import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import bundledEntryPlugin from "vite-plugin-bundled-entry";

const rtBaseURL = process.env.RT_BASE_URL ?? "http://localhost:4001";

export default defineConfig({
  plugins: [
    solidPlugin(),
    bundledEntryPlugin({
      id: "sw-bundled-entry",
      outFile: "/sw.js",
      entryPoint: "./src/sw.ts",
    }),
  ],
  server: {
    port: 3000,
    proxy: {
      "/rt/v1": {
        target: rtBaseURL,
        ws: true,
      },
    },
  },
  build: {
    target: "esnext",
    assetsInlineLimit: 0,
    outDir: "./standalone/web/static",
  },
});
