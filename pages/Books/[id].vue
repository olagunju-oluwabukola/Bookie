<template>
  <div class="relative py-10 md:pt-32 pb-16 px-4 overflow-hidden">
    <!-- Search bar -->
    <div class="relative max-w-2xl mx-auto px-2">
      <div
        class="relative flex items-center bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-200/50 backdrop-blur-sm group hover:shadow-3xl transition-shadow duration-300"
      >
        <div class="pl-5">
          <Search
            class="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-focus-within:text-orange-600 transition-colors"
          />
        </div>

        <input
          type="text"
          placeholder="Search by title, author, or category..."
          v-model="searchQuery"
          class="flex-1 text-gray-900 placeholder-gray-500 bg-transparent focus:outline-none text-base md:text-lg"
          @keyup.enter="handleSearch"
        />

        <button
          @click="handleSearch"
          class="h-full px-6 md:px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-md"
        >
          Search
        </button>
      </div>

      <!-- Category tags -->
      <div class="flex flex-wrap justify-center gap-3 mt-6">
        <button
          v-for="tag in allCategories"
          :key="tag"
          @click="applyTag(tag)"
          class="px-4 py-2 bg-white/80 hover:bg-white text-gray-700 hover:text-orange-700 rounded-full text-sm font-medium shadow-sm transition-all duration-200 border border-orange-100"
        >
          {{ tag }}
        </button>
      </div>
    </div>


    <div class="mt-10 max-w-6xl mx-auto text-left">
      <div v-if="isLoading" class="text-orange-600 font-medium text-center">
        Loading books...
      </div>
      <div v-if="errorMessage" class="text-red-500 text-center">
        {{ errorMessage }}
      </div>

      <div
        v-if="filteredBooks.length"
        class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6"
      >
        <div
          v-for="book in filteredBooks"
          :key="book.id"
          @click="openBook(book.id)"
          class="bg-white rounded-xl shadow-md hover:shadow-lg cursor-pointer transition-all overflow-hidden border border-orange-100 group"
        >
          <img
            :src="book.coverUrl"
            alt="Book Cover"
            class="w-full h-48 object-cover group-hover:opacity-90 transition"
          />
          <div class="p-4">
            <h3 class="text-lg font-semibold text-orange-800">
              {{ book.title }}
            </h3>
            <p class="text-sm text-gray-600 mb-2">by {{ book.author }}</p>
            <span
              class="inline-block px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full"
            >
              {{ book.category }}
            </span>
          </div>
        </div>
      </div>

      <div
        v-else-if="!isLoading && !errorMessage"
        class="text-gray-500 mt-6 text-center"
      >
        No books found.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search } from 'lucide-vue-next'
import { db } from '@/composables/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const books = ref([])
const filteredBooks = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const allCategories = ['All', 'Fiction', 'Business', 'Self-Help', 'Technology', 'Science', 'Biography', 'Religion']

const fetchBooks = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const snapshot = await getDocs(collection(db, 'books'))
    const data = []
    snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }))
    books.value = data
    filteredBooks.value = data
  } catch (err) {
    console.error(err)
    errorMessage.value = 'Failed to load books.'
  } finally {
    isLoading.value = false
  }
}

const applyTag = (tag) => {
  if (tag === 'All') filteredBooks.value = books.value
  else
    filteredBooks.value = books.value.filter(
      (b) => b.category?.toLowerCase() === tag.toLowerCase()
    )
}

const handleSearch = () => {
  const text = searchQuery.value.toLowerCase().trim()
  if (!text) {
    filteredBooks.value = books.value
    return
  }
  filteredBooks.value = books.value.filter(
    (b) =>
      b.title?.toLowerCase().includes(text) ||
      b.author?.toLowerCase().includes(text) ||
      b.category?.toLowerCase().includes(text)
  )
}

const openBook = (id) => {
  router.push(`/books/${id}`)
}

onMounted(fetchBooks)
</script>

<style scoped>
.hover\:shadow-3xl:hover {
  box-shadow: 0 25px 50px -12px rgba(234, 88, 12, 0.25);
}
</style>