import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "localhost",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  envPrefix: ["VITE_", "NEXT_PUBLIC_", "CLERK_", "SUPABASE_"],
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  build: {
    target: "es2022",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-motion": ["motion"],
          "vendor-three": ["three"],
          "vendor-clerk": ["@clerk/clerk-react"],
          "vendor-supabase": ["@supabase/supabase-js"],
          "vendor-radix": [
            "@radix-ui/react-accordion",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-toast",
            "@radix-ui/react-dialog",
            "@radix-ui/react-slot",
          ],
          "vendor-router": ["react-router-dom"],
        },
      },
    },
  },
});
