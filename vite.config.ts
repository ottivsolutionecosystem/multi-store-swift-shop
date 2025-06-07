
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
    // Replace process.env with import.meta.env or static values
    'process.env.NODE_ENV': JSON.stringify(mode),
    'process.env.REDIS_HOST': JSON.stringify(process.env.REDIS_HOST || 'redis-12517.crce196.sa-east-1-2.ec2.redns.redis-cloud.com'),
    'process.env.REDIS_PORT': JSON.stringify(process.env.REDIS_PORT || '12517'),
    'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL || "https://dkliovgbxuskqmnfojvp.supabase.co"),
    'process.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrbGlvdmdieHVza3FtbmZvanZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0MTcyMDgsImV4cCI6MjA2Mzk5MzIwOH0.w1EKr-ae-jK6_WRKMuvbZ2tbfJ0qaPeyh4uJ2eF2BBw"),
    'process.env.LOG_LEVEL': JSON.stringify(process.env.LOG_LEVEL || (mode === 'production' ? 'info' : 'debug')),
    'process.env.ENABLE_CONSOLE_LOGS': JSON.stringify(process.env.ENABLE_CONSOLE_LOGS || 'false'),
    'process.env.ENABLE_SENTRY': JSON.stringify(process.env.ENABLE_SENTRY || (mode === 'production' ? 'true' : 'false')),
    'process.env.SENTRY_DSN': JSON.stringify(process.env.SENTRY_DSN || 'https://0bf18f373ec2cace6602ac4f7a794e2a@o4509455574171648.ingest.us.sentry.io/4509455789522944'),
    'process.env.SENTRY_SAMPLING': JSON.stringify(process.env.SENTRY_SAMPLING || '0.1'),
    'process.env.VITE_APP_VERSION': JSON.stringify(process.env.npm_package_version || '1.0.0'),
  }
}));
