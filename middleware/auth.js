import { auth } from '@/composables/firebase'
import { onAuthStateChanged } from 'firebase/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        return navigateTo(`/login?redirect=${to.fullPath}`)
      }
      resolve()
    })
  })
})
