import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { defineComponent } from 'vue';

vi.mock('quasar', () => ({
  useMeta: vi.fn(),
}));

import PortfolioPage from '../PortfolioPage.vue';
import NavBar from '../NavBar.vue';
import HeroSection from '../HeroSection.vue';
import enUS from '../../i18n/en-US';

// Stub async components for faster, more reliable tests
const AsyncStub = defineComponent({
  template: '<div class="async-stub"></div>',
});

/* eslint-disable @typescript-eslint/no-explicit-any */
const mocks = {
  $t: (msg: string) => {
    const keys = msg.split('.');
    let res: any = enUS;
    for (const key of keys) res = res[key];
    return res;
  },
};

describe('PortfolioPage', () => {
  it('renders all sections', async () => {
    // Shallow mount might stub child components, but we want to know they are there.
    // Mount renders everything.
    const wrapper = mount(PortfolioPage, {
      global: {
        mocks,
        stubs: {
          // Stub async components since they are loaded dynamically
          ToolsSection: AsyncStub,
          ProjectsSection: AsyncStub,
          ExperienceSection: AsyncStub,
          ActivitiesSection: AsyncStub,
          ContactSection: AsyncStub,
          FooterSection: AsyncStub,
        },
      },
    });

    // Wait for async components to resolve
    await flushPromises();

    expect(wrapper.findComponent(NavBar).exists()).toBe(true);
    expect(wrapper.findComponent(HeroSection).exists()).toBe(true);
    // Async components are stubbed, so we check they are rendered
    expect(wrapper.findAll('.async-stub').length).toBe(6);
  });

  it('scrolls to section when requested', () => {
    const wrapper = mount(PortfolioPage, {
      global: {
        mocks,
        stubs: {
          ToolsSection: AsyncStub,
          ProjectsSection: AsyncStub,
          ExperienceSection: AsyncStub,
          ActivitiesSection: AsyncStub,
          ContactSection: AsyncStub,
          FooterSection: AsyncStub,
        },
      },
    });

    // Mock getElementById and scrollIntoView
    const scrollIntoViewMock = vi.fn();
    const getElementByIdSpy = vi.spyOn(document, 'getElementById').mockImplementation(() => {
      return {
        scrollIntoView: scrollIntoViewMock,
      } as unknown as HTMLElement;
    });

    // Trigger scroll event from NavBar
    const navBar = wrapper.findComponent(NavBar);
    navBar.vm.$emit('scrollToSection', 'about');

    expect(getElementByIdSpy).toHaveBeenCalledWith('about');
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });

    // Trigger scroll from HeroSection
    const heroSection = wrapper.findComponent(HeroSection);
    heroSection.vm.$emit('scrollToSection', 'projects');

    expect(getElementByIdSpy).toHaveBeenCalledWith('projects');
    expect(scrollIntoViewMock).toHaveBeenCalledTimes(2);

    getElementByIdSpy.mockRestore();
  });
});
