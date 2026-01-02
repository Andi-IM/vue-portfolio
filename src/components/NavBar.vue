<script setup lang="ts">
import { ref } from 'vue';
import { Menu, X, Download } from 'lucide-vue-next';

const isMenuOpen = ref(false);

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
              { label: $t('nav.tools'), id: 'tools' },
              { label: $t('nav.projects'), id: 'projects' },
              { label: $t('nav.experience'), id: 'experience' },
              { label: $t('nav.contact'), id: 'contact' },
            ]"
            :key="item.id"
            @click="handleScroll(item.id)"
            class="navbar-link"
          >
            {{ item.label }}
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
        <div class="navbar-mobile-btn">
          <button @click="toggleMenu" class="text-gray-300 hover:text-white p-2">
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
            { label: $t('nav.tools'), id: 'tools' },
            { label: $t('nav.projects'), id: 'projects' },
            { label: $t('nav.experience'), id: 'experience' },
            { label: $t('nav.contact'), id: 'contact' },
          ]"
          :key="item.id"
          @click="handleScroll(item.id)"
          class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
        >
          {{ item.label }}
        </button>
        <a
          href="https://pub-1d2d5180bcb0450bb6d122152ab25b6d.r2.dev/cv-andi-irham-2025.pdf"
          download
          class="text-blue-400 hover:text-blue-300 block px-3 py-2 rounded-md text-base font-medium w-full text-left flex items-center gap-2"
        >
          <Download :size="16" />
          {{ $t('nav.downloadCv') }}
        </a>
      </div>
    </div>
  </nav>
</template>
