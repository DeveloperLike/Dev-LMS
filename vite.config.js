import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import basicSsl from "@vitejs/plugin-basic-ssl"

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";
  const useHttps = process.env.HTTPS === "true";

  return {
    plugins: [
      react(),
      ...(useHttps ? [basicSsl()] : [])
    ],
    server: {
      host: 'lms.yesgermany.org',
      // host: 'localhost',
      port: 3000,
      https: useHttps
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      'import.meta.env.VITE_NODE_API_URL': JSON.stringify(
        isProd
          ? "https://lms.yesgermany.org/node/api"
          : "http://localhost:3001/api"
      ),
      'import.meta.env.VITE_APP_URL': JSON.stringify(
        isProd
          ? "https://lms.yesgermany.org"
          : "http://localhost:3000"
      ),
      'import.meta.env.VITE_EASEBUZZ_ENV': isProd ? JSON.stringify("prod") : JSON.stringify("test")
    },
  }
})