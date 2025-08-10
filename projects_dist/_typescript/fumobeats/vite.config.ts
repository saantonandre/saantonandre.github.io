import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import tsconfigPaths from "vite-tsconfig-paths";
import arraybuffer from "vite-plugin-arraybuffer";

// vite-plugin-checker: Emit typescript errors during runtime
// vite-tsconfig-paths: Used to resolve absolute paths inside src, eg: `import {Player} from "actors/player";

export default defineConfig({
  plugins: [tsconfigPaths(), arraybuffer(), checker({ typescript: true })],
  build: {
    outDir: "build",
  },
  assetsInclude: ["**/*.nuero"],
  esbuild: {
    supported: {
      "top-level-await": true, //browsers can handle top-level-await features
    },
  },
  server: {
    port: 3000,
    hmr: { protocol: "ws", host: "localhost" },
  },
  base: "./",
});
