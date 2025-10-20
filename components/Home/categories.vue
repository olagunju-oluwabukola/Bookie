<template>
  <section class="py-16 px-4 bg-gradient-to-b from-white via-white to-orange-50">
    <div class="max-w-7xl mx-auto text-center">
      <h2 class="text-2xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-700 bg-clip-text text-transparent mb-4">Browse by Category</h2>
      <p class="text-gray-600 mb-12 max-w-2xl mx-auto text-sm md:text-lg">
        Explore our wide collection of books across different genres and fields. Start discovering your next favorite read.
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(category, index) in categories"
          :key="index"
          class="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-orange-100"
        >
          <div class="p-6 relative z-10">
            <div
              class="inline-flex p-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white mb-4 group-hover:scale-105 transition-transform"
            >
              <component :is="category.icon" class="w-6 h-6" />
            </div>

            <h3 class="text-xl font-semibold text-orange-900 mb-2">
              {{ category.title }}
            </h3>
            <p class="text-gray-600 text-sm mb-4">
              {{ category.description }}
            </p>

            <div class="flex items-center justify-between text-sm text-gray-500">
              <span>{{ category.bookCount }} books</span>
              <div
                class="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 group-hover:bg-orange-200 transition-colors"
              >
                <svg
                  class="w-4 h-4 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
          <div
            class="absolute inset-0 bg-gradient-to-tr from-orange-100/10 via-transparent to-orange-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>
        </div>
      </div>

      <div class="mt-12">
        <button
          @click="goToAll"
          class="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
        >
          View All Books
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { BookOpen, TrendingUp, Cpu, Palette } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const categories = [
  {
    title: 'Fiction & Literature',
    description: 'Novels, stories, and classic literature for every reader.',
    bookCount: '2,450+',
    icon: BookOpen
  },
  {
    title: 'Business & Self-Help',
    description: 'Learn entrepreneurship, success mindset, and leadership.',
    bookCount: '1,820+',
    icon: TrendingUp
  },
  {
    title: 'Science & Technology',
    description: 'Stay ahead with books on coding, AI, and modern innovations.',
    bookCount: '1,650+',
    icon: Cpu
  },
  {
    title: 'Arts & Creative',
    description: 'Unleash your creativity through design, art, and photography.',
    bookCount: '980+',
    icon: Palette
  }
]

const goToAll = () => {
  router.push('/categories')
}
</script>

<style scoped>
.group:hover {
  transform: translateY(-6px) scale(1.02);
}
</style>
