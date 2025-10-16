<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-white to-orange-200 px-4">
    <div class="max-w-2xl w-full text-center">
      <div class="mb-8 relative">
        <div class="inline-block relative">
          <div class="absolute inset-0 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div class="relative bg-white rounded-full p-8 shadow-xl border border-orange-200">
            <LucideAlertTriangle class="w-24 h-24 text-orange-500 mx-auto animate-bounce-slow" />
          </div>
        </div>
      </div>


      <h1 class="text-8xl md:text-9xl font-bold text-gray-800 mb-4">
        {{ error.statusCode }}
      </h1>

      <!-- Error Message -->
      <h2 class="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
        {{ errorTitle }}
      </h2>

      <p class="text-gray-600 text-lg mb-8 max-w-md mx-auto">
        {{ errorMessage }}
      </p>


      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <NuxtLink
          to="/"
          class="px-8 py-3 bg-orange-500 hover:bg-yellow-600 text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <span class="flex items-center gap-2">
            <LucideHome class="w-5 h-5" />
            Go Home
          </span>
        </NuxtLink>

        <button
          @click="goBack"
          class="px-8 py-3 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-full border-2 border-gray-200 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <span class="flex items-center gap-2">
            <LucideArrowLeft class="w-5 h-5" />
            Go Back
          </span>
        </button>
      </div>

      <!-- Additional Help -->
      <div class="mt-12 pt-8 border-t border-gray-200">
        <p class="text-sm text-gray-500 mb-4">Need help? Try these:</p>
        <div class="flex flex-wrap gap-4 justify-center text-sm">
          <NuxtLink to="/contact" class="text-orange-600 hover:text-orange-700 underline">
            Contact Support
          </NuxtLink>
          <span class="text-gray-300">|</span>
          <NuxtLink to="/about" class="text-orange-600 hover:text-orange-700 underline">
            About Us
          </NuxtLink>
          <span class="text-gray-300">|</span>
          <NuxtLink to="/services" class="text-orange-600 hover:text-orange-700 underline">
            Our Services
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { LucideAlertTriangle, LucideHome, LucideArrowLeft } from 'lucide-vue-next'

const props = defineProps({
  error: {
    type: Object,
    default: () => ({ statusCode: 404, message: 'Page not found' })
  }
})

const errorTitle = computed(() => {
  const titles = {
    404: 'Page Not Found',
    500: 'Server Error',
    403: 'Access Denied',
    401: 'Unauthorized',
  }
  return titles[props.error.statusCode] || 'Something Went Wrong'
})

const errorMessage = computed(() => {
  const messages = {
    404: "The page you're looking for seems to have wandered off. 🤨",
    500: "Oops! Our server had a hiccup. We're working on fixing it right away.",
    403: "You don't have permission to access this page. Please contact us if you think this is a mistake.",
    401: "You need to be logged in to view this page. Please sign in and try again.",
  }
  return messages[props.error.statusCode] || props.error.message || "Something unexpected happened. Don't worry, we'll help you find your way!"
})

const goBack = () => {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    navigateTo('/')
  }
}
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-10px) rotate(-3deg);
  }
  50% {
    transform: translateY(0) rotate(0deg);
  }
  75% {
    transform: translateY(-5px) rotate(3deg);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 3s ease-in-out infinite;
}
</style>