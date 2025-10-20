<template>
  <section class="max-w-6xl mx-auto py-16 px-4">
    <h2 class="text-3xl font-bold text-orange-700 mb-8">Your Bookmarked Books</h2>

    <div v-if="bookmarks.length" class="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
      <div
        v-for="book in bookmarks"
        :key="book.id"
        class="relative bg-white rounded-xl shadow-md border border-orange-100 overflow-hidden hover:shadow-lg transition group"
      >
        <!-- Remove Button -->
        <button
          @click="removeBookmark(book.id)"
          class="absolute top-3 right-3 z-10 bg-white/90 hover:bg-red-500 text-gray-700 hover:text-white rounded-full p-2 shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100"
          title="Remove bookmark"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <img :src="book.coverUrl" class="w-full h-56 object-cover" />
        <div class="p-4">
          <h3 class="font-bold text-lg text-gray-900">{{ book.title }}</h3>
          <p class="text-sm text-gray-600 mb-2">by {{ book.author }}</p>
          <span
            class="inline-block px-3 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full"
          >
            {{ book.category }}
          </span>
        </div>
      </div>
    </div>

    <div v-else class="text-gray-500 text-center mt-10">
      You haven't bookmarked any book yet.
    </div>
  </section>
</template>

<script setup>
import { useBookStore } from '@/stores/bookmark'
import { onMounted, computed } from 'vue'

const bookStore = useBookStore()
const bookmarks = computed(() => bookStore.bookmarks)

const removeBookmark = async (bookId) => {
  if (confirm('Are you sure you want to remove this bookmark?')) {
    await bookStore.removeBookmark(bookId)
  }
}

onMounted(() => {
  bookStore.loadBookmarks()
})
</script>