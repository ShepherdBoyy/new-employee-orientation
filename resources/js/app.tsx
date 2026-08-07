import { createInertiaApp } from "@inertiajs/react";


declare module '@inertiajs/core' {
    interface PageProps extends Record<string, unknown> {
        success?: string | null;
        error?: string | null;
    }
}

createInertiaApp({
    pages: {
        path: "./Pages",
        extension: ".tsx",
        lazy: true,
    }
})

