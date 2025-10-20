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

          <div class="flex-shrink-0 flex items-center gap-2">
            <img src="/assets/images/logo.png" alt="Logo" class="h-10 md:h-16 w-auto" />
            <span
              class="text-2xl font-extrabold bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-700 bg-clip-text text-transparent italic"
            >
              Bookie
            </span>
          </div>


          <nav class="hidden md:flex space-x-8">
            <NuxtLink
              v-for="item in navItems"
              :key="item.name"
              :to="item.to"
              class="text-black hover:text-orange-500 font-medium"
            >
              {{ item.name }}
            </NuxtLink>
          </nav>
          <div class="flex items-center space-x-4">
            <div class="hidden md:block relative">
              <button
                @click="toggleDropdown"
                class="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-700 text-white font-semibold hover:shadow-lg transition-all duration-300"
              >
                {{ user ? (user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()) : '' }}
                <LucideUser v-if="!user" class="w-6 h-6 text-white" />
              </button>
              <transition name="fade">
                <div
                  v-if="dropdownOpen && user"
                  class="absolute right-0 mt-3 w-48 bg-white shadow-lg rounded-xl border border-orange-100 py-2 z-50"
                >
                  <div class="px-4 py-2 text-gray-700 text-sm font-semibold border-b border-orange-50">
                    {{ user.displayName || user.email }}
                  </div>
                  <NuxtLink
                    to="/dashboard"
                    class="block px-4 py-2 text-gray-700 hover:bg-orange-50"
                    @click="closeDropdown"
                  >
                    Dashboard
                  </NuxtLink>
                  <button
                    @click="signOutUser"
                    class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50"
                  >
                    Logout
                  </button>
                </div>
              </transition>
            </div>
            <div v-if="!user" class="hidden md:flex items-center space-x-4">
              <NuxtLink
                to="/sign-in"
                class="text-gray-800 hover:text-yellow-500 font-medium"
              >
                Sign In
              </NuxtLink>
              <NuxtLink
                to="/sign-up"
                class="text-gray-800 hover:text-yellow-500 font-medium"
              >
                Sign Up
              </NuxtLink>
            </div>

            <!-- Mobile Menu Button -->
            <button
              @click="toggleMenu"
              class="md:hidden bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-700 p-2 rounded-full transition"
            >
              <LucideMenu class="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </header>
    </div>

    <!-- Mobile Sidebar -->
    <transition name="slide">
      <div
        v-if="menuOpen"
        class="fixed top-0 right-0 w-64 h-full bg-white p-6 flex flex-col justify-between z-50"
      >
        <div class="space-y-6 mt-4">
          <!-- Nav Items -->
          <NuxtLink
            v-for="item in navItems"
            :key="item.name"
            :to="item.to"
            class="block text-gray-800 font-medium text-lg hover:text-orange-600 transition"
            @click="closeMenu"
          >
            {{ item.name }}
          </NuxtLink>


          <div class="mt-6 border-t border-orange-100 pt-4">
            <template v-if="user">
              <div class="flex items-center gap-2">
                <div
                  class="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-700 flex items-center justify-center text-white font-semibold"
                >
                  {{ user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() }}
                </div>
                <div class="flex flex-col">
                  <span class="text-gray-800 font-medium text-sm">{{ user.displayName || user.email }}</span>
                  <NuxtLink
                    to="/dashboard"
                    class="text-gray-700 text-sm mt-1 hover:underline"
                    @click="closeMenu"
                  >
                    Dashboard
                  </NuxtLink>
                  <button
                    @click="signOutUser"
                    class="text-red-500 text-sm mt-1 hover:underline"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="flex flex-col space-y-2">
                <NuxtLink
                  to="/sign-in"
                  class="text-gray-800 font-medium hover:text-orange-600"
                  @click="closeMenu"
                >
                  Sign In
                </NuxtLink>
                <NuxtLink
                  to="/sign-up"
                  class="text-gray-800 font-medium hover:text-orange-600"
                  @click="closeMenu"
                >
                  Sign Up
                </NuxtLink>
              </div>
            </template>
          </div>
        </div>

        <!-- Close Button -->
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
import { useRouter } from 'vue-router'
import { LucideMenu, LucideUser, LucideX } from 'lucide-vue-next'
import { auth } from '@/composables/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'

const menuOpen = ref(false)
const dropdownOpen = ref(false)
const scrolled = ref(false)
const headerWrapper = ref(null)
const user = ref(null)
const router = useRouter()

const toggleMenu = () => menuOpen.value = !menuOpen.value
const closeMenu = () => menuOpen.value = false
const toggleDropdown = () => dropdownOpen.value = !dropdownOpen.value
const closeDropdown = () => dropdownOpen.value = false

const handleScroll = () => {
  scrolled.value = window.scrollY > 20
  if (menuOpen.value && window.innerWidth < 768) closeMenu()
}

const handleClickOutside = (e) => {
  if (dropdownOpen.value && headerWrapper.value && !headerWrapper.value.contains(e.target) && window.innerWidth >= 768) {
    closeDropdown()
  }
}

const signOutUser = async () => {
  await signOut(auth)
  user.value = null
  closeDropdown()
  router.push('/')
}

// Auth listener
onMounted(() => {
  onAuthStateChanged(auth, (u) => {
    user.value = u
  })
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
  { name: 'Upload', to: '/upload' },
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}
</style>
