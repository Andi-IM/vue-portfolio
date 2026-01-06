/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { mount } from '@vue/test-utils';
import NavBar from '../NavBar.vue';
import enUS from '../../i18n/en-US';

// Mock window.matchMedia for useTheme composable
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe('NavBar', () => {
  it('renders correctly', () => {
    const wrapper = mount(NavBar, {
      global: {
        mocks: {
          $t: (msg: string) => {
            const keys = msg.split('.');
            let res: any = enUS;
            for (const key of keys) res = res[key];
            return res;
          },
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain('Andi');
  });

  it('toggles mobile menu when button is clicked', async () => {
    const wrapper = mount(NavBar, {
      global: {
        mocks: {
          $t: (msg: string) => {
            const keys = msg.split('.');
            let res: any = enUS;
            for (const key of keys) res = res[key];
            return res;
          },
        },
      },
    });
    // Get the second button (menu toggle), first is theme toggle
    const buttons = wrapper.findAll('.navbar-mobile-btn button');
    const menuButton = buttons[1];
    expect(menuButton?.exists()).toBe(true);

    // Initial state: menu closed
    expect((wrapper.vm as any).isMenuOpen).toBe(false);
    expect(wrapper.find('.navbar-mobile-menu').exists()).toBe(false);

    // Open menu
    await menuButton?.trigger('click');
    expect((wrapper.vm as any).isMenuOpen).toBe(true);
    expect(wrapper.find('.navbar-mobile-menu').exists()).toBe(true);

    // Close menu
    await menuButton?.trigger('click');
    expect((wrapper.vm as any).isMenuOpen).toBe(false);
  });

  it('emits scrollToSection when nav item is clicked', async () => {
    const wrapper = mount(NavBar, {
      global: {
        mocks: {
          $t: (msg: string) => {
            const keys = msg.split('.');
            let res: any = enUS;
            for (const key of keys) res = res[key];
            return res;
          },
        },
      },
    });
    const buttons = wrapper.findAll('button');

    // Find the 'About' button in desktop menu
    const aboutButton = buttons.find((b) => b.text().includes(enUS.nav.about));
    await aboutButton?.trigger('click');

    expect(wrapper.emitted('scrollToSection')).toBeTruthy();
    expect(wrapper.emitted('scrollToSection')?.[0]).toEqual(['about']);
  });

  it('closes mobile menu when mobile nav item is clicked', async () => {
    const wrapper = mount(NavBar, {
      global: {
        mocks: {
          $t: (msg: string) => {
            const keys = msg.split('.');
            let res: any = enUS;
            for (const key of keys) res = res[key];
            return res;
          },
        },
      },
    });

    // Open menu first
    (wrapper.vm as any).isMenuOpen = true;
    await wrapper.vm.$nextTick();

    const mobileMenu = wrapper.find('.navbar-mobile-menu');
    const projectsButton = mobileMenu
      .findAll('button')
      .find((b) => b.text().includes(enUS.nav.projects));

    await projectsButton?.trigger('click');

    expect(wrapper.emitted('scrollToSection')).toBeTruthy();
    expect(wrapper.emitted('scrollToSection')?.[0]).toEqual(['projects']);
    expect((wrapper.vm as any).isMenuOpen).toBe(false);
  });
});
