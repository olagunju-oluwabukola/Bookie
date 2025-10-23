
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineNuxtConfig({
// app:{
//   head:{
//     title: 'Bookie',
//     link:[
//       {
//         rel:'icon', type:'image/png', href:'~/logo.png'
//       }
//     ]
//   }
// },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  vite: {
    plugins: [tsconfigPaths()]
  },
})
