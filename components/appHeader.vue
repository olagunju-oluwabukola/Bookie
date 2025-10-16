<template>
  <div ref="headerWrapper">
    <div class="fixed w-full z-50 px-4 md:px-8 pt-4">
      <header
        :class="[
          'max-w-7xl mx-auto transition-all duration-300 rounded-full',
          scrolled ? 'bg-white/5 backdrop-blur-lg shadow-xl border border-white/10' : 'bg-transparent'
        ]"
      >
        <div class="flex items-center justify-between px-6 md:px-10 h-16">
          <div class="flex-shrink-0">
            <div class="flex items-center g">
              <img src="/assets/images/logo.png" alt="Logo" class="h-10 md:h-16 w-auto" />
              <span class="text-2xl font-extrabold bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-700 bg-clip-text text-transparent italic">
                Bookie
              </span>
            </div>
          </div>
          <nav class="hidden md:flex space-x-8">
            <NuxtLink
              v-for="item in navItems"
              :key="item.name"
              :to="item.to"
              class="text-gray-800 hover:text-yellow-500 font-medium"
            >
              {{ item.name }}
            </NuxtLink>
          </nav>
          <div class="flex items-center space-x-4">
            <button class="hidden md:block">
              <LucideUser class="w-6 h-6 text-gray-800" />
            </button>
            <button
              @click="toggleMenu"
              class="md:hidden bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-700 p-2 rounded-full transition-colors"
            >
              <LucideMenu class="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </header>
    </div>

    <transition name="slide">
      <div
        v-if="menuOpen"
        class="fixed top-0 right-0 w-64 h-full bg-white p-6 flex flex-col justify-between z-50"
      >
        <div class="space-y-6 mt-4">
          <NuxtLink
            v-for="item in navItems"
            :key="item.name"
            :to="item.to"
            class="block text-gray-800 font-medium text-lg"
            @click="closeMenu"
          >
            {{ item.name }}
          </NuxtLink>
        </div>
        <button
          @click="closeMenu"
          class="mt-auto w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-700 hover:from-orange-500 hover:via-orange-600 hover:to-orange-700 flex items-center justify-center transition-colors self-center"
        >
          <LucideX class="w-5 h-5 text-white" />
        </button>
      </div>
    </transition>

    <div class="h-20 md:h-24"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { LucideMenu, LucideUser, LucideX } from 'lucide-vue-next'

const menuOpen = ref(false)
const scrolled = ref(false)
const headerWrapper = ref(null)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const closeMenu = () => {
  menuOpen.value = false
}

const handleScroll = () => {
  const currentScrollY = window.scrollY
  scrolled.value = currentScrollY > 20

  if (menuOpen.value && window.innerWidth < 768) {
    closeMenu()
  }
}


const handleClickOutside = (e) => {
  if (menuOpen.value && headerWrapper.value && !headerWrapper.value.contains(e.target) && window.innerWidth < 768) {
    closeMenu()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
})

const navItems = [
  { name: 'Home', to: '/' },
  { name: 'Categories', to: '/categories' },
  { name: 'upload', to: '/upload' },
  { name: 'Sign In', to: '/sign-in' },
  {name: 'Sign Up', to: '/sign-up'}
]
</script>

<style>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
.slide-enter-to,
.slide-leave-from {
  transform: translateX(0%);
}
</style>
