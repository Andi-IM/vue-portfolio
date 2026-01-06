import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import HeroSection from '../HeroSection.vue';
import enUS from '../../i18n/en-US';

/* eslint-disable @typescript-eslint/no-explicit-any */
const mocks = {
  $t: (msg: string) => {
    const keys = msg.split('.');
    let res: any = enUS;
    for (const key of keys) res = res[key];
    return res;
  },
};

describe('HeroSection', () => {
  it('renders correctly', () => {
    const wrapper = mount(HeroSection, {
      global: { mocks },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain(enUS.hero.subtitle);
    expect(wrapper.text()).toContain(enUS.hero.title);
  });

  it('emits scrollToSection when view work button is clicked', async () => {
    const wrapper = mount(HeroSection, {
      global: { mocks },
    });
    const buttons = wrapper.findAll('button');
    const button = buttons.find((b) => b.text().includes(enUS.hero.viewWork));

    await button?.trigger('click');

    expect(wrapper.emitted('scrollToSection')).toBeTruthy();
    expect(wrapper.emitted('scrollToSection')?.[0]).toEqual(['projects']);
  });

  it('emits scrollToSection when contact button is clicked', async () => {
    const wrapper = mount(HeroSection, {
      global: { mocks },
    });
    const buttons = wrapper.findAll('button');
    const button = buttons.find((b) => b.text().includes(enUS.hero.getInTouch));

    await button?.trigger('click');

    expect(wrapper.emitted('scrollToSection')).toBeTruthy();
    expect(wrapper.emitted('scrollToSection')?.[0]).toEqual(['contact']);
  });

  it('handles mouseover and mouseout on buttons', async () => {
    const wrapper = mount(HeroSection, {
      global: { mocks },
    });
    const buttons = wrapper.findAll('button');
    const primaryButton = buttons.find((b) => b.text().includes(enUS.hero.viewWork))!;
    const secondaryButton = buttons.find((b) => b.text().includes(enUS.hero.getInTouch))!;

    // Test Primary Button
    await primaryButton.trigger('mouseover');
    expect((primaryButton.element as HTMLElement).style.backgroundColor).toBe(
      'var(--color-primary-hover)',
    );

    await primaryButton.trigger('mouseout');
    expect((primaryButton.element as HTMLElement).style.backgroundColor).toBe(
      'var(--color-primary)',
    );

    // Test Secondary Button
    await secondaryButton.trigger('mouseover');
    expect((secondaryButton.element as HTMLElement).style.borderColor).toBe('var(--color-primary)');
    expect((secondaryButton.element as HTMLElement).style.color).toBe('var(--color-primary)');

    await secondaryButton.trigger('mouseout');
    expect((secondaryButton.element as HTMLElement).style.borderColor).toBe('var(--color-border)');
    expect((secondaryButton.element as HTMLElement).style.color).toBe('var(--color-text-body)');
  });
});
