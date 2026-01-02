import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ExperienceSection from '../ExperienceSection.vue';
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

describe('ExperienceSection', () => {
  it('renders correctly', () => {
    const wrapper = mount(ExperienceSection, {
      global: { mocks },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain(enUS.experience.title);
  });

  it('renders experience entries', () => {
    const wrapper = mount(ExperienceSection, {
      global: { mocks },
    });
    expect(wrapper.text()).toContain('Flutter Developer');
    expect(wrapper.text()).toContain('System Analyst');
    expect(wrapper.text()).toContain('Computer Vision Intern');
  });
});
