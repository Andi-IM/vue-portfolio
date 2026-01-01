import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ContactSection from '../ContactSection.vue'

describe('ContactSection', () => {
  it('renders correctly', () => {
    const wrapper = mount(ContactSection)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Get In Touch')
  })

  it('has correct links', () => {
    const wrapper = mount(ContactSection)
    const links = wrapper.findAll('a')

    const emailLink = links.find((l) => l.attributes('href')?.startsWith('mailto:'))
    const linkedinLink = links.find((l) => l.attributes('href')?.includes('linkedin.com'))
    const githubLink = links.find((l) => l.attributes('href')?.includes('github.com'))

    expect(emailLink?.exists()).toBe(true)
    expect(linkedinLink?.exists()).toBe(true)
    expect(githubLink?.exists()).toBe(true)
  })
})
