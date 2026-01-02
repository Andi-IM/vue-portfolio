<script setup lang="ts">
import { Github, Linkedin, Mail } from 'lucide-vue-next';
</script>

<template>
  <footer class="bg-[#0A1628] border-t border-gray-800/50 py-10">
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center gap-6"
    >
      <div class="text-gray-400 text-sm whitespace-nowrap">
        &copy; 2024 Andi Irham. {{ $t('footer.rights') }}
      </div>
      <div class="flex gap-8">
        <a
          href="https://github.com/Andi-IM"
          class="text-gray-500 hover:text-white transition-colors"
          aria-label="GitHub"
          ><Github :size="20"
        /></a>
        <a
          href="https://www.linkedin.com/in/andiirham/"
          class="text-gray-500 hover:text-white transition-colors"
          aria-label="LinkedIn"
          ><Linkedin :size="20"
        /></a>
        <a
          href="mailto:andi.irhamm@gmail.com"
          class="text-gray-500 hover:text-white transition-colors"
          aria-label="Email"
          ><Mail :size="20"
        /></a>
      </div>
    </div>
  </footer>
</template>
