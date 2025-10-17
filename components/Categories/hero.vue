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
          class="flex-1 text-gray-900 placeholder-gray-500 bg-transparent focus:outline-none text-base md:text-lg py-4 px-4"
          @keyup.enter="handleSearch"
        />

        <button
          @click="handleSearch"
          class="h-full px-4 md:px-4 py-5 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-md"
        >
          Search
        </button>
      </div>
      <div class="flex flex-wrap justify-center gap-3 mt-6">
        <button
          v-for="tag in allCategories"
          :key="tag"
          @click="applyTag(tag)"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all duration-200 border',
            selectedTag === tag
              ? 'bg-orange-600 text-white border-orange-600'
              : 'bg-white/80 hover:bg-white text-gray-700 hover:text-orange-700 border-orange-100'
          ]"
        >
          {{ tag }}
        </button>
      </div>
    </div>


    <div class="mt-10 max-w-6xl mx-auto text-left">
      <div v-if="isLoading" class="text-orange-600 font-medium text-center py-20">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent"></div>
        <p class="mt-4">Loading books...</p>
      </div>

      <div v-if="errorMessage" class="text-red-500 text-center py-10 bg-red-50 rounded-lg">
        {{ errorMessage }}
      </div>

      <div
        v-if="paginatedBooks.length"
        class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6"
      >
        <div
          v-for="book in paginatedBooks"
          :key="book.id"
          @click="openBook(book.id)"
          class="bg-white rounded-xl shadow-md hover:shadow-xl cursor-pointer transition-all duration-300 overflow-hidden border border-orange-100 group hover:border-orange-300 hover:-translate-y-1"
        >
          <div class="relative overflow-hidden">
            <img
              :src="book.coverUrl"
              alt="Book Cover"
              class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div class="p-5">
            <h3 class="text-lg font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-orange-700 transition-colors min-h-[3.5rem]">
              {{ book.title }}
            </h3>
            <p class="text-sm text-gray-600 mb-3 truncate">by {{ book.author }}</p>
            <div class="flex items-center justify-between">
              <span
                class="inline-block px-3 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full"
              >
                {{ book.category }}
              </span>
              <svg class="w-5 h-5 text-orange-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else-if="!isLoading && !errorMessage"
        class="text-gray-500 mt-6 text-center py-20"
      >
        <svg class="w-20 h-20 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
        <p class="text-lg font-medium">No books found.</p>
        <p class="text-sm mt-2">Try adjusting your search or filters.</p>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-10 flex-wrap">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-4 py-2 rounded-lg bg-white border border-orange-200 text-gray-700 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium hover:border-orange-300"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>

        <div class="flex gap-2">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="changePage(page)"
            :class="[
              'min-w-[2.5rem] px-4 py-2 rounded-lg font-medium transition-all',
              currentPage === page
                ? 'bg-orange-600 text-white shadow-md scale-110'
                : 'bg-white border border-orange-200 text-gray-700 hover:bg-orange-50 hover:border-orange-300'
            ]"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 rounded-lg bg-white border border-orange-200 text-gray-700 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium hover:border-orange-300"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
      <div v-if="filteredBooks.length > 0" class="text-center mt-6 text-sm text-gray-600">
        Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredBooks.length) }} of {{ filteredBooks.length }} books
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Search } from 'lucide-vue-next'
import { db } from '@/composables/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const books = ref([])
const filteredBooks = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const currentPage = ref(1)
const selectedTag = ref('All')
const allCategories = ['All', 'Fiction', 'Business', 'Self-Help', 'Technology', 'Science', 'Biography', 'Religion']

const itemsPerPage = computed(() => {
  if (typeof window !== 'undefined') {
    return window.innerWidth >= 1024 ? 6 : 3
  }
  return 6
})
if (typeof window !== 'undefined') {
  let resizeTimer
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      const maxPage = Math.ceil(filteredBooks.value.length / itemsPerPage.value)
      if (currentPage.value > maxPage) {
        currentPage.value = Math.max(1, maxPage)
      }
    }, 250)
  })
}

const totalPages = computed(() =>
  Math.ceil(filteredBooks.value.length / itemsPerPage.value)
)

const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredBooks.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

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
    errorMessage.value = 'Failed to load books. Please try again later.'
  } finally {
    isLoading.value = false
  }
}

const applyTag = (tag) => {
  selectedTag.value = tag
  currentPage.value = 1
  searchQuery.value = ''

  if (tag === 'All') {
    filteredBooks.value = books.value
  } else {
    filteredBooks.value = books.value.filter(
      (b) => b.category?.toLowerCase() === tag.toLowerCase()
    )
  }
}

const handleSearch = () => {
  currentPage.value = 1
  selectedTag.value = 'All'

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

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    const booksSection = document.querySelector('.mt-10.max-w-6xl')
    if (booksSection) {
      const offset = 100
      const elementPosition = booksSection.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>