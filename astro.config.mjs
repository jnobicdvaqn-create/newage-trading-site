import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  site: "https://www.newage-trading.com",
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en",
          ru: "ru",
          zh: "zh",
        },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@lib': path.resolve('./src/lib'),
        '@data': path.resolve('./src/data'),
        '@components': path.resolve('./src/components'),
        '@layouts': path.resolve('./src/layouts'),
        '@i18n': path.resolve('./src/i18n'),
        '@config': path.resolve('./src/config'),
      },
    },
  },
});
