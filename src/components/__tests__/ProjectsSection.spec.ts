import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectsSection from '../ProjectsSection.vue'

describe('ProjectsSection', () => {
  it('renders correctly', () => {
    const wrapper = mount(ProjectsSection)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Proyek Terselesaikan')
    expect(wrapper.findAll('.bg-gray-800').length).toBeGreaterThan(0) // Checks if projects are rendered
  })

  it('opens project modal on click', async () => {
    const wrapper = mount(ProjectsSection)
    const projectCards = wrapper.findAll('.group.cursor-pointer')

    // Initial state: no modal
    expect(wrapper.find('.fixed.inset-0').exists()).toBe(false)

    // Click first project
    await projectCards[0]!.trigger('click')

    // Modal should appear
    expect(wrapper.find('.fixed.inset-0').exists()).toBe(true)
    expect(wrapper.find('.fixed.inset-0').text()).toContain('Lokapandu') // Assuming Lokapandu is first
  })

  it('closes project modal on close button click', async () => {
    const wrapper = mount(ProjectsSection)

    // Open modal
    const projectCards = wrapper.findAll('.group.cursor-pointer')
    await projectCards[0]!.trigger('click')
    expect(wrapper.find('.fixed.inset-0').exists()).toBe(true)

    // Click close button
    const closeButton = wrapper.find('button.absolute.top-4') // Adjust selector if needed
    await closeButton.trigger('click')

    // Modal should disappear
    expect(wrapper.find('.fixed.inset-0').exists()).toBe(false)
  })

  it('opens external link correctly', async () => {
    const wrapper = mount(ProjectsSection)
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

    // We need to access the openLink method or trigger element click that calls it
    // The component exposes openLink to template.
    // Let's click on a github link in the card view (without opening modal if possible, or inside modal)
    // The card has a buttons for links.

    const githubButtons = wrapper.findAll('button')
    const githubBtn = githubButtons.find(b => b.text().includes('GitHub'))

    if (githubBtn) {
        await githubBtn.trigger('click')
        expect(openSpy).toHaveBeenCalled()
    } else {
        // Fallback if no visible buttons in card view (logic check)
        // Access component internal method if necessary, but testing UI interaction is better.
        // ProjectsSection has buttons in the card grid.
        throw new Error('GitHub button not found')
    }

    openSpy.mockRestore()
  })
})
