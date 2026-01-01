import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FooterSection from '../FooterSection.vue'

describe('FooterSection', () => {
  it('renders correctly', () => {
    const wrapper = mount(FooterSection)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('All rights reserved')
  })

  it('contains social links', () => {
    const wrapper = mount(FooterSection)
    const links = wrapper.findAll('a')
    expect(links.length).toBe(3)

    expect(links[0]!.attributes('href')).toContain('github.com')
    expect(links[1]!.attributes('href')).toContain('linkedin.com')
    expect(links[2]!.attributes('href')).toContain('mailto:')
  })
})
