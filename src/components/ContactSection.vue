<script setup lang="ts">
import { Mail, Linkedin, Github } from 'lucide-vue-next';
</script>

<template>
  <section id="contact" class="py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col items-center text-center mb-16">
        <h2 class="text-3xl font-bold mb-3 text-center">{{ $t('contact.title') }}</h2>
        <p
          class="text-lg max-w-2xl text-center leading-relaxed"
          style="color: var(--color-text-muted)"
        >
          {{ $t('contact.description') }}
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <!-- Email Card -->
        <a
          href="mailto:alex.doe@example.com"
          class="p-8 rounded-2xl transition-all group flex flex-col items-center text-center hover:-translate-y-2"
          style="
            background-color: var(--color-bg-card);
            border: 1px solid var(--color-border);
            box-shadow: var(--shadow-card);
          "
        >
          <div
            class="w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors"
            style="
              background-color: var(--color-bg-card-hover);
              border: 1px solid var(--color-border);
            "
          >
            <Mail class="w-10 h-10" style="color: var(--color-primary)" />
          </div>
          <h3 class="font-bold text-xl mb-2" style="color: var(--color-text-heading)">
            {{ $t('contact.email') }}
          </h3>
          <p class="font-medium" style="color: var(--color-primary)">andi.irhamm@gmail.com</p>
          <span class="text-sm mt-4" style="color: var(--color-text-muted)"
            >{{ $t('contact.sendMessage') }} &rarr;</span
          >
        </a>

        <!-- LinkedIn Card -->
        <a
          href="https://www.linkedin.com/in/andiirham/"
          target="_blank"
          rel="noopener noreferrer"
          class="p-8 rounded-2xl transition-all group flex flex-col items-center text-center hover:-translate-y-2"
          style="
            background-color: var(--color-bg-card);
            border: 1px solid var(--color-border);
            box-shadow: var(--shadow-card);
          "
        >
          <div
            class="w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors"
            style="
              background-color: var(--color-bg-card-hover);
              border: 1px solid var(--color-border);
            "
          >
            <Linkedin class="w-10 h-10" style="color: var(--color-primary)" />
          </div>
          <h3 class="font-bold text-xl mb-2" style="color: var(--color-text-heading)">
            {{ $t('contact.linkedin') }}
          </h3>
          <p class="font-medium" style="color: var(--color-primary)">linkedin.com/in/andiirham</p>
          <span class="text-sm mt-4" style="color: var(--color-text-muted)"
            >{{ $t('contact.connect') }} &rarr;</span
          >
        </a>

        <!-- GitHub Card -->
        <a
          href="https://github.com/Andi-IM"
          target="_blank"
          rel="noopener noreferrer"
          class="p-8 rounded-2xl transition-all group flex flex-col items-center text-center hover:-translate-y-2"
          style="
            background-color: var(--color-bg-card);
            border: 1px solid var(--color-border);
            box-shadow: var(--shadow-card);
          "
        >
          <div
            class="w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors"
            style="
              background-color: var(--color-bg-card-hover);
              border: 1px solid var(--color-border);
            "
          >
            <Github class="w-10 h-10" style="color: var(--color-primary)" />
          </div>
          <h3 class="font-bold text-xl mb-2" style="color: var(--color-text-heading)">
            {{ $t('contact.github') }}
          </h3>
          <p class="font-medium" style="color: var(--color-primary)">github.com/Andi-IM</p>
          <span class="text-sm mt-4" style="color: var(--color-text-muted)"
            >{{ $t('contact.viewRepository') }} &rarr;</span
          >
        </a>
      </div>
    </div>
  </section>
</template>
