<script setup lang="ts">
import { Github, Linkedin, Mail } from 'lucide-vue-next';
</script>

<template>
  <footer
    class="py-10"
    style="background-color: var(--color-bg-footer); border-top: 1px solid var(--color-border)"
  >
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center gap-6"
    >
      <div class="text-sm whitespace-nowrap" style="color: var(--color-text-muted)">
        &copy; 2024 Andi Irham. {{ $t('footer.rights') }}
      </div>
      <div class="flex gap-8">
        <a
          href="https://github.com/Andi-IM"
          class="transition-colors hover:opacity-70"
          style="color: var(--color-text-muted)"
          aria-label="GitHub"
          ><Github :size="20"
        /></a>
        <a
          href="https://www.linkedin.com/in/andiirham/"
          class="transition-colors hover:opacity-70"
          style="color: var(--color-text-muted)"
          aria-label="LinkedIn"
          ><Linkedin :size="20"
        /></a>
<a
           href="mailto:mail@airham.my.id"
           class="transition-colors hover:opacity-70"
           style="color: var(--color-text-muted)"
           aria-label="Email"
           ><Mail :size="20"
         /></a>
      </div>
    </div>
  </footer>
</template>
