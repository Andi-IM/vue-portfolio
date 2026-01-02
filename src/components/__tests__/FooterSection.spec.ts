import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FooterSection from '../FooterSection.vue'
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

describe('FooterSection', () => {
  it('renders correctly', () => {
    const wrapper = mount(FooterSection, {
      global: { mocks },
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain(enUS.footer.rights)
  })

  it('contains social links with correct aria-labels', () => {
    const wrapper = mount(FooterSection, {
      global: { mocks },
    })
    const links = wrapper.findAll('a')
    expect(links.length).toBe(3)

    expect(links[0]!.attributes('href')).toContain('github.com')
    expect(links[0]!.attributes('aria-label')).toBe('GitHub')

    expect(links[1]!.attributes('href')).toContain('linkedin.com')
    expect(links[1]!.attributes('aria-label')).toBe('LinkedIn')

    expect(links[2]!.attributes('href')).toContain('mailto:')
    expect(links[2]!.attributes('aria-label')).toBe('Email')
  })
})
