import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import node from "@astrojs/node";

export default defineConfig({
  output: 'server', // SSR con páginas selectivas en SSG usando prerender
  adapter: node({
    mode: 'standalone'
  }),
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    domains: ["granrahback.local"],
  },
});
