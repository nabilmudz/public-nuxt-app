export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://public-next-api-production.up.railway.app',
    },
  },
  nitro: {
    devProxy: {
      "/api": {
        target: "https://public-next-api-production.up.railway.app",
        changeOrigin: true
      }
    }
  }
})