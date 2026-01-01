import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HeroSection from '../HeroSection.vue'

describe('HeroSection', () => {
  it('renders correctly', () => {
    const wrapper = mount(HeroSection)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Mobile App Developer')
    expect(wrapper.text()).toContain('Andi Irham')
  })

  it('emits scrollToSection when "Lihat Karya Saya" is clicked', async () => {
    const wrapper = mount(HeroSection)
    const buttons = wrapper.findAll('button')
    const button = buttons.find(b => b.text().includes('Lihat Karya Saya'))

    await button?.trigger('click')

    expect(wrapper.emitted('scrollToSection')).toBeTruthy()
    expect(wrapper.emitted('scrollToSection')?.[0]).toEqual(['proyek'])
  })

  it('emits scrollToSection when "Hubungi Saya" is clicked', async () => {
    const wrapper = mount(HeroSection)
    const buttons = wrapper.findAll('button')
    const button = buttons.find(b => b.text().includes('Hubungi Saya'))

    await button?.trigger('click')

    expect(wrapper.emitted('scrollToSection')).toBeTruthy()
    expect(wrapper.emitted('scrollToSection')?.[0]).toEqual(['kontak'])
  })
})
