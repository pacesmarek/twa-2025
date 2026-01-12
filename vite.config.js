import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	base: '/twa-2025/',
	plugins: [react()],
	server: {
		host: '0.0.0.0',
		port: 5173,
		strictPort: true,
		proxy: {
			"/api": {
				target: "http://php_app:80",
				changeOrigin: true,
			},
		},
		watch: {
			usePolling: true,
		},
	},
	build: {
		outDir: "dist",
		emptyOutDir: true,
	},
});
