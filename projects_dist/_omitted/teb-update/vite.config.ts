import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import tsconfigPaths from "vite-tsconfig-paths";
import arraybuffer from "vite-plugin-arraybuffer";
import preact from "@preact/preset-vite";
import tailwindcss from "tailwindcss";
import tailwindConfig from "./tailwind.config";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    arraybuffer(),
    checker({ typescript: true }),
    preact(),
  ],
  base: "./",
  build: {
    outDir: "build",
  },
  esbuild: {
    supported: {
      "top-level-await": true, //browsers can handle top-level-await features
    },
  },
  server: {
    port: 80,
    hmr: { protocol: "ws", host: "localhost" },
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss({
          config: tailwindConfig,
        }) as any, // For some reason its not working with default type
      ],
    },
  },
});
