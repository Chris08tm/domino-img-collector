import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  host: "0.0.0.0", // Listen on all network interfaces
  server: {
    port: 3000,
    allowedHosts: [
      "a399-2600-1702-5086-1f1f-8c4e-2b3f-7088-2c5f.ngrok-free.app", // Specific ngrok URL
      "localhost", // Localhost (for local requests)
      "0.0.0.0", // Accept connections from any IP
      "domino.alldadefinish.com",
    ],
  },
});
