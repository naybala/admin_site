import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  base: "/", // or '/your-sub-path/' if not deployed at root
  plugins: [
    vue(),
    visualizer({
      open: true,
      filename: "bundle-stats.html",
    }),
  ],
  optimizeDeps: {
    include: ["vue-picture-cropper"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@components": path.resolve(__dirname, "src/components"),
      "@composables": path.resolve(__dirname, "src/composables"),
      "@router": path.resolve(__dirname, "src/router"),
      "@stores": path.resolve(__dirname, "src/stores"),
      "@customTypes": path.resolve(__dirname, "src/types"),
      "@views": path.resolve(__dirname, "src/views"),
      "@utils": path.resolve(__dirname, "src/utils"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          primevue: ["primevue"],
        },
      },
    },
  },
});
