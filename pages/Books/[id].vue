<template>
  <div class="max-w-6xl mx-auto py-16 px-4 flex flex-col lg:flex-row gap-8 relative">
    <div v-if="!currentUser" class="absolute inset-0 z-50 bg-white/70 backdrop-blur-md flex items-center justify-center">
      <div class="bg-white rounded-xl p-8 shadow-lg text-center max-w-sm">
        <h2 class="text-xl font-bold mb-4">please, Login or sign up to access this book😒</h2>

        <div class="flex gap-4 justify-center">
          <router-link to="/sign-in" class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">Login</router-link>
          <router-link to="/sign-up" class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">Sign Up</router-link>
        </div>
      </div>
    </div>

    <div :class="{'blur-sm pointer-events-none': !currentUser}" class="w-full lg:w-1/3">
      <img :src="book.coverUrl" alt="Book Cover" class="w-full rounded-xl shadow-md" />
       <div class="mt-6">
        <button
  @click="downloadBook"
  class="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition flex items-center justify-center gap-2"
>
  <Loader2 v-if="downloading" class="w-5 h-5 animate-spin" />
  <span>{{ downloading ? 'Downloading...' : 'Download Book' }}</span>
</button>

      </div>
    </div>
    <div :class="{'blur-sm pointer-events-none': !currentUser}" class="flex-1 flex flex-col gap-6">
      <h1 class="text-xl md:text-3xl font-bold text-orange-800">{{ book.title }}</h1>
      <p class="text-gray-600 text-xs md:text-sm "> <span class="font-bold">Author : </span> {{ book.author }}</p>
      <div class="text-gray-700 text-xs md:text-sm"> <span class="font-bold">Category :</span> {{ book.category }}</div>
      <div class="mt-4 text-gray-800 text-xs md:text-sm"> <span class="font-bold"> Description : </span>{{ book.description }}</div>
      <div class="mt-2  text-xs md:text-sm"> <span class="font-bold">Uploaded by :</span>  {{ book.uploadedBy }} on {{ formatDate(book.uploadedAt) }}</div>

      <!-- Rating -->
      <div class="flex items-center gap-2 mt-4">
        <span class="font-nold">Rating:</span>
        <svg
          v-for="n in 5"
          :key="n"
          @click="rateBook(book.id, n)"
          class="w-6 h-6 cursor-pointer"
          fill="currentColor"
          :class="n <= (ratings[book.id] || 0) ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'"
          viewBox="0 0 20 20"
        >
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.176c.969 0 1.371 1.24.588 1.81l-3.376 2.455a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.538 1.118l-3.376-2.454a1 1 0 00-1.176 0l-3.376 2.454c-.783.57-1.838-.197-1.538-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.048 9.397c-.783-.57-.38-1.81.588-1.81h4.176a1 1 0 00.95-.69l1.287-3.97z"
          />
        </svg>
      </div>

      <!-- Reviews -->
      <div class="mt-6">
        <h2 class="text-xl font-semibold mb-2">Reviews</h2>

        <div class="flex gap-2 mb-4">
          <input v-model="newReview" type="text" placeholder="Add a review..."
                 class="flex-1 border border-gray-300 rounded-lg px-3 py-2" />
          <button @click="postReview" class="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition">
            {{ editId ? 'Update' : 'Post' }}
          </button>
        </div>

        <!-- Review list -->
        <div v-if="reviews.length">
          <div v-for="rev in sortedReviews" :key="rev.id" class="flex items-start gap-3 mb-4 relative">

            <div class="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">
              {{ (rev.user || 'A').charAt(0).toUpperCase() }}
            </div>

            <div class="flex-1 bg-gray-100 p-3 rounded-lg relative">
              <p>{{ rev.comment }}</p>

              <div v-if="rev.userId === currentUser?.uid" class="absolute top-2 right-2">
                <button @click="toggleMenu(rev.id)" class="px-2 text-gray-500 hover:text-gray-800">⋮</button>
                <div v-if="menuId === rev.id" class="absolute right-0 mt-2 w-24 bg-white border border-gray-300 rounded shadow-lg z-20">
                  <button @click="startEdit(rev)" class="w-full text-left px-3 py-1 hover:bg-gray-100">Edit</button>
                  <button @click="confirmDelete(rev.id)" class="w-full text-left px-3 py-1 hover:bg-red-100 text-red-500">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-gray-500">No reviews yet.</div>
      </div>

      <div v-if="deleteId" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm flex flex-col items-center gap-4">
         <Trash2 class="text-red-600"/>
          <p>Are you sure you want to delete this review?</p>
          <div class="flex gap-4">
            <button @click="deleteReviewConfirmed(deleteId)" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">Yes</button>
            <button @click="deleteId=null" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition">No</button>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { db } from '@/composables/firebase'
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {  Trash2 } from 'lucide-vue-next'
import { useToast } from 'vue-toastification'
import { Loader2 } from 'lucide-vue-next'

const toast = useToast()
const downloading = ref(false)

const downloadBook = async () => {
  if (!currentUser.value) {
    toast.warning('Please log in to download the book.')
    return
  }
  if (!book.value.fileUrl) {
    toast.error('No download link found.')
    return
  }

  try {
    downloading.value = true
    const response = await fetch(book.value.fileUrl)
    if (!response.ok) throw new Error('Failed to fetch file.')

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${book.value.title || 'book'}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    toast.success('Book downloaded successfully!')
  } catch (err) {
    console.error(err)
    toast.error('Failed to download book.')
  } finally {
    downloading.value = false
  }
}

const route = useRoute()
const bookId = route.params.id
const book = ref({})
const ratings = ref({})
const reviews = ref([])
const newReview = ref('')
const editId = ref(null)
const menuId = ref(null)
const deleteId = ref(null)

const auth = getAuth()
const currentUser = ref(null)
onAuthStateChanged(auth, user => { currentUser.value = user })

const fetchBook = async () => {
  const docSnap = await getDoc(doc(db, 'books', bookId))
  if (docSnap.exists()) book.value = { id: docSnap.id, ...docSnap.data() }
}

const loadRatings = async () => {
  const docSnap = await getDoc(doc(db, 'ratings', bookId))
  if (docSnap.exists()) ratings.value[bookId] = docSnap.data().rating
}

const rateBook = async (bookId, rating) => {
  if (!currentUser.value) return alert('Login required')
  ratings.value[bookId] = rating
  await setDoc(doc(db, 'ratings', bookId), { rating, userId: currentUser.value.uid }, { merge: true })
}

const loadReviews = async () => {
  const qSnap = await getDocs(collection(db, `books/${bookId}/reviews`))
  reviews.value = qSnap.docs.map(d => ({ id: d.id, ...d.data() }))
}

const sortedReviews = computed(() => [...reviews.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))

const startEdit = (rev) => {
  editId.value = rev.id
  newReview.value = rev.comment
  menuId.value = null
}

const postReview = async () => {
  if (!currentUser.value) return alert('Login required')
  if (!newReview.value.trim()) return

  if (editId.value) {
    const reviewRef = doc(db, `books/${bookId}/reviews/${editId.value}`)
    await setDoc(reviewRef, { comment: newReview.value }, { merge: true })
    const rev = reviews.value.find(r => r.id === editId.value)
    rev.comment = newReview.value
    editId.value = null
  } else {
    const revId = Date.now().toString()
    const reviewRef = doc(db, `books/${bookId}/reviews/${revId}`)
    await setDoc(reviewRef, {
      comment: newReview.value,
      userId: currentUser.value.uid,
      user: currentUser.value.displayName || 'Anonymous',
      createdAt: new Date()
    })
    reviews.value.push({ id: revId, comment: newReview.value, user: currentUser.value.displayName || 'Anonymous', userId: currentUser.value.uid, createdAt: new Date() })
  }

  newReview.value = ''
}

const confirmDelete = (id) => { deleteId.value = id; menuId.value = null }
const deleteReviewConfirmed = async (id) => {
  await deleteDoc(doc(db, `books/${bookId}/reviews/${id}`))
  reviews.value = reviews.value.filter(r => r.id !== id)
  deleteId.value = null
}

const toggleMenu = (id) => { menuId.value = menuId.value === id ? null : id }

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleString()
}

onMounted(async () => {
  await fetchBook()
  await loadRatings()
  await loadReviews()
})


useSeoMeta({
  title: "Download - Bookie",
  description: "Flip through the pages with so much confidence to draw lessons"
})
</script>
