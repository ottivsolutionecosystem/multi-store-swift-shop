
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true, // Enable source maps for better error tracking
    rollupOptions: {
      output: {
        // Add source map files to separate directory in production
        sourcemapPathTransform: (relativeSourcePath) => {
          return path.basename(relativeSourcePath);
        }
      }
    }
  },
  define: {
    // Add version info for Sentry releases
    'process.env.VITE_APP_VERSION': JSON.stringify(process.env.npm_package_version || '1.0.0'),
  }
}));
