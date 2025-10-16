
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineNuxtConfig({

  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  vite: {
    plugins: [tsconfigPaths()]
  },
})
