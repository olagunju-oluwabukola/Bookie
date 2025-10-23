<template>
  <div class="min-h-screen ">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <h1 class=" text-xl md:text-4xl font-bold  bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-700 bg-clip-text text-transparent mb-12">My Profile</h1>
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">

        <div
          class="bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-700 rounded-xl shadow-lg p-8 text-white relative overflow-hidden"
        >
          <div class="flex flex-col items-center relative z-10">
            <div class="relative w-32 h-32 mb-4">
              <img
                :src="profile.photoURL || defaultAvatar"
                alt="Profile Photo"
                class="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
              />

              <div
                v-if="isUploadingPhoto"
                class="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full animate-spin text-orange-600"
              >
                <loader/>
              </div>

              <button
                @click="triggerFileUpload"
                class="absolute bottom-2 right-2 bg-white text-orange-600 p-2 rounded-full shadow hover:bg-orange-50 transition"
                :disabled="isUploadingPhoto"
              >
              <camera/>
              </button>

              <input
                ref="fileInput"
                type="file"
                class="hidden"
                accept="image/*"
                @change="handlePhotoUpload"
              />
            </div>

            <h2 class="text-lg md:text-xl font-bold mb-1">
              {{ profile.fullName || profile.username }}
            </h2>

          </div>
          <div class="absolute inset-0 bg-orange-700/10 blur-2xl rounded-xl"></div>
        </div>

        <!-- Stats Cards -->
        <div
          v-for="(item, key) in statCards"
          :key="key"
          class="stat-card flex flex-col justify-between relative overflow-hidden"
        >
          <div class="flex items-center justify-between">
            <p class="text-xs md:text-sm opacity-90 mt-1">{{ item.subtext }}</p>
            <component :is="item.icon" class="w-6 h-6 opacity-80" />
          </div>
          <p class="text-xl md:text-5xl font-bold mt-2 text-right ">{{ item.count }}</p>
           <h3 class="text-sm md:text-lg font-semibold">{{ item.title }}</h3>
        </div>
      </div>

 <!-- profile form -->
      <div class="bg-white rounded-xl shadow-lg p-8 mt-8 transition-all duration-300">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg md:text-xl font-bold text-gray-900">
            {{ isEditing ? 'Edit Profile Information' : 'Profile Information' }}
          </h3>
          <button
            @click="toggleEdit"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition transform hover:scale-105"
            :class="
              isEditing
                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                : 'bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-700 text-white hover:opacity-90'
            "
          >
            <span v-if="isEditing">Cancel</span>
            <span v-else>Edit Profile</span>
          </button>
        </div>

        <transition name="slide-fade">
          <div v-show="true">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <dashboard-form-input
                label="Full Name"
                v-model="profile.fullName"
                :disabled="!isEditing"
              />
              <dashboard-form-input
                label="Username"
                v-model="profile.username"
                :disabled="!isEditing"
                prefix="@"
              />
              <dashboard-form-input
                label="Twitter/X"
                v-model="profile.twitter"
                :disabled="!isEditing"
              />
              <dashboard-form-input
                label="LinkedIn"
                v-model="profile.linkedin"
                :disabled="!isEditing"
              />
              <dashboard-form-input
                label="Favorite Read"
                v-model="profile.favoriteRead"
                :disabled="!isEditing"
              />
              <dashboard-form-input
                label="Favorite Author"
                v-model="profile.favoriteAuthor"
                :disabled="!isEditing"
              />
            </div>

            <transition name="fade">
              <div v-if="isEditing" class="mt-6 flex justify-end gap-3">
                <button
                  @click="cancelEdit"
                  class="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  @click="saveProfile"
                  :disabled="isSaving"
                  class="px-6 py-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-700 hover:opacity-90 text-white rounded-lg transition flex items-center gap-2"
                >
                 <div v-if="isSaving" class="animate-spin">
                  <loader/>
                 </div>
                  {{ isSaving ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </transition>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import { UploadIcon, Bookmark, MessageCircle, Loader, Camera, Upload, User } from 'lucide-vue-next'

const toast = useToast()
const db = getFirestore()
const auth = getAuth()

const isEditing = ref(false)
const isSaving = ref(false)
const isUploadingPhoto = ref(false)
const defaultAvatar = 'https://i.pravatar.cc/150?img=2'
const fileInput = ref(null)

const profile = ref({
  fullName: '',
  username: '',
  photoURL: '',
  twitter: '',
  linkedin: '',
  favoriteRead: '',
  favoriteAuthor: ''
})

const stats = ref({
  uploaded: { total: 0, approved: 0, pending: 0 },
  reviews: 0,
  bookmarks: 0
})

const user = ref(null)
const originalProfile = ref({})

const fallbackName = computed(
  () => user.value?.displayName || user.value?.email?.split('@')[0] || 'New User'
)
const fallbackUsername = computed(
  () => user.value?.email?.split('@')[0] || 'username'
)

onMounted(() => {
  onAuthStateChanged(auth, async (u) => {
    if (u) {
      user.value = u
      await loadProfile()
      await loadStats()
    }
  })
})

const toggleEdit = () => {
  isEditing.value = !isEditing.value
  if (!isEditing.value) cancelEdit()
}

const loadProfile = async () => {
  const profileDoc = await getDoc(doc(db, 'users', user.value.uid))
  if (profileDoc.exists()) {
    profile.value = { ...profile.value, ...profileDoc.data() }
  } else {
    profile.value.fullName = fallbackName.value
    profile.value.username = fallbackUsername.value
  }
  originalProfile.value = { ...profile.value }
}

const loadStats = async () => {
  try {
    const booksSnap = await getDocs(
      query(collection(db, 'books'), where('uploadedBy', '==', profile.value.fullName))
    )
    let approved = 0,
      pending = 0
    booksSnap.forEach((doc) => {
      const data = doc.data()
      if (data.approvalStatus === 'approved') approved++
      else pending++
    })
    stats.value.uploaded = { total: booksSnap.size, approved, pending }

    const reviewsSnap = await getDocs(query(collection(db, 'books')))
    let reviewCount = 0
    reviewsSnap.forEach((doc) => {
      const data = doc.data()
      if (Array.isArray(data.reviews)) {
        reviewCount += data.reviews.filter(
          (r) => r.user === profile.value.fullName
        ).length
      }
    })
    stats.value.reviews = reviewCount

    const bookmarksSnap = await getDocs(
      query(collection(db, 'bookmarks'), where('userId', '==', user.value.uid))
    )
    stats.value.bookmarks = bookmarksSnap.size
  } catch (error) {
    console.error(error)
  }
}

const saveProfile = async () => {
  try {
    if (isSaving.value) return
    isSaving.value = true
    await setDoc(doc(db, 'users', user.value.uid), profile.value, { merge: true })
    toast.clear()
    toast.success('Profile updated successfully!')
    originalProfile.value = { ...profile.value }
    isEditing.value = false
  } catch (e) {
    toast.clear()
    toast.error('⚠️ Error updating profile.')
  } finally {
    isSaving.value = false
  }
}

const cancelEdit = () => {
  profile.value = { ...originalProfile.value }
  isEditing.value = false
}

const triggerFileUpload = () => fileInput.value.click()

const handlePhotoUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  isUploadingPhoto.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'bookie')

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/daqaratep/image/upload`,
      formData
    )
    profile.value.photoURL = res.data.secure_url
    await saveProfile()
    toast.clear()
    toast.success('Profile picture updated!')
  } catch (error) {
    console.error(error)
    toast.clear()
    toast.error('Error uploading photo.')
  } finally {
    isUploadingPhoto.value = false
  }
}

const statCards = computed(() => [
  {
    title: 'Uploaded Books',
    icon: UploadIcon,
    count: stats.value.uploaded.total,
    subtext: `Approved: ${stats.value.uploaded.pending} • Pending: ${stats.value.uploaded.approved}`
  },
  {
    title: 'Reviews',
    icon: MessageCircle,
    count: stats.value.reviews,
    subtext: 'Books reviewed'
  },
  {
    title: 'Bookmarks',
    icon: Bookmark,
    count: stats.value.bookmarks,
    subtext: 'Saved books'
  }
])


useSeoMeta({
  title: "My Profile - Bookie"
})
</script>

<style scoped>
.stat-card {
  @apply bg-gradient-to-br from-yellow-400 via-orange-500 to-orange-700 rounded-xl shadow-lg p-6 text-white transition transform hover:-translate-y-1 hover:shadow-2xl;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.4s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
