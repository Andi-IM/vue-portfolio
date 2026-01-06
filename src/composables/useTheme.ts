import { ref, onMounted } from 'vue';

const STORAGE_KEY = 'theme-preference';
const isDark = ref(true);

export function useTheme() {
  const initTheme = () => {
    // Check localStorage first
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      isDark.value = stored === 'dark';
    } else {
      // Fall back to system preference
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    applyTheme();
  };

  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    isDark.value = !isDark.value;
    localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light');
    applyTheme();
  };

  const setTheme = (dark: boolean) => {
    isDark.value = dark;
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
    applyTheme();
  };

  // Watch for system preference changes
  onMounted(() => {
    initTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      // Only follow system if no user preference is stored
      if (!localStorage.getItem(STORAGE_KEY)) {
        isDark.value = e.matches;
        applyTheme();
      }
    });
  });

  return {
    isDark,
    toggleTheme,
    setTheme,
    initTheme,
  };
}
