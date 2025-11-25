<script setup lang="ts">
import NavBar from './NavBar.vue'
import HeroSection from './HeroSection.vue'
import ToolsSection from './ToolsSection.vue'
import ProjectsSection from './ProjectsSection.vue'
import ExperienceSection from './ExperienceSection.vue'
import ContactSection from './ContactSection.vue'
import FooterSection from './FooterSection.vue'

const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <div
    class="bg-gray-900 min-h-screen text-gray-100 font-sans selection:bg-blue-500 selection:text-white"
  >
    <NavBar @scroll-to-section="scrollToSection" />
    <HeroSection @scroll-to-section="scrollToSection" />
    <ToolsSection />
    <ProjectsSection />
    <ExperienceSection />
    <ContactSection />
    <FooterSection />
  </div>
</template>
