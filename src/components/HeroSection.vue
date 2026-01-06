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
              class="px-8 py-3 rounded-lg font-semibold transition-all hover:shadow-lg"
              style="background-color: var(--color-primary); color: white"
              @mouseover="
                ($event.target as HTMLElement).style.backgroundColor = 'var(--color-primary-hover)'
              "
              @mouseout="
                ($event.target as HTMLElement).style.backgroundColor = 'var(--color-primary)'
              "
            >
              {{ $t('hero.viewWork') }}
            </button>
            <button
              @click="emit('scrollToSection', 'contact')"
              class="px-8 py-3 rounded-lg font-semibold transition-all"
              style="border: 1px solid var(--color-border); color: var(--color-text-body)"
              @mouseover="
                ($event.target as HTMLElement).style.borderColor = 'var(--color-primary)';
                ($event.target as HTMLElement).style.color = 'var(--color-primary)';
              "
              @mouseout="
                ($event.target as HTMLElement).style.borderColor = 'var(--color-border)';
                ($event.target as HTMLElement).style.color = 'var(--color-text-body)';
              "
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
