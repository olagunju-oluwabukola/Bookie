<template>
  <div class="py-8 md:py-16 overflow-hidden">
    <div class="relative">
      <!-- Desktop: Infinite scroll -->
      <div class="hidden md:flex animate-scroll gap-8">
        <div
          v-for="(book, index) in [...books, ...books]"
          :key="index"
          class="flex-shrink-0 w-72 bg-white rounded-2xl shadow-lg p-4 hover:shadow-2xl transition-all transform hover:-translate-y-2"
        >
          <div class="relative mb-3 overflow-hidden rounded-xl">
            <img :src="book.cover" :alt="book.title" class="w-full h-72 object-cover" />
            <div v-if="book.label" class="absolute top-3 right-3 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {{ book.label }}
            </div>
          </div>
          <h3 class="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{{ book.title }}</h3>
          <p class="text-gray-600 text-sm mb-2">{{ book.author }}</p>
          <div class="flex items-center gap-1 text-orange-500">
            <Star class="w-4 h-4 fill-current" />
            <span class="text-sm text-gray-600">0.00(0)</span>
          </div>
        </div>
      </div>

      <!-- Mobile: Single card with indicators -->
      <div class="md:hidden">
        <div class="flex justify-center">
          <div class="w-full max-w-sm bg-white rounded-2xl shadow-lg p-4 mx-4">
            <div class="relative mb-3 overflow-hidden rounded-xl">
              <img :src="books[currentIndex].cover" :alt="books[currentIndex].title" class="w-full h-72 object-cover" />
              <div v-if="books[currentIndex].label" class="absolute top-3 right-3 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                {{ books[currentIndex].label }}
              </div>
            </div>
            <h3 class="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{{ books[currentIndex].title }}</h3>
            <p class="text-gray-600 text-sm mb-2">{{ books[currentIndex].author }}</p>
            <div class="flex items-center gap-1 text-orange-500">
              <Star class="w-4 h-4 fill-current" />
              <span class="text-sm text-gray-600">0.00(0)</span>
            </div>
          </div>
        </div>

        <!-- Carousel Indicators -->
        <div class="flex justify-center gap-2 mt-6">
          <button
            v-for="(book, index) in books"
            :key="index"
            @click="currentIndex = index"
            :class="[
              'h-2 rounded-full transition-all',
              currentIndex === index ? 'w-8 bg-orange-600' : 'w-2 bg-gray-300'
            ]"
            :aria-label="`Go to slide ${index + 1}`"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
.animate-scroll {
  animation: scroll 40s linear infinite;
}
.animate-scroll:hover {
  animation-play-state: paused;
}
</style>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Star } from 'lucide-vue-next';

const books = [
  { title: 'Build a Brand in 30 days', author: 'Unlisted Author', cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop', label: 'New' },
  { title: 'Milk and Honey', author: 'Rupi Kaur', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop' },
  { title: 'The presentation secrets of Steve Jobs', author: 'Carmine Gallo', cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop', label: 'New' },
  { title: 'Psychology of Money', author: 'Morgan Housel', cover: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400&h=600&fit=crop' },
  { title: 'Atomic Habits', author: 'James Clear', cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop', label: 'New'},
  { title: 'Deep Work', author: 'Cal Newport', cover: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=400&h=600&fit=crop' }
];

const currentIndex = ref(0);
let interval;

onMounted(() => {

  interval = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % books.length;
  }, 3000);
});

onUnmounted(() => {
  if (interval) clearInterval(interval);
});
</script>