<template>
    <div class="">
  <NuxtLayout>
    <NuxtPage  />
  </NuxtLayout>
    </div>
</template>

<script>
definePageMeta({
  head: {
    link: [
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap'
      }
    ]
  }
});

</script>



<style>
.Vue-Toastification__toast {
  background: linear-gradient(to right, #f59e0b, #ea580c) !important; /* yellow-orange gradient */
  color: white !important;
  font-weight: 500;
  border-radius: 0.75rem !important;
  box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3);
}

.Vue-Toastification__progress-bar {
  background: white !important;
}

</style>