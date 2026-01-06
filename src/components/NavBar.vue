<script setup lang="ts">
import { ref } from 'vue';
import { Menu, X, Download, Sun, Moon } from 'lucide-vue-next';
import { useTheme } from '../composables/useTheme';

export interface NavItem {
  label: string;
  id?: string;
  to?: string;
  isBold?: boolean;
}

const props = defineProps<{
  menuItems?: NavItem[];
}>();

const isMenuOpen = ref(false);
const { isDark, toggleTheme } = useTheme();

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const emit = defineEmits<{
  (e: 'scrollToSection', id: string): void;
}>();

const handleAction = (item: NavItem) => {
  if (item.id) {
    emit('scrollToSection', item.id);
  }
  isMenuOpen.value = false;
};

const defaultMenuItems: NavItem[] = [
  { label: 'nav.about', id: 'about' },
  { label: 'nav.projects', id: 'projects' },
  { label: 'nav.contact', id: 'contact' },
];

const items = props.menuItems || defaultMenuItems;

defineExpose({
  isMenuOpen,
});
</script>

<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-inner">
        <div class="navbar-logo">Andi<span>IM.</span></div>

        <!-- Desktop Menu -->
        <div class="navbar-desktop-menu">
          <template v-for="item in items" :key="item.id || item.to">
            <router-link
              v-if="item.to"
              :to="item.to"
              class="navbar-link"
              :style="{ fontWeight: item.isBold ? '700' : '500' }"
            >
              {{ $t(item.label) }}
            </router-link>
            <button
              v-else
              @click="handleAction(item)"
              class="navbar-link"
              :style="{ fontWeight: item.isBold ? '700' : '500' }"
            >
              {{ $t(item.label) }}
            </button>
          </template>

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
        <template v-for="item in items" :key="item.id || item.to">
          <router-link
            v-if="item.to"
            :to="item.to"
            class="block px-3 py-2 rounded-md text-base w-full text-left hover:bg-[var(--color-bg-card-hover)]"
            :style="{
              color: 'var(--color-text-body)',
              fontWeight: item.isBold ? '700' : '500',
            }"
            @click="isMenuOpen = false"
          >
            {{ $t(item.label) }}
          </router-link>
          <button
            v-else
            @click="handleAction(item)"
            class="block px-3 py-2 rounded-md text-base w-full text-left hover:bg-[var(--color-bg-card-hover)]"
            :style="{
              color: 'var(--color-text-body)',
              fontWeight: item.isBold ? '700' : '500',
            }"
          >
            {{ $t(item.label) }}
          </button>
        </template>
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
