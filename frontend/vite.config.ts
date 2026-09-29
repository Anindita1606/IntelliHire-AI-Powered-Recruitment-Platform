import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    // Allow the Emergent preview proxy host(s) to reach the dev server.
    allowedHosts: true,
    hmr: {
      clientPort: 443,
      protocol: "wss",
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 3000,
  },
});
