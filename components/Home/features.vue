<template>
  <div class="py-16 px-4">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-4xl font-bold text-center bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-700 bg-clip-text text-transparent mb-12">Features</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="group relative bg-gradient-to-br from-orange-50 to-orange-100 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-orange-200/50"
          style="background: linear-gradient(135deg, rgba(234, 88, 12, 0.1) 0%, rgba(194, 65, 12, 0.15) 100%); backdrop-filter: blur(10px);"
        >

          <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-50 pointer-events-none"></div>


          <div class="absolute -top-4 left-6 w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 via-orange-600 to-orange-800 shadow-lg group-hover:scale-110 transition-transform duration-300"></div>
          <h3 class="text-xl font-bold text-orange-900 mb-3 mt-6">{{ feature.title }}</h3>
          <p class="text-gray-700 text-sm mb-4 leading-relaxed">{{ feature.description }}</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>

const features = [
  {
    title: 'Upload Books',
    description: 'Easily upload your favorite books to our platform. Share your collection with readers worldwide and contribute to our growing library.',

  },
  {
    title: 'Download Books',
    description: 'Access thousands of books instantly. Download and read offline anytime, anywhere. Build your personal digital library effortlessly.',

  },
  {
    title: 'Bookmark Books',
    description: 'Never lose track of your reading progress. Save your favorite books and create custom reading lists for easy access.',

  },
  {
    title: 'Personal Dashboard',
    description: 'Manage your entire reading experience in one place. View your bookmarks, uploads, downloads, and reading statistics.',

  }
];
</script>

<style scoped>

.group:hover {
  background: linear-gradient(135deg, rgba(234, 88, 12, 0.15) 0%, rgba(194, 65, 12, 0.2) 100%) !important;
}
</style>