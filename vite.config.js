import { defineConfig } from "vite";

export default defineConfig({
	server: {
		open: false,
		host: "0.0.0.0", // Umožní přístup k serveru z hostitele
		proxy: {
			"/": "http://localhost:8080",
		},
		watch: {
			usePolling: true,
			interval: 100, // Zlepšuje detekci změn na Windows
		},
	},
	build: {
		rollupOptions: {
			input: "src/js/main.js",
			output: {
				entryFileNames: "[name].js",
				chunkFileNames: "[name].js",
				assetFileNames: "[name][extname]",
			},
		},
		outDir: "dist",
		emptyOutDir: false,
		assetsDir: ".",
		watch: {
			include: "src/js/**", // Sleduje jen JS soubory
			clearScreen: false, // Zabrání zbytečnému mazání konzole
			chokidar: {
                usePolling: true,
                interval: 1000,
            }
		},
	},
});
