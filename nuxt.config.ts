// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  ssr: true,

  app: {
    head: {
      title: 'MeritoGOŁ — Twoje studia',
    },
    router: {
      options: {
        middleware: ['auth'],
      },
    },
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  tailwindcss: {
    configPath: 'tailwind.config.ts',
  },
})
