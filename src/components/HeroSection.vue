<script setup lang="ts">
import awsCcpImg from '../images/aws-ccp.png';
import awsRestartImg from '../images/aws-restart.png';
import ciscoNetworkingBasicsImg from '../images/cisco-networking-basics.png';
import ciscoNetworkingDevicesImg from '../images/cisco-networking-devices.png';

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

          <!-- Certifications Badges -->
          <div class="flex flex-col items-center md:items-start gap-3 pt-6 border-t border-[var(--color-border)] mt-8">
            <span class="text-xs font-bold uppercase tracking-wider" style="color: var(--color-text-muted)">Certifications</span>
            <div class="flex gap-4">
              <a
                href="https://www.credly.com/badges/32c8a269-8c65-47f2-8855-a80572d84f90"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:scale-105 transition-transform duration-300"
              >
                <img
                  :src="awsCcpImg"
                  alt="AWS Certified Cloud Practitioner"
                  class="w-16 h-16 object-contain drop-shadow-md"
                />
                <q-tooltip class="text-xs">AWS Certified Cloud Practitioner</q-tooltip>
              </a>
              <a
                href="https://www.credly.com/badges/1cd679f7-e5e1-48aa-a78d-7fa48499c818"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:scale-105 transition-transform duration-300"
              >
                <img
                  :src="awsRestartImg"
                  alt="AWS re/Start Graduate"
                  class="w-16 h-16 object-contain drop-shadow-md"
                />
                <q-tooltip class="text-xs">AWS re/Start Graduate</q-tooltip>
              </a>
              <a
                href="https://www.credly.com/badges/f72d58e8-e8cf-4da7-ab61-dc903ccfa81b"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:scale-105 transition-transform duration-300"
              >
                <img
                  :src="ciscoNetworkingBasicsImg"
                  alt="Cisco Networking Basics"
                  class="w-16 h-16 object-contain drop-shadow-md"
                />
                <q-tooltip class="text-xs">Cisco Networking Basics</q-tooltip>
              </a>
              <a
                href="https://www.credly.com/badges/7b21698c-5a43-47bf-88ed-aebdbd0bd77e"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:scale-105 transition-transform duration-300"
              >
                <img
                  :src="ciscoNetworkingDevicesImg"
                  alt="Cisco Networking Devices and Initial Configuration"
                  class="w-16 h-16 object-contain drop-shadow-md"
                />
                <q-tooltip class="text-xs">Cisco Networking Devices and Initial Configuration</q-tooltip>
              </a>
              <a
                href="https://www.credly.com/users/andi-irham/badges/credly"
                target="_blank"
                rel="noopener noreferrer"
                class="w-16 h-16 rounded-xl border border-[var(--color-border)] flex flex-col items-center justify-center hover:border-[var(--color-primary)] hover:shadow-sm hover:scale-105 transition-all duration-300 bg-[var(--color-bg-card)] group"
              >
                <span class="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors">More</span>
                <span class="text-xs text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors" style="line-height: 1">&rarr;</span>
                <q-tooltip class="text-xs">View all badges on Credly</q-tooltip>
              </a>
            </div>
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
