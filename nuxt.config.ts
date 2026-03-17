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
  },

  build: {
    transpile: [
      '@tiptap/core',
      '@tiptap/pm',
      '@tiptap/vue-3',
      '@tiptap/starter-kit'
    ]
  },

  // 🔥 TAMBAHIN INI
  vite: {
    optimizeDeps: {
      include: [
        '@tiptap/vue-3',
        '@tiptap/core',
        '@tiptap/pm'
      ]
    }
  }
})