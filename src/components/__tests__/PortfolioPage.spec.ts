import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PortfolioPage from '../PortfolioPage.vue'
import NavBar from '../NavBar.vue'
import HeroSection from '../HeroSection.vue'

describe('PortfolioPage', () => {
  it('renders all sections', () => {
    // Shallow mount might stub child components, but we want to know they are there.
    // Mount renders everything.
    const wrapper = mount(PortfolioPage, {
      global: {
        stubs: {
          // We can keep them real or stub them if we only care they exist.
          // Let's keep them real for now unless it's too heavy.
        },
      },
    })

    expect(wrapper.findComponent(NavBar).exists()).toBe(true)
    expect(wrapper.findComponent(HeroSection).exists()).toBe(true)
    expect(wrapper.text()).toContain('Tools & Teknologi')
    expect(wrapper.text()).toContain('Proyek Terselesaikan')
  })

  it('scrolls to section when requested', async () => {
    const wrapper = mount(PortfolioPage)

    // Mock getElementById and scrollIntoView
    const scrollIntoViewMock = vi.fn()
    const getElementByIdSpy = vi.spyOn(document, 'getElementById').mockImplementation(() => {
      return {
        scrollIntoView: scrollIntoViewMock,
      } as unknown as HTMLElement
    })

    // Trigger scroll event from NavBar
    const navBar = wrapper.findComponent(NavBar)
    navBar.vm.$emit('scrollToSection', 'tentang')

    expect(getElementByIdSpy).toHaveBeenCalledWith('tentang')
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' })

    // Trigger scroll from HeroSection
    const heroSection = wrapper.findComponent(HeroSection)
    heroSection.vm.$emit('scrollToSection', 'proyek')

    expect(getElementByIdSpy).toHaveBeenCalledWith('proyek')
    expect(scrollIntoViewMock).toHaveBeenCalledTimes(2)

    getElementByIdSpy.mockRestore()
  })
})
