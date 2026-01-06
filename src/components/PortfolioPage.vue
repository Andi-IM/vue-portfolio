<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { useMeta } from 'quasar';

useMeta({
  link: {
    preloadPortrait: {
      rel: 'preload',
      as: 'image',
      href: '/images/portrait.webp',
      fetchpriority: 'high',
    },
  },
});

// Critical above-the-fold components - load synchronously for fast FCP
import NavBar from './NavBar.vue';
import HeroSection from './HeroSection.vue';

// Below-the-fold components - load asynchronously to improve initial load
const ProjectsSection = defineAsyncComponent(() => import('./ProjectsSection.vue'));
const ActivitiesSection = defineAsyncComponent(() => import('./ActivitiesSection.vue'));
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
    class="min-h-screen font-sans"
    style="
      background-color: var(--color-bg-primary);
      color: var(--color-text-body);
      transition:
        background-color 0.3s ease,
        color 0.3s ease;
    "
  >
    <NavBar @scroll-to-section="scrollToSection" />
    <main>
      <HeroSection @scroll-to-section="scrollToSection" />
      <ProjectsSection />
      <ActivitiesSection />
      <ContactSection />
      <FooterSection />
    </main>
  </div>
</template>
