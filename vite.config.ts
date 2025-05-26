import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		host: '0.0.0.0', // This allows external access
		strictPort: true, // Ensures Vite uses the specified port
		port: 5173,
		cors: {
			origin: '*', // allow all origins (for testing)
			methods: ['GET', 'POST', 'OPTIONS'],
			allowedHeaders: ['Content-Type', 'Authorization']
		},
		allowedHosts: ['https://86a8-2400-adc1-469-3e00-541-db8b-3c02-2572.ngrok-free.app']
	}
});
