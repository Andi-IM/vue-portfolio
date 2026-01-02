<script setup lang="ts">
const experiences = [
  {
    year: 'July 2025 - November 2025',
    role: 'Flutter Developer - Bekup Cohort',
    company: 'BEKUP - Baparekraf for Startup',
    desc: '・Learning Flutter Development from understanding Dart language to create a beautiful Flutter app\n・Learning team project development by building a capstone project\n・Learning soft skills to support self development as a Flutter Developer\n・Learning project management',
  },
  {
    year: 'July 2024 - November 2024',
    role: 'System Analyst',
    company: 'PT. Javan Cipta Solusi',
    desc: 'Create some task referenced by URD or SDD that will be handled by programmer',
  },
  {
    year: 'August 2022 - January 2023',
    role: 'Computer Vision Intern',
    company: 'PT. Elevasi Teknologi Aeronautika Nusantara (INAERO)',
    desc: 'Learning Fundamental concepts of AI, especially computer vision.',
  },
]
</script>

<template>
  <section id="experience" class="py-20 bg-gray-800/30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-white mb-12">{{ $t('experience.title') }}</h2>
      <div
        class="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-blue-500 before:to-transparent"
      >
        <div
          v-for="(exp, index) in experiences"
          :key="index"
          class="relative flex items-center justify-between group is-active"
        >
          <!-- Timeline Dot (Absolute centered on the line) -->
          <div
            class="absolute left-5 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full border border-gray-700 bg-gray-900 group-hover:bg-blue-600 group-hover:border-blue-500 transition-colors z-10 shadow shadow-blue-900/20"
          >
            <div
              class="w-3 h-3 bg-blue-500 rounded-full group-hover:bg-white transition-colors"
            ></div>
          </div>

          <!-- Content Card -->
          <div
            :class="[
              'w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] ml-auto p-6 rounded-xl border border-gray-700 bg-gray-800 hover:border-blue-500 transition-all shadow-lg',
              index % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto md:ml-0',
            ]"
          >
            <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
              <h3 class="font-bold text-white text-lg">{{ exp.role }}</h3>
              <span class="text-blue-400 text-sm font-mono mt-1 sm:mt-0">{{ exp.year }}</span>
            </div>
            <div class="text-blue-300 font-medium mb-3">{{ exp.company }}</div>
            <p class="text-gray-400 text-sm leading-relaxed">
              {{ exp.desc }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
