<script setup lang="ts">
import { Github, Linkedin, Mail } from 'lucide-vue-next'
</script>

<template>
  <footer class="bg-gray-900 border-t border-gray-800 py-8">
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4"
    >
      <div class="text-gray-400 text-sm">&copy; 2024 Andi Irham. All rights reserved.</div>
      <div class="flex gap-6">
        <a href="https://github.com/Andi-IM" class="text-gray-500 hover:text-white transition-colors"
          ><Github :size="20"
        /></a>
        <a href="https://www.linkedin.com/in/andiirham/" class="text-gray-500 hover:text-white transition-colors"
          ><Linkedin :size="20"
        /></a>
        <a href="mailto:andi.irhamm@gmail.com" class="text-gray-500 hover:text-white transition-colors"><Mail :size="20" /></a>
      </div>
    </div>
  </footer>
</template>
