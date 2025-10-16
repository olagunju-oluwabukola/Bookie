<template>
  <footer class="bg-gradient-to-r from-orange-700 via-orange-600 to-orange-500 text-white mt-16">
    <div class="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div class="space-y-4 flex flex-col">
        <div class="flex items-center gap-2">
          <img src="../assets/images/logo.png" alt="Logo" class="h-10 w-auto" />
          <span class="text-2xl font-extrabold bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-700 bg-clip-text text-transparent">
            Bookie
          </span>
        </div>
        <p class="text-gray-100 text-sm">
          Building modern web experiences with passion. Stay connected with us for the latest updates and insights.
        </p>
      </div>
      <div>
        <h3 class="font-semibold text-lg mb-4">Quick Links</h3>
        <ul class="space-y-2">
          <li>
            <NuxtLink to="/" class="hover:underline">Home</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/about" class="hover:underline">About</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/services" class="hover:underline">Services</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/contact" class="hover:underline">Contact</NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Resources -->
      <div>
        <h3 class="font-semibold text-lg mb-4">Resources</h3>
        <ul class="space-y-2">
          <li>
            <NuxtLink to="/blog" class="hover:underline">Blog</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/faq" class="hover:underline">FAQ</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/support" class="hover:underline">Support</NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Contact Info -->
      <div>
        <h3 class="font-semibold text-lg mb-4">Contact Us</h3>
        <ul class="space-y-2 text-gray-100 text-sm">
          <li>Email: ofeyishayomi@gmail.com</li>
          <li>Phone: +234 803 858 1725</li>
          <li>Address: Lagos, Nigeria</li>
        </ul>
      </div>
    </div>

    <div class="border-t border-orange-700 text-gray-100 text-sm py-4 text-center">
      &copy; {{ new Date().getFullYear() }} Your Company. All rights reserved.
    </div>
  </footer>
</template>

]
