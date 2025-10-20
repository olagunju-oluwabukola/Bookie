<template>
  <div class="relative py-10 md:pt-32 pb-16 px-4 overflow-hidden">
    <div class="relative max-w-2xl mx-auto px-2">
      <div
        class="relative flex items-center bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-200/50 backdrop-blur-sm group hover:shadow-3xl transition-shadow duration-300"
      >
        <div class="pl-5">
          <Search class="w-5 h-5 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search by title, author, or category..."
          v-model="searchQuery"
          class="flex-1 text-gray-900 placeholder-gray-500 bg-transparent focus:outline-none text-base md:text-lg py-4 px-4"
          @keyup.enter="currentPage = 1"
        />
        <button
          @click="currentPage = 1"
          class="h-full px-6 py-5 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-md"
        >
          Search
        </button>
      </div>

      <div class="flex flex-wrap justify-center gap-3 mt-6">
        <button
          v-for="tag in allCategories"
          :key="tag"
          @click="selectedTag = tag; currentPage = 1"
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

    <div class="mt-10 max-w-7xl mx-auto">
      <div v-if="isLoading" class="text-orange-600 text-center py-20">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent"></div>
        <p class="mt-4">Loading books...</p>
      </div>

      <div v-else-if="paginatedBooks.length" class="grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 mt-8">
        <div
          v-for="book in paginatedBooks"
          :key="book.id"
          class="relative group bg-white border border-orange-100 rounded-xl shadow-md overflow-hidden
                 transition-transform transition-shadow duration-300
                 hover:shadow-2xl hover:-translate-y-1"
        >
          <img :src="book.coverUrl" class="w-full h-[320px] object-cover" />

          <div class="p-4 relative h-[200px] flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-bold text-gray-900 line-clamp-2">{{ book.title }}</h3>
                <button @click.stop="toggleBookmark(book)">
                  <Heart
                    v-if="isBookmarked(book.id)"
                    class="w-6 h-6 text-orange-500 fill-orange-500"
                  />
                  <Heart
                    v-else
                    class="w-6 h-6 text-gray-400 hover:text-orange-500"
                  />
                </button>
              </div>
              <p class="text-sm text-gray-600 mb-2">by {{ book.author }}</p>
              <span
                class="inline-block px-3 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full"
              >
                {{ book.category }}
              </span>

              <div class="flex items-center mt-2">
                <svg
                  v-for="n in 5"
                  :key="n"
                  @click="rateBook(book.id, n)"
                  class="w-5 h-5 cursor-pointer"
                  fill="currentColor"
                  :class="n <= (ratings[book.id] || 0) ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.176c.969 0 1.371 1.24.588 1.81l-3.376 2.455a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.538 1.118l-3.376-2.454a1 1 0 00-1.176 0l-3.376 2.454c-.783.57-1.838-.197-1.538-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.048 9.397c-.783-.57-.38-1.81.588-1.81h4.176a1 1 0 00.95-.69l1.287-3.97z"
                  />
                </svg>
              </div>
            </div>

            <div
              class="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <button
                @click.stop="openBook(book.id)"
                class="w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-gray-500 mt-10 text-center">
        No books found.
      </div>

      <div v-if="filteredPaginatedBooks.length && totalPages > 1" class="flex justify-center items-center gap-2 mt-12">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-4 py-2 rounded-lg bg-white border border-orange-200 text-orange-600 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft/>
        </button>

        <div class="flex gap-2">
          <button
            v-for="page in displayedPages"
            :key="page"
            @click="currentPage = page"
            :class="[ 'px-4 py-2 rounded-lg transition', page === currentPage ? 'bg-orange-600 text-white' : 'bg-white border border-orange-200 text-orange-600 hover:bg-orange-50' ]"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 rounded-lg bg-white border border-orange-200 text-orange-600 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <ChevronRight/>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Search, Heart, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { db } from '@/composables/firebase'
import { collection, getDocs, doc, setDoc, onSnapshot } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { useBookStore } from '@/stores/bookmark'

const router = useRouter()
const searchQuery = ref('')
const books = ref([])
const isLoading = ref(false)
const currentPage = ref(1)
const screenSize = ref(window.innerWidth)
const ratings = ref({})

const selectedTag = ref('All')
const allCategories = ['All', 'Fiction', 'Business', 'Self-Help', 'Technology', 'Science', 'Biography', 'Religion']

const bookStore = useBookStore()
const auth = getAuth()
const currentUser = ref(null)

onAuthStateChanged(auth, user => {
  currentUser.value = user
  if (user) bookStore.loadBookmarks(user.uid)
  else bookStore.bookmarks = []
})

const itemsPerPage = computed(() => (screenSize.value >= 1024 ? 8 : 4))

const filteredPaginatedBooks = computed(() => {
  let filtered = books.value

  if (selectedTag.value !== 'All') {
    filtered = filtered.filter(b => b.category?.toLowerCase() === selectedTag.value.toLowerCase())
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      b => b.title?.toLowerCase().includes(query) ||
           b.author?.toLowerCase().includes(query) ||
           b.category?.toLowerCase().includes(query)
    )
  }

  filtered.sort((a, b) => {
    const timeA = a.uploadedAt?.toMillis ? a.uploadedAt.toMillis() : 0
    const timeB = b.uploadedAt?.toMillis ? b.uploadedAt.toMillis() : 0
    return timeB - timeA
  })

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredPaginatedBooks.value.length / itemsPerPage.value))

const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredPaginatedBooks.value.slice(start, start + itemsPerPage.value)
})

const displayedPages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

const handleResize = () => { screenSize.value = window.innerWidth; currentPage.value = 1 }

const fetchBooks = async () => {
  isLoading.value = true
  const snapshot = await getDocs(collection(db, 'books'))
  books.value = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
  currentPage.value = 1
  isLoading.value = false
}

const openBook = id => router.push(`/books/${id}`)
const toggleBookmark = book => { if (!currentUser.value) return alert('Please login first'); bookStore.toggleBookmark(book, currentUser.value.uid) }
const isBookmarked = id => bookStore.isBookmarked(id)
const rateBook = async (bookId, rating) => { ratings.value[bookId] = rating; await setDoc(doc(db, 'ratings', bookId), { rating }, { merge: true }) }
const loadRatings = () => { onSnapshot(collection(db, 'ratings'), snapshot => snapshot.forEach(doc => ratings.value[doc.id] = doc.data().rating)) }

onMounted(async () => { await fetchBooks(); loadRatings(); window.addEventListener('resize', handleResize) })
onUnmounted(() => window.removeEventListener('resize', handleResize))
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
