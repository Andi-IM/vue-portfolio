<script setup lang="ts">
import { Mail, Linkedin, Github } from 'lucide-vue-next';
</script>

<template>
  <section id="contact" class="py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col items-center text-center mb-16">
        <h2 class="text-3xl font-bold text-white mb-3 text-center">{{ $t('contact.title') }}</h2>
        <p class="text-gray-400 text-lg max-w-2xl text-center leading-relaxed">
          {{ $t('contact.description') }}
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <!-- Email Card -->
        <a
          href="mailto:alex.doe@example.com"
          class="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all group flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-900/20"
        >
          <div
            class="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors shadow-lg border border-gray-700 group-hover:border-blue-500"
          >
            <Mail class="w-10 h-10 text-blue-500 group-hover:text-white transition-colors" />
          </div>
          <h3 class="text-white font-bold text-xl mb-2">{{ $t('contact.email') }}</h3>
          <p class="text-gray-400 group-hover:text-blue-300 transition-colors font-medium">
            andi.irhamm@gmail.com
          </p>
          <span class="text-sm text-gray-400 mt-4 group-hover:text-gray-300"
            >{{ $t('contact.sendMessage') }} &rarr;</span
          >
        </a>

        <!-- LinkedIn Card -->
        <a
          href="https://www.linkedin.com/in/andiirham/"
          target="_blank"
          rel="noopener noreferrer"
          class="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all group flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-900/20"
        >
          <div
            class="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors shadow-lg border border-gray-700 group-hover:border-blue-500"
          >
            <Linkedin class="w-10 h-10 text-blue-500 group-hover:text-white transition-colors" />
          </div>
          <h3 class="text-white font-bold text-xl mb-2">{{ $t('contact.linkedin') }}</h3>
          <p class="text-gray-400 group-hover:text-blue-300 transition-colors font-medium">
            linkedin.com/in/andiirham
          </p>
          <span class="text-sm text-gray-400 mt-4 group-hover:text-gray-300"
            >{{ $t('contact.connect') }} &rarr;</span
          >
        </a>

        <!-- GitHub Card -->
        <a
          href="https://github.com/Andi-IM"
          target="_blank"
          rel="noopener noreferrer"
          class="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all group flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-900/20"
        >
          <div
            class="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors shadow-lg border border-gray-700 group-hover:border-blue-500"
          >
            <Github class="w-10 h-10 text-blue-500 group-hover:text-white transition-colors" />
          </div>
          <h3 class="text-white font-bold text-xl mb-2">{{ $t('contact.github') }}</h3>
          <p class="text-gray-400 group-hover:text-blue-300 transition-colors font-medium">
            github.com/Andi-IM
          </p>
          <span class="text-sm text-gray-400 mt-4 group-hover:text-gray-300"
            >{{ $t('contact.viewRepository') }} &rarr;</span
          >
        </a>
      </div>
    </div>
  </section>
</template>
