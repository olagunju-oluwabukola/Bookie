<template>
  <div class="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-md text-center">

    <div class="flex flex-col items-center mb-6">
      <div class="bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-700 p-4 rounded-full shadow-md">
        <User class="w-10 h-10 text-white" />
      </div>
      <h2 class="text-2xl font-bold mt-3 flex items-center justify-center gap-2">
        Welcome Back <span>👋</span>
      </h2>
      <p class="text-gray-600 text-sm mt-2 md:mt-3">Sign in to continue to your account</p>
    </div>

    <form @submit.prevent="signIn" class="space-y-4">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        required
        class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
        class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
      />

      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:opacity-90 text-white py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
      >
        <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
        <span>{{ loading ? 'Signing In...' : 'Sign In' }}</span>
      </button>
    </form>

    <p class="mt-4 text-sm text-gray-600">
      Don't have an account?
      <NuxtLink to="/sign-up" class="text-orange-600 font-semibold hover:underline">
        Sign Up
      </NuxtLink>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { auth } from '@/composables/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useToast } from 'vue-toastification'
import { useRoute, useRouter } from 'vue-router'
import { User, Loader2 } from 'lucide-vue-next'

const toast = useToast()
const email = ref('')
const password = ref('')
const loading = ref(false)
const route = useRoute()
const router = useRouter()

const signIn = async () => {
  loading.value = true
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    toast.success('Signed in successfully!')
    const redirectPath = route.query.redirect || '/'
    router.push(redirectPath)
  } catch (err) {
    toast.error(err.message)
  } finally {
    loading.value = false
  }
}
</script>
