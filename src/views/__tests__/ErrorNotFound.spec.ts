import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ErrorNotFound from '../ErrorNotFound.vue';
import { createRouter, createWebHistory } from 'vue-router';

// Mock vue-i18n
const tMock = (key: string) => {
  const messages: Record<string, string> = {
    'module.not_found.message': 'Oops. Nothing here...',
    'module.not_found.go_home': 'Go Home',
  };
  return messages[key] || key;
};

// Mock useI18n hook
import { vi } from 'vitest';

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual('vue-i18n');
  return {
    ...actual,
    useI18n: () => ({ t: tMock }),
  };
});

describe('ErrorNotFound.vue', () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [{ path: '/', component: { template: '<div>Home</div>' } }],
  });

  const globalConfig = {
    plugins: [router],
    stubs: {
      'q-btn': true,
    },
  };

  it('renders the 404 image', () => {
    const wrapper = mount(ErrorNotFound, {
      global: globalConfig,
    });
    const img = wrapper.find('img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe('/src/images/404-illustration.png');
    expect(img.classes()).toContain('block');
    expect(img.classes()).toContain('q-mx-auto');
  });

  it('renders the message', () => {
    const wrapper = mount(ErrorNotFound, {
      global: globalConfig,
    });
    expect(wrapper.text()).toContain('Oops. Nothing here...');
  });

  it('renders the Go Home button', () => {
    const wrapper = mount(ErrorNotFound, {
      global: globalConfig,
    });
    const button = wrapper.find('q-btn-stub');
    expect(button.exists()).toBe(true);
    expect(button.attributes('label')).toBe('Go Home');
    expect(button.attributes('to')).toBe('/');
  });
});
