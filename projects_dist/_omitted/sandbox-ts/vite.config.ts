import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import tsconfigPaths from "vite-tsconfig-paths";
import arraybuffer from "vite-plugin-arraybuffer";
const crossOriginIsolation = () => ({
  name: "configure-server",

  configureServer(server) {
    server.middlewares.use((_req, res, next) => {
      res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
      res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
      next();
    });
  },
});

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    arraybuffer(),
    checker({ typescript: true }),
    crossOriginIsolation(),
  ],
  build: {
    outDir: "build",
  },
  server: {
    port: 443,
    hmr: { protocol: "ws", host: "localhost" },
  },
});
