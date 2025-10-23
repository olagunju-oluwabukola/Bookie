<template>
  <div class="max-w-xl mx-auto">
    <div v-if="!user" class="absolute inset-0 bg-white/70 backdrop-blur-sm z-20 flex items-center justify-center">
      <div class="w-full max-w-md p-6">
        <component
          :is="showSignUp ? SignUpForm : SignInForm "
          @success="onAuthSuccess"
          @switch="toggleAuthForm"
        />
      </div>
    </div>

    <!-- Upload form -->
    <div :class="{'blur-sm pointer-events-none': !user}" class="bg-white shadow-md rounded-xl p-6">
      <div>Go back</div>
      <h2 class="text-2xl font-bold text-orange-700 mb-4">📚 Upload New Book</h2>

      <form @submit.prevent="uploadBook" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input v-model="title" type="text" required class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500"/>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Author</label>
          <input v-model="author" type="text" required class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500"/>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select v-model="category" required class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500">
            <option disabled value="">Select Category</option>
            <option>Fiction</option>
            <option>Business</option>
            <option>Self-Help</option>
            <option>Technology</option>
            <option>Science</option>
            <option>Biography</option>
            <option>Religion</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Uploaded By</label>
          <input v-model="uploadedBy" type="text" required readonly class="w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"/>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea v-model="description" rows="3" class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500" placeholder="Brief description about the book"></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
          <input type="file" accept="image/*" @change="handleCoverChange" class="w-full border rounded-lg p-2"/>
          <div v-if="coverPreview" class="mt-2">
            <img :src="coverPreview" class="w-32 h-48 object-cover rounded-lg"/>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Book File (PDF)</label>
          <input type="file" accept=".pdf" @change="handleFileChange" class="w-full border rounded-lg p-2"/>
          <p v-if="fileName" class="text-sm text-gray-500 mt-1">📄 {{ fileName }}</p>
        </div>

        <button type="submit" :disabled="isUploading" class="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg font-semibold">


  <template v-if="isUploading">
    <svg
      class="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
  </template>
  <template v-else>
    Upload Book
  </template>
</button>


        <p v-if="message" class="text-center mt-3 text-sm text-gray-600">{{ message }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
title: "Upload a book - Bookie",
description: "Contribute to our collection of books"
})
import { ref, onMounted } from 'vue'
import { auth } from '@/composables/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useToast } from 'vue-toastification'
import axios from 'axios'
import { db } from '@/composables/firebase'
import { collection, addDoc } from 'firebase/firestore'
import SignInForm from '@/components/auth/sign-in.vue'
import SignUpForm from '@/components/auth/sign-up.vue'

const toast = useToast()

const title = ref('')
const author = ref('')
const category = ref('')
const uploadedBy = ref('')
const description = ref('')
const cover = ref(null)
const file = ref(null)
const coverPreview = ref('')
const fileName = ref('')
const isUploading = ref(false)
const message = ref('')
const user = ref(null)
const showSignIn = ref(true)
const showSignUp = ref(false)
const CLOUD_NAME = 'daqaratep'
const UPLOAD_PRESET = 'bookie'

onMounted(() => {
  onAuthStateChanged(auth, (u) => {
    user.value = u
    uploadedBy.value = u?.displayName || ''
  })
})

const handleCoverChange = (e) => {
  cover.value = e.target.files[0]
  if (cover.value) coverPreview.value = URL.createObjectURL(cover.value)
}

const handleFileChange = (e) => {
  file.value = e.target.files[0]
  fileName.value = file.value?.name || ''
}

// Cloudinary
const uploadToCloudinary = async (file, folder, isPDF = false) => {
  if (!file) throw new Error('File is missing')
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  if (folder) formData.append('folder', folder)
  if (isPDF) formData.append('resource_type', 'raw')

  const endpoint = isPDF
    ? `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`
    : `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`

  const response = await axios.post(endpoint, formData)
  return response.data.secure_url
}

const uploadBook = async () => {
  if (!user.value) {
    toast.warning('Please sign in first.')
    return
  }
  if (!cover.value || !file.value || !title.value || !author.value || !category.value) {
    toast.warning('Please fill all required fields.')
    return
  }

  isUploading.value = true
  try {
    const coverUrl = await uploadToCloudinary(cover.value, 'book_covers')
    const fileUrl = await uploadToCloudinary(file.value, 'books', true)

    await addDoc(collection(db, 'books'), {
      title: title.value,
      author: author.value,
      category: category.value,
      uploadedBy: uploadedBy.value,
      description: description.value,
      coverUrl,
      fileUrl,
      uploadedAt: new Date(),
    })

    toast.success('Book uploaded successfully!')
    title.value = author.value = category.value = description.value = ''
    cover.value = file.value = null
    coverPreview.value = fileName.value = ''
  } catch (err) {
    console.error(err)
    toast.error('Upload failed')
  } finally {
    isUploading.value = false
  }
}

const toggleAuthForm = () => {
  showSignUp.value = !showSignUp.value
  showSignIn.value = !showSignIn.value
}

const onAuthSuccess = (userInfo) => {
  user.value = userInfo
  uploadedBy.value = userInfo.displayName || userInfo.email || ''
}
</script>
