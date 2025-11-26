<script setup lang="ts">
import { ref } from 'vue'
import { Menu, X, Download } from 'lucide-vue-next'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const emit = defineEmits<{
  (e: 'scrollToSection', id: string): void
}>()

const handleScroll = (id: string) => {
  emit('scrollToSection', id)
  isMenuOpen.value = false
}
</script>

<template>
  <nav class="fixed w-full z-40 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        <div class="flex-shrink-0 font-bold text-2xl text-blue-500 tracking-wider">
          Andi<span class="text-white">IM.</span>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-8">
            <button
              v-for="item in ['Tentang', 'Tools', 'Proyek', 'Pengalaman', 'Kontak']"
              :key="item"
              @click="handleScroll(item.toLowerCase())"
              class="hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
            >
              {{ item }}
            </button>
            <a
              href=""
              download
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all hover:scale-105"
            >
              <Download :size="16" />
              Unduh CV
            </a>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <button @click="toggleMenu" class="text-gray-300 hover:text-white p-2">
            <X v-if="isMenuOpen" :size="24" />
            <Menu v-else :size="24" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Dropdown -->
    <div v-if="isMenuOpen" class="md:hidden bg-gray-800 border-b border-gray-700">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <button
          v-for="item in ['Tentang', 'Tools', 'Proyek', 'Pengalaman', 'Kontak']"
          :key="item"
          @click="handleScroll(item.toLowerCase())"
          class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
        >
          {{ item }}
        </button>
        <a
          href="https://pub-1d2d5180bcb0450bb6d122152ab25b6d.r2.dev/Profile.pdf"
          download
          class="text-blue-400 hover:text-blue-300 block px-3 py-2 rounded-md text-base font-medium w-full text-left flex items-center gap-2"
        >
          <Download :size="16" />
          Unduh CV
        </a>
      </div>
    </div>
  </nav>
</template>
