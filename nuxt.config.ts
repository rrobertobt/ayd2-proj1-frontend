// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: [
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/test-utils",
    "@pinia/nuxt",
    "@pinia/colada-nuxt",
    "@vueuse/nuxt",
    "shadcn-nuxt",
  ],
  css: ["~/assets/css/tailwind.css"],
  vite: {
    plugins: [tailwindcss()],
    server: {
      open: false,
    },
  },
  fonts: {
    defaults: {
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
    families: [
      { name: "General Sans", provider: "fontshare" },
      { name: "JetBrains Mono", provider: "google" },
    ],
    experimental: {
      processCSSVariables: true,
    },
  },
});
