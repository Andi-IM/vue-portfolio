import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ExperienceSection from '../ExperienceSection.vue'

describe('ExperienceSection', () => {
  it('renders correctly', () => {
    const wrapper = mount(ExperienceSection)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Experiences')
  })

  it('renders experience entries', () => {
    const wrapper = mount(ExperienceSection)
    expect(wrapper.text()).toContain('Flutter Developer')
    expect(wrapper.text()).toContain('System Analyst')
    expect(wrapper.text()).toContain('Computer Vision Intern')
  })
})
