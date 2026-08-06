import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import tailwindcss from '@tailwindcss/vite';
import react from "@vitejs/plugin-react";
import inertia from '@inertiajs/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
            fonts: [
                bunny('Instrument Sans', {
                    weights: [400, 500, 600],
                }),
            ],
        }),
        tailwindcss(),
        react(),
        inertia()
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
    build: {
        rollupOptions: {
        output: {
            manualChunks(id) {
            if (id.includes('node_modules')) {
                // Group Radix UI primitives (the core of shadcn/ui)
                if (id.includes('@radix-ui')) {
                return 'vendor-radix';
                }
                // Group Lucide icons (commonly used with shadcn)
                if (id.includes('lucide-react')) {
                return 'vendor-icons';
                }
                // Group React ecosystem code
                if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
                return 'vendor-react';
                }
                // Catch-all for other node_modules dependencies
                return 'vendor';
            }
            }
        }
        }
    }
});
