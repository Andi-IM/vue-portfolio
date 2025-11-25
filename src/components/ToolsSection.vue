<script setup lang="ts">
import { Smartphone, Code, Database, GitBranch, Layers, Terminal } from 'lucide-vue-next'

const skills = [
  { name: 'Flutter', type: 'UI Toolkit', icon: Smartphone, iconClass: 'text-blue-400' },
  { name: 'Dart', type: 'Language', icon: Code, iconClass: 'text-blue-300' },
  { name: 'Firebase', type: 'Backend', icon: Database, iconClass: 'text-yellow-500' },
  { name: 'Git', type: 'Version Control', icon: GitBranch, iconClass: 'text-red-500' },
  { name: 'Android Studio', type: 'IDE', icon: Layers, iconClass: 'text-green-400' },
  { name: 'VS Code', type: 'Editor', icon: Terminal, iconClass: 'text-blue-500' },
]
</script>

<template>
  <section id="tools" class="py-20 bg-gray-800/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-white mb-12">Tools & Teknologi</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <div
          v-for="(skill, index) in skills"
          :key="index"
          class="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all hover:-translate-y-1 group"
        >
          <div class="mb-4 transform group-hover:scale-110 transition-transform duration-300">
            <component :is="skill.icon" class="w-8 h-8" :class="skill.iconClass" />
          </div>
          <h3 class="font-bold text-white">{{ skill.name }}</h3>
          <p class="text-sm text-gray-400 mt-1">{{ skill.type }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
