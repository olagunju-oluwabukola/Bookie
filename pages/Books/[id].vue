<template>
  <div class="max-w-6xl mx-auto py-10 px-4 relative">
    <!-- Auth Overlay -->
    <div v-if="!user" class="absolute inset-0 bg-white/70 backdrop-blur-sm z-20 flex items-center justify-center">
      <div class="w-full max-w-md p-6">
        <component
          :is="showSignUp ? SignUpForm : SignInForm"
          @success="onAuthSuccess"
          @switch="toggleAuthForm"
        />
      </div>
    </div>

    <div :class="{'blur-sm pointer-events-none': !user}" class="bg-white rounded-xl shadow-md p-6">
      <button @click="$router.back()" class="text-orange-600 mb-6 flex items-center gap-2 hover:underline">
        ← Go Back
      </button>

      <div class="md:flex gap-8">
        <div class="md:w-1/3 md:sticky md:top-24 mb-6 md:mb-0">
          <img :src="book?.coverUrl" alt="cover" class="w-full h-64 object-cover rounded shadow-md mb-4" />
          <h1 class="text-2xl font-bold text-orange-800">{{ book?.title }}</h1>
          <p class="text-sm text-gray-600 mb-2">by {{ book?.author }}</p>
          <p class="text-sm text-gray-500 mb-4">
            Uploaded by: <strong>{{ book?.uploadedBy || 'Unknown' }}</strong>
          </p>
          <div class="flex gap-3 mb-4">
            <button @click="downloadBook(book)" class="px-4 py-2 bg-orange-600 text-white rounded-md">Download</button>
            <button
              @click="toggleBookmark(book)"
              :class="isBookmarked ? 'bg-gray-200' : 'bg-white border'"
              class="px-4 py-2 rounded-md border"
            >
              <span v-if="isBookmarked">Bookmarked ✓</span>
              <span v-else>Bookmark</span>
            </button>
          </div>
          <div class="text-gray-700">
            <h4 class="font-semibold">About</h4>
            <p class="mt-2">{{ book?.description }}</p>
          </div>
        </div>

        <div class="md:w-2/3">
          <h3 class="text-lg font-semibold mb-4">Reviews</h3>

          <!-- Add Review -->
          <div v-if="user" class="mb-4 flex gap-2">
            <input
              v-model="newReview"
              type="text"
              placeholder="Write your review..."
              class="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-orange-500"
            />
            <button @click="postReview" :disabled="isPosting" class="px-4 py-2 bg-orange-600 text-white rounded-md">
              {{ isPosting ? 'Posting...' : 'Post' }}
            </button>
          </div>
          <div v-else class="text-gray-500 mb-4">Sign in to post a review.</div>

          <!-- Review List -->
          <div class="max-h-[500px] overflow-y-auto space-y-3">
            <div
              v-for="(r, idx) in book?.reviews || []"
              :key="idx"
              class="p-3 bg-gray-50 rounded flex items-start gap-3 relative"
            >
              <div
                class="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-lg"
                :style="{ backgroundColor: getColorFromName(r.user) }"
              >
                {{ r.user.charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-center">
                  <div class="text-sm font-semibold">{{ r.user }}</div>

                  <!-- Edit/Delete Menu (only for review owner) -->
                  <div v-if="user?.email === r.userEmail" class="relative">
                    <lucide-dots-vertical @click="toggleMenu(idx)" class="w-5 h-5 cursor-pointer"/>
                    <div
                      v-if="menuOpen === idx"
                      class="absolute right-0 top-6 bg-white shadow-md rounded border z-30"
                    >
                      <button
                        @click="editReview(idx)"
                        class="block px-3 py-1 hover:bg-gray-100 w-full text-left text-sm"
                      >
                        Edit
                      </button>
                      <button
                        @click="deleteReview(idx)"
                        class="block px-3 py-1 hover:bg-gray-100 w-full text-left text-sm text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                <div class="text-sm text-gray-600 mt-1">{{ r.comment }}</div>
              </div>
            </div>
            <div v-if="!(book?.reviews && book.reviews.length)" class="text-gray-500">No reviews yet.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, auth } from '@/composables/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useBooksStore } from '@/stores/books';
import { useToast } from 'vue-toastification';
import SignInForm from '@/components/auth/sign-in.vue';
import SignUpForm from '@/components/auth/sign-up.vue';
import { DotsVertical } from 'lucide-vue-next';

const route = useRoute();
const id = route.params.id;

const toast = useToast();
const store = useBooksStore();

const book = ref(null);
const newReview = ref('');
const isPosting = ref(false);
const user = ref(null);
const showSignIn = ref(true);
const showSignUp = ref(false);
const menuOpen = ref(null);

const colors = ['#F97316','#F59E0B','#10B981','#3B82F6','#8B5CF6','#EC4899','#EF4444','#14B8A6','#F43F5E'];
const getColorFromName = (name) => {
  if (!name) return '#6B7280';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

// Auth state
onMounted(() => {
  onAuthStateChanged(auth, (u) => {
    user.value = u;
  });
});

// Load book
onMounted(async () => {
  try {
    const snap = await getDoc(doc(db, 'books', id));
    if (!snap.exists()) return;
    book.value = { id: snap.id, ...snap.data() };
  } catch (e) {
    console.error(e);
  }
});

// --- Download ---
const downloadBook = (b) => {
  if (!b?.fileUrl) return;
  const url = b.fileUrl.includes('?') ? b.fileUrl + '&dl=1' : b.fileUrl + '?dl=1';
  const a = document.createElement('a');
  a.href = url;
  a.download = b.title ? `${b.title}.pdf` : 'book.pdf';
  document.body.appendChild(a);
  a.click();
  a.remove();
};

// Bookmark
const isBookmarked = computed(() => !!store.bookmarks.find(x => x.id === id));
const toggleBookmark = (b) => {
  if (isBookmarked.value) store.removeBookmark(id);
  else store.addBookmark({ id: b.id, title: b.title, coverUrl: b.coverUrl, author: b.author });
};

// Post review
const postReview = async () => {
  if (!newReview.value.trim() || !user.value) return;
  isPosting.value = true;
  const reviewData = {
    user: user.value.displayName || user.value.email,
    userEmail: user.value.email,
    comment: newReview.value.trim(),
    createdAt: new Date()
  };
  try {
    await updateDoc(doc(db, 'books', id), { reviews: arrayUnion(reviewData) });
    book.value.reviews = book.value.reviews ? [...book.value.reviews, reviewData] : [reviewData];
    newReview.value = '';
    toast.success('Review posted!');
  } catch (err) { console.error(err); toast.error('Failed to post review'); }
  finally { isPosting.value = false; }
};

// Toggle menu
const toggleMenu = (idx) => {
  menuOpen.value = menuOpen.value === idx ? null : idx;
};

// Edit review
const editReview = (idx) => {
  const r = book.value.reviews[idx];
  newReview.value = r.comment;
  deleteReview(idx, false); // remove original, keep menu open
  menuOpen.value = null;
};

// Delete review
const deleteReview = async (idx, confirmDelete = true) => {
  const r = book.value.reviews[idx];
  if (confirmDelete && !confirm('Delete this review?')) return;
  try {
    await updateDoc(doc(db, 'books', id), { reviews: arrayRemove(r) });
    book.value.reviews.splice(idx, 1);
    toast.success('Review deleted!');
  } catch (err) { console.error(err); toast.error('Failed to delete review'); }
  menuOpen.value = null;
};

// Auth overlay
const toggleAuthForm = () => { showSignUp.value = !showSignUp.value; showSignIn.value = !showSignIn.value; };
const onAuthSuccess = (u) => { user.value = u; };
</script>
