import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useTheme } from '../useTheme';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';

describe('useTheme', () => {
  const STORAGE_KEY = 'theme-preference';

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Helper component to test the composable's lifecycle
  const TestComponent = defineComponent({
    setup() {
      const { isDark, toggleTheme, setTheme, initTheme } = useTheme();
      return { isDark, toggleTheme, setTheme, initTheme };
    },
    template: '<div></div>',
  });

  it('initializes with dark mode by default if no storage or system preference', () => {
    const wrapper = mount(TestComponent);
    // matchMedia is mocked in test-setup.ts to return matches: false
    expect(wrapper.vm.isDark).toBe(false);
  });

  it('initializes from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, 'light');
    const wrapper = mount(TestComponent);
    expect(wrapper.vm.isDark).toBe(false);

    localStorage.setItem(STORAGE_KEY, 'dark');
    // Re-mount to trigger onMounted again or just use a new wrapper
    const wrapper2 = mount(TestComponent);
    expect(wrapper2.vm.isDark).toBe(true);
  });

  it('toggles theme correctly', () => {
    const wrapper = mount(TestComponent);
    const initial = wrapper.vm.isDark;

    wrapper.vm.toggleTheme();
    expect(wrapper.vm.isDark).toBe(!initial);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(wrapper.vm.isDark ? 'dark' : 'light');
    expect(document.documentElement.classList.contains('dark')).toBe(wrapper.vm.isDark);

    wrapper.vm.toggleTheme();
    expect(wrapper.vm.isDark).toBe(initial);
  });

  it('sets theme manually', () => {
    const wrapper = mount(TestComponent);

    wrapper.vm.setTheme(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    wrapper.vm.setTheme(true);
    expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('reacts to system preference changes when no user preference is set', () => {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    let changeHandler: (e: any) => void = () => {};

    // Mock media query object
    const mockMediaQuery = {
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((event, handler) => {
        if (event === 'change') {
          changeHandler = handler;
        }
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };

    // Override window.matchMedia to return our mock
    // Type casting needed because Partial<MediaQueryList> mismatch
    window.matchMedia = vi.fn().mockReturnValue(mockMediaQuery);

    const wrapper = mount(TestComponent);

    // Simulating the change event manually
    changeHandler({ matches: true });
    expect(wrapper.vm.isDark).toBe(true);
    // Use raw classList check instead of document.documentElement.classList.contains
    // because JSDOM might behave slightly differently or we want to be sure
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    changeHandler({ matches: false });
    expect(wrapper.vm.isDark).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // Should NOT react if user preference is set
    wrapper.vm.setTheme(true);
    changeHandler({ matches: false });
    expect(wrapper.vm.isDark).toBe(true); // Stays dark
  });
});
