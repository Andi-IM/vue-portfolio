<script setup lang="ts">
const emit = defineEmits<{
  (e: 'scrollToSection', id: string): void;
}>();
</script>

<template>
  <section id="about" class="pt-32 pb-20 md:pt-40 md:pb-28">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="hero-layout">
        <div class="hero-text space-y-6">
          <h2 class="hero-subtitle">{{ $t('hero.subtitle') }}</h2>
          <h1 class="hero-title">
            {{ $t('hero.title') }}<br />
            <span class="hero-gradient-text">{{ $t('hero.highlight') }}</span>
          </h1>
          <p class="hero-description">
            {{ $t('hero.description') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
            <button
              @click="emit('scrollToSection', 'projects')"
              class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/30"
            >
              {{ $t('hero.viewWork') }}
            </button>
            <button
              @click="emit('scrollToSection', 'contact')"
              class="border border-gray-400 hover:border-blue-400 hover:text-blue-400 text-gray-200 px-8 py-3 rounded-lg font-semibold transition-all"
            >
              {{ $t('hero.getInTouch') }}
            </button>
          </div>
        </div>
        <div class="hero-image-wrapper">
          <div class="relative">
            <div class="hero-glow"></div>
            <div class="hero-photo-frame">
              <img
                src="/images/portrait.webp"
                alt="Developer Profile"
                class="hero-photo"
                fetchpriority="high"
                width="384"
                height="384"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
