<script setup lang="ts">
import portraitImg from '../images/portrait.webp'
const emit = defineEmits<{
  (e: 'scrollToSection', id: string): void
}>()
</script>

<template>
  <section id="tentang" class="pt-32 pb-20 md:pt-40 md:pb-28">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        <div class="w-full md:w-1/2 space-y-6 text-center md:text-left">
          <h2 class="text-blue-500 font-semibold tracking-wide uppercase text-sm">
            Mobile App Developer
          </h2>
          <h1 class="text-4xl md:text-6xl font-bold leading-tight text-white">
            Halo, Saya Andi Irham,<br />
            <span class="text-blue-500">Mobile Developer & AI Enthusiast</span>
          </h1>
          <p class="text-gray-400 text-lg md:text-xl max-w-lg mx-auto md:mx-0">
            Passionate Software Engineering graduate specializing in Android Mobile Development
            (Kotlin, Dart, Flutter) and backend web development. Experienced in building native
            performance apps and exploring AI solutions. Ready to contribute as a versatile
            developer!
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
            <button
              @click="emit('scrollToSection', 'proyek')"
              class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/30"
            >
              Lihat Karya Saya
            </button>
            <button
              @click="emit('scrollToSection', 'kontak')"
              class="border border-gray-600 hover:border-blue-500 hover:text-blue-400 text-gray-300 px-8 py-3 rounded-lg font-semibold transition-all"
            >
              Hubungi Saya
            </button>
          </div>
        </div>
        <div class="w-full md:w-1/2 flex justify-center md:justify-end">
          <div class="relative">
            <div class="absolute inset-0 bg-blue-600 rounded-3xl rotate-6 opacity-20 blur-lg"></div>
            <div
              class="relative w-64 h-64 md:w-96 md:h-96 rounded-3xl overflow-hidden border-4 border-gray-800 shadow-2xl"
            >
              <!-- Placeholder Image for Developer -->
              <img
                :src="portraitImg"
                alt="Developer Profile"
                class="w-full h-full object-cover"
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
