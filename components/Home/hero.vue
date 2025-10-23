<template>
  <div class=" py-10 md:pt-32 pb-16 px-4">
    <div class="max-w-5xl mx-auto text-center">
      <h1 class="text-3xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
        Good books don't give
        <span class="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent">
         up all their secrets at once,
        </span> keep turning the page
      </h1>

      <p class="text-[16px] md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
        Discover a literary odyssey with our groundbreaking library app, seamlessly
        transcending traditional boundaries for effortless book exploration. ✨
      </p>
<NuxtLink to="/sign-up">
  <button
        class="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto"
      >
        Start Today
        <ArrowRight class="w-5 h-5" />
      </button>
</NuxtLink>


      <div class="mt-12 flex items-center justify-center gap-4">
        <div class="flex -space-x-3">
          <img
            v-for="(avatar, i) in userAvatars"
            :key="i"
            :src="avatar"
            alt="User"
            class="w-12 h-12 rounded-full border-4 border-white shadow-md"
          />
        </div>
        <p class="text-gray-700 font-medium">
          With over <span class="font-bold text-gray-900">5k</span> readers
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowRight } from 'lucide-vue-next';

const userAvatars = [
  'https://i.pravatar.cc/150?img=1',
  'https://i.pravatar.cc/150?img=2',
  'https://i.pravatar.cc/150?img=3',
  'https://i.pravatar.cc/150?img=4',
  'https://i.pravatar.cc/150?img=5'
];
</script>
