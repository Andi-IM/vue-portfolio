import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ToolsSection from '../ToolsSection.vue'

describe('ToolsSection', () => {
  it('renders correctly', () => {
    const wrapper = mount(ToolsSection)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Tools & Teknologi')
  })

  it('renders all skills', () => {
    const wrapper = mount(ToolsSection)
    const skills = [
      'Flutter', 'Dart', 'Firebase', 'Git', 'Android Studio', 'VS Code'
    ]

    skills.forEach(skill => {
        expect(wrapper.text()).toContain(skill)
    })

    const cards = wrapper.findAll('.group')
    expect(cards.length).toBe(skills.length)
  })
})
