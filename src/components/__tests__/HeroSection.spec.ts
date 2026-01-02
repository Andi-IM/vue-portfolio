import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HeroSection from '../HeroSection.vue'
import enUS from '../../i18n/en-US'

/* eslint-disable @typescript-eslint/no-explicit-any */
const mocks = {
  $t: (msg: string) => {
    const keys = msg.split('.')
    let res: any = enUS
    for (const key of keys) res = res[key]
    return res
  },
}

describe('HeroSection', () => {
  it('renders correctly', () => {
    const wrapper = mount(HeroSection, {
      global: { mocks },
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain(enUS.hero.subtitle)
    expect(wrapper.text()).toContain(enUS.hero.title)
  })

  it('emits scrollToSection when view work button is clicked', async () => {
    const wrapper = mount(HeroSection, {
      global: { mocks },
    })
    const buttons = wrapper.findAll('button')
    const button = buttons.find((b) => b.text().includes(enUS.hero.viewWork))

    await button?.trigger('click')

    expect(wrapper.emitted('scrollToSection')).toBeTruthy()
    expect(wrapper.emitted('scrollToSection')?.[0]).toEqual(['projects'])
  })

  it('emits scrollToSection when contact button is clicked', async () => {
    const wrapper = mount(HeroSection, {
      global: { mocks },
    })
    const buttons = wrapper.findAll('button')
    const button = buttons.find((b) => b.text().includes(enUS.hero.getInTouch))

    await button?.trigger('click')

    expect(wrapper.emitted('scrollToSection')).toBeTruthy()
    expect(wrapper.emitted('scrollToSection')?.[0]).toEqual(['contact'])
  })
})
