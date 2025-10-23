<template>
  <div class="bg-white/20 p-3 rounded-lg inline-flex items-center justify-center mb-4">
    <svg
      v-if="name === 'book-open'"
      xmlns="http://www.w3.org/2000/svg"
      :class="`h-${size} w-${size}`"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13M12 6.253C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13..." />
    </svg>
    <!-- Add other icons similarly -->
  </div>
</template>

<script setup>
defineProps({
  name: String,
  size: { type: String, default: '6' }
})
</script>
