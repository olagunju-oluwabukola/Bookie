<template>
  <div class="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-md">
    <h2 class="text-2xl font-bold mb-6">Sign Up</h2>

    <form @submit.prevent="signUp" class="space-y-4">
      <input v-model="email" type="email" placeholder="Email" required class="w-full p-2 border rounded"/>
      <input v-model="password" type="password" placeholder="Password" required class="w-full p-2 border rounded"/>
      <button type="submit" class="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded">Sign Up</button>
    </form>
    <p class="mt-4 text-sm text-gray-600">
      Already have an account? <NuxtLink to="/login">Sign In</NuxtLink>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { auth } from '@/composables/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useToast } from 'vue-toastification'
import { useRoute, useRouter } from 'vue-router'

const toast = useToast()
const email = ref('')
const password = ref('')

const route = useRoute()
const router = useRouter()

const signUp = async () => {
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value)
    toast.success('Account created successfully!')

    const redirectPath = route.query.redirect || '/'
    router.push(redirectPath)
  } catch (err) {
    toast.error(err.message)
  }
}
</script>
