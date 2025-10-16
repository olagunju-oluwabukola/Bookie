<template>
  <div class="py-16 px-4 bg-white">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-4xl font-bold text-center text-gray-900 mb-4">Browse by Category</h2>
      <p class="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Explore our diverse collection of books across various genres and topics. Find exactly what you're looking for.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(category, index) in categories"
          :key="index"
          class="group relative overflow-hidden rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
          :style="`background: ${category.gradient}; backdrop-filter: blur(10px);`"
        >
          <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-60 pointer-events-none"></div>
          <div
            class="absolute -top-4 left-6 w-8 h-8 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300"
            :style="`background: ${category.circleGradient};`"
          ></div>

          <div class="relative mt-6">
            <div class="mb-4 inline-block p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <component :is="category.icon" class="w-8 h-8 text-white" :stroke-width="2" />
            </div>

            <h3 class="text-2xl font-bold text-white mb-2">{{ category.title }}</h3>
            <p class="text-white/90 text-sm mb-4">{{ category.description }}</p>

            <div class="flex items-center justify-between">
              <span class="text-white/80 text-sm font-medium">{{ category.bookCount }} books</span>
              <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
        </div>
      </div>
      <div class="text-center mt-12">
        <button class="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          View All Categories
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { BookOpen, TrendingUp, Cpu, Palette } from 'lucide-vue-next';

const categories = [
  {
    title: 'Fiction & Literature',
    description: 'Novels, short stories, poetry, and classic literature',
    bookCount: '2,450+',
    icon: BookOpen,
    gradient: 'linear-gradient(135deg, rgba(147, 51, 234, 0.9) 0%, rgba(126, 34, 206, 0.95) 100%)',
    circleGradient: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)'
  },
  {
    title: 'Business & Self-Help',
    description: 'Entrepreneurship, personal development, and productivity',
    bookCount: '1,820+',
    icon: TrendingUp,
    gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.95) 100%)',
    circleGradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)'
  },
  {
    title: 'Science & Technology',
    description: 'Programming, AI, engineering, and innovation',
    bookCount: '1,650+',
    icon: Cpu,
    gradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 0.95) 100%)',
    circleGradient: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)'
  },
  {
    title: 'Arts & Creative',
    description: 'Photography, design, music, and creative writing',
    bookCount: '980+',
    icon: Palette,
    gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.9) 0%, rgba(219, 39, 119, 0.95) 100%)',
    circleGradient: 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)'
  }
];
</script>

<style scoped>
.group:hover {
  transform: translateY(-8px) scale(1.02);
}
</style>