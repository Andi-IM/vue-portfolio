/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NavBar from '../NavBar.vue'

describe('NavBar', () => {
  it('renders correctly', () => {
    const wrapper = mount(NavBar)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Andi')
  })

  it('toggles mobile menu when button is clicked', async () => {
    const wrapper = mount(NavBar)
    const button = wrapper.find('.md\\:hidden button')
    expect(button.exists()).toBe(true)

    // Initial state: menu closed
    expect((wrapper.vm as any).isMenuOpen).toBe(false)
    expect(wrapper.find('.md\\:hidden.bg-gray-800').exists()).toBe(false)

    // Open menu
    await button.trigger('click')
    expect((wrapper.vm as any).isMenuOpen).toBe(true)
    expect(wrapper.find('.md\\:hidden.bg-gray-800').exists()).toBe(true)

    // Close menu
    await button.trigger('click')
    expect((wrapper.vm as any).isMenuOpen).toBe(false)
  })

  it('emits scrollToSection when nav item is clicked', async () => {
    const wrapper = mount(NavBar)
    const buttons = wrapper.findAll('button')

    // Find the 'Tentang' button in desktop menu
    const tentangButton = buttons.find(b => b.text().includes('Tentang'))
    await tentangButton?.trigger('click')

    expect(wrapper.emitted('scrollToSection')).toBeTruthy()
    expect(wrapper.emitted('scrollToSection')?.[0]).toEqual(['tentang'])
  })

  it('closes mobile menu when mobile nav item is clicked', async () => {
     const wrapper = mount(NavBar)

     // Open menu first
     ;(wrapper.vm as any).isMenuOpen = true
     await wrapper.vm.$nextTick()

     const mobileMenu = wrapper.find('.md\\:hidden.bg-gray-800')
     const toolsButton = mobileMenu.findAll('button').find(b => b.text().includes('Tools'))

     await toolsButton?.trigger('click')

     expect(wrapper.emitted('scrollToSection')).toBeTruthy()
     expect(wrapper.emitted('scrollToSection')?.[0]).toEqual(['tools'])
     expect((wrapper.vm as any).isMenuOpen).toBe(false)
  })
})
