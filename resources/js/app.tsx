import { createInertiaApp } from "@inertiajs/react";

createInertiaApp({
    pages: {
        path: "./Pages",
        extension: ".tsx",
        lazy: true,
    }
})