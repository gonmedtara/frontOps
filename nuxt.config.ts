// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", "@nuxt/content", "@nuxtjs/tailwindcss"],

  runtimeConfig: {
    openaiApiKey: process.env.NUXT_OPENAI_API_KEY,
    public: {},
  },

  content: {
    highlight: {
      theme: {
        default: "github-light",
        dark: "github-dark",
      },
      langs: [
        "dart",
        "typescript",
        "html",
        "vue",
        "sass",
        "javascript",
        "jsx",
        "bash",
      ],
    },
    experimental: {
      search: true,
    },
    watch: {
      usePolling: true,
      interval: 100,
    },
  },

  app: {
    head: {
      title: 'FrontOps',
      titleTemplate: '%s | FrontOps',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          name: 'description', 
          content: 'FrontOps - Plateforme de gestion de projets front-end' 
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  compatibilityDate: "2025-05-21"
})