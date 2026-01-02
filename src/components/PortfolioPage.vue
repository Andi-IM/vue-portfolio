<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

// Critical above-the-fold components - load synchronously for fast FCP
import NavBar from './NavBar.vue';
import HeroSection from './HeroSection.vue';

// Below-the-fold components - load asynchronously to improve initial load
const ToolsSection = defineAsyncComponent(() => import('./ToolsSection.vue'));
const ProjectsSection = defineAsyncComponent(() => import('./ProjectsSection.vue'));
const ExperienceSection = defineAsyncComponent(() => import('./ExperienceSection.vue'));
const ContactSection = defineAsyncComponent(() => import('./ContactSection.vue'));
const FooterSection = defineAsyncComponent(() => import('./FooterSection.vue'));

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<template>
  <div
    class="bg-[#0A1628] min-h-screen text-gray-100 font-sans selection:bg-blue-500 selection:text-white"
  >
    <NavBar @scroll-to-section="scrollToSection" />
    <main>
      <HeroSection @scroll-to-section="scrollToSection" />
      <ToolsSection />
      <ProjectsSection />
      <ExperienceSection />
      <ContactSection />
      <FooterSection />
    </main>
  </div>
</template>
