<script setup lang="ts">
import { ref } from 'vue';
import { Menu, X, Download, Sun, Moon } from 'lucide-vue-next';
import { useTheme } from '../composables/useTheme';

const isMenuOpen = ref(false);
const { isDark, toggleTheme } = useTheme();

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const emit = defineEmits<{
  (e: 'scrollToSection', id: string): void;
}>();

const handleScroll = (id: string) => {
  emit('scrollToSection', id);
  isMenuOpen.value = false;
};
</script>

<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-inner">
        <div class="navbar-logo">Andi<span>IM.</span></div>

        <!-- Desktop Menu -->
        <div class="navbar-desktop-menu">
          <button
            v-for="item in [
              { label: $t('nav.about'), id: 'about' },
              { label: $t('nav.projects'), id: 'projects' },
              { label: $t('nav.contact'), id: 'contact' },
            ]"
            :key="item.id"
            @click="handleScroll(item.id)"
            class="navbar-link"
          >
            {{ item.label }}
          </button>

          <!-- Theme Toggle Button -->
          <button
            @click="toggleTheme"
            class="navbar-link p-2 rounded-lg hover:bg-[var(--color-bg-card-hover)] transition-colors"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <Sun v-if="isDark" :size="20" />
            <Moon v-else :size="20" />
          </button>

          <a
            href="https://pub-1d2d5180bcb0450bb6d122152ab25b6d.r2.dev/cv-andi-irham-2025.pdf"
            download
            class="navbar-cta"
          >
            <Download :size="16" />
            {{ $t('nav.downloadCv') }}
          </a>
        </div>

        <!-- Mobile Menu Button -->
        <div class="navbar-mobile-btn flex items-center gap-2">
          <!-- Theme Toggle Button (Mobile) -->
          <button
            @click="toggleTheme"
            class="p-2 rounded-lg hover:bg-[var(--color-bg-card-hover)] transition-colors"
            style="color: var(--color-text-body)"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <Sun v-if="isDark" :size="20" />
            <Moon v-else :size="20" />
          </button>
          <button @click="toggleMenu" class="p-2" style="color: var(--color-text-body)">
            <X v-if="isMenuOpen" :size="24" />
            <Menu v-else :size="24" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Dropdown -->
    <div v-if="isMenuOpen" class="navbar-mobile-menu">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <button
          v-for="item in [
            { label: $t('nav.about'), id: 'about' },
            { label: $t('nav.projects'), id: 'projects' },
            { label: $t('nav.contact'), id: 'contact' },
          ]"
          :key="item.id"
          @click="handleScroll(item.id)"
          class="block px-3 py-2 rounded-md text-base font-medium w-full text-left hover:bg-[var(--color-bg-card-hover)]"
          style="color: var(--color-text-body)"
        >
          {{ item.label }}
        </button>
        <a
          href="https://pub-1d2d5180bcb0450bb6d122152ab25b6d.r2.dev/cv-andi-irham-2025.pdf"
          download
          class="block px-3 py-2 rounded-md text-base font-medium w-full text-left flex items-center gap-2"
          style="color: var(--color-primary)"
        >
          <Download :size="16" />
          {{ $t('nav.downloadCv') }}
        </a>
      </div>
    </div>
  </nav>
</template>
