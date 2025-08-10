import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import tsconfigPaths from "vite-tsconfig-paths";

// vite-plugin-checker: Emit typescript errors during runtime
// vite-tsconfig-paths: Used to resolve absolute paths inside src, eg: `import {Player} from "actors/player";

export default defineConfig({
  plugins: [tsconfigPaths(), checker({ typescript: true })],
  build: {
    outDir: "build",
  },
  base: "./",
});
