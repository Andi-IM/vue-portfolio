import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ToolsSection from '../ToolsSection.vue'
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

describe('ToolsSection', () => {
  it('renders correctly', () => {
    const wrapper = mount(ToolsSection, {
      global: { mocks },
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain(enUS.tools.title)
  })

  it('renders all skills', () => {
    const wrapper = mount(ToolsSection, {
      global: { mocks },
    })
    const skills = ['Flutter', 'Dart', 'Firebase', 'Git', 'Android Studio', 'VS Code']

    skills.forEach((skill) => {
      expect(wrapper.text()).toContain(skill)
    })

    const cards = wrapper.findAll('.group')
    expect(cards.length).toBe(skills.length)
  })
})
