import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@mdx-js/rollup";
import { NodePackageImporter } from "sass";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [tailwindcss(), mdx(), preact()],
    css: {
        preprocessorOptions: {
            scss: {
                importers: [new NodePackageImporter()],
                quietDeps: true,
            },
        },
    },
});
