import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useBooksStore = defineStore('books', () => {
  const bookmarks = ref([]);

  function addBookmark(book) {
    if (!bookmarks.value.find(b => b.id === book.id)) {
      bookmarks.value.push(book);
    }
  }

  function removeBookmark(id) {
    bookmarks.value = bookmarks.value.filter(b => b.id !== id);
  }

  return { bookmarks, addBookmark, removeBookmark };
});
