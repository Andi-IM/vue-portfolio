import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent } from 'vue'
import PortfolioPage from '../PortfolioPage.vue'
import NavBar from '../NavBar.vue'
import HeroSection from '../HeroSection.vue'

// Stub async components for faster, more reliable tests
const AsyncStub = defineComponent({
  template: '<div class="async-stub"></div>',
})

describe('PortfolioPage', () => {
  it('renders all sections', async () => {
    // Shallow mount might stub child components, but we want to know they are there.
    // Mount renders everything.
    const wrapper = mount(PortfolioPage, {
      global: {
        stubs: {
          // Stub async components since they are loaded dynamically
          ToolsSection: AsyncStub,
          ProjectsSection: AsyncStub,
          ExperienceSection: AsyncStub,
          ContactSection: AsyncStub,
          FooterSection: AsyncStub,
        },
      },
    })

    // Wait for async components to resolve
    await flushPromises()

    expect(wrapper.findComponent(NavBar).exists()).toBe(true)
    expect(wrapper.findComponent(HeroSection).exists()).toBe(true)
    // Async components are stubbed, so we check they are rendered
    expect(wrapper.findAll('.async-stub').length).toBe(5)
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
