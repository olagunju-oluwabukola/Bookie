<template>
 <div>
  <HomeHero/>
  <HomeBooksCarousel/>
  <HomeFeatures/>
  <HomeCategories/>
 </div>
</template>


<script setup>
definePageMeta({
    layout: 'default',
    title: 'Home Page',
})
,
useSeoMeta({
  title: 'Home - Bookie',
  description: 'A literary odyssey with our groundbreaking library app.',
})
</script>