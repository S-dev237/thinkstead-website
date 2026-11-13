import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * `base: "./"` keeps every asset URL relative, so the same build works at
 * https://s-dev237.github.io/thinkstead-website/, on a custom domain, or from
 * any folder on a server, without rebuilding.
 */
export default defineConfig({
  base: "./",
  plugins: [react()],
});
