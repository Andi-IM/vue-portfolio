/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import NavBar from '../NavBar.vue';
import enUS from '../../i18n/en-US';

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
    const button = wrapper.find('.navbar-mobile-btn button');
    expect(button.exists()).toBe(true);

    // Initial state: menu closed
    expect((wrapper.vm as any).isMenuOpen).toBe(false);
    expect(wrapper.find('.navbar-mobile-menu').exists()).toBe(false);

    // Open menu
    await button.trigger('click');
    expect((wrapper.vm as any).isMenuOpen).toBe(true);
    expect(wrapper.find('.navbar-mobile-menu').exists()).toBe(true);

    // Close menu
    await button.trigger('click');
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
    const toolsButton = mobileMenu.findAll('button').find((b) => b.text().includes(enUS.nav.tools));

    await toolsButton?.trigger('click');

    expect(wrapper.emitted('scrollToSection')).toBeTruthy();
    expect(wrapper.emitted('scrollToSection')?.[0]).toEqual(['tools']);
    expect((wrapper.vm as any).isMenuOpen).toBe(false);
  });
});
