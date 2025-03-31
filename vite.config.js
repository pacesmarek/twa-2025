import { defineConfig } from "vite";

export default defineConfig({
	server: {
		open: false, // Prevents auto-opening the browser
		proxy: {
			"/": "http://localhost:8080", // Ensures Vite works with PHP
		},
		watch: {
			usePolling: true, // Enable file system polling for changes
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@import "src/scss/style.scss";`, // Ensure SCSS is loaded globally
			},
		},
	},
	build: {
		rollupOptions: {
			input: "src/js/main.js",
			output: {
				entryFileNames: "[name].js", // Keeps filenames as "main.js"
				chunkFileNames: "[name].js", // Keeps chunk names without hash
				assetFileNames: "[name][extname]", // Ensures no hashing in CSS
			},
		},
		outDir: "dist",
		emptyOutDir: false,
		assetsDir: ".", // Prevents assets/ folder creation
		watch: {
			include: "src/**",
			clearScreen: false,
			chokidar: {
				usePolling: true, // Enable file system polling for changes
				interval: 1000, // Reduce polling interval to 1000ms
			},
		},
	},
});
