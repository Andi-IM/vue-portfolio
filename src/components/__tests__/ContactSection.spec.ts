import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ContactSection from '../ContactSection.vue';
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

describe('ContactSection', () => {
  it('renders correctly', () => {
    const wrapper = mount(ContactSection, {
      global: { mocks },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain(enUS.contact.title);
  });

  it('has correct links', () => {
    const wrapper = mount(ContactSection, {
      global: { mocks },
    });
    const links = wrapper.findAll('a');

    const emailLink = links.find((l) => l.attributes('href')?.startsWith('mailto:'));
    const linkedinLink = links.find((l) => l.attributes('href')?.includes('linkedin.com'));
    const githubLink = links.find((l) => l.attributes('href')?.includes('github.com'));

    expect(emailLink?.exists()).toBe(true);
    expect(linkedinLink?.exists()).toBe(true);
    expect(githubLink?.exists()).toBe(true);
  });
});
