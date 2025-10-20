import { defineStore } from 'pinia'
import { db } from '@/composables/firebase'
import { doc, setDoc, deleteDoc, getDocs, collection, query, where } from 'firebase/firestore'

export const useBookStore = defineStore('bookmarks', {
  state: () => ({
    bookmarks: []
  }),

  actions: {
    async loadBookmarks(userId) {
      const q = query(collection(db, 'bookmarks'), where('userId', '==', userId))
      const snapshot = await getDocs(q)
      this.bookmarks = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
    },

    async toggleBookmark(book, userId) {
      const exists = this.bookmarks.find(b => b.id === book.id)
      if (exists) {
        this.bookmarks = this.bookmarks.filter(b => b.id !== book.id)
        await deleteDoc(doc(db, 'bookmarks', book.id))
      } else {
        const bookWithUser = { ...book, userId }
        this.bookmarks.push(bookWithUser)
        await setDoc(doc(db, 'bookmarks', book.id), bookWithUser)
      }
    },

    isBookmarked(id) {
      return this.bookmarks.some(b => b.id === id)
    }
  }
})
