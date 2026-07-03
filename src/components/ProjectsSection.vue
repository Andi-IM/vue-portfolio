<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ExternalLink, Github, X, Smartphone, Code, CheckCircle2 } from 'lucide-vue-next';
import { Icon } from '@iconify/vue';

import lokapanduImg from '../images/lokapandu.webp';
import nutrivisionImg from '../images/nutrivision.webp';
import deretsolverImg from '../images/deretsolver.webp';
import fintrackImg from '../images/fintrack.png';
import operationalReceiptImg from '../images/visiflow.jpg';
import siaasImg from '../images/siaas.png';
import masjidkuImg from '../images/masjidku.svg';

interface Project {
  key: string;
  tags: string[];
  image: string;
  link?: string | null;
  github: string;
}

// Tech logo configuration using Iconify simple-icons
// Format: { name: { icon: 'simple-icons:slug', color: '#hex' } }
const techLogos: Record<string, { icon: string; color: string }> = {
  Flutter: { icon: 'simple-icons:flutter', color: '#02569B' },
  Dart: { icon: 'simple-icons:dart', color: '#0175C2' },
  Firebase: { icon: 'simple-icons:firebase', color: '#FFCA28' },
  Supabase: { icon: 'simple-icons:supabase', color: '#3ECF8E' },
  Provider: { icon: 'simple-icons:flutter', color: '#02569B' }, // Use Flutter icon for Provider
  Gemini: { icon: 'simple-icons:googlegemini', color: '#8E75B2' },
  React: { icon: 'simple-icons:react', color: '#61DAFB' },
  Nextjs: { icon: 'simple-icons:nextdotjs', color: '#000000' },
  JavaScript: { icon: 'simple-icons:javascript', color: '#F7DF1E' },
  TypeScript: { icon: 'simple-icons:typescript', color: '#3178C6' },
  Tailwindcss: { icon: 'simple-icons:tailwindcss', color: '#06B6D4' },
  Vue: { icon: 'simple-icons:vuedotjs', color: '#4FC08D' },
  Node: { icon: 'simple-icons:nodedotjs', color: '#339933' },
  Python: { icon: 'simple-icons:python', color: '#3776AB' },
  Git: { icon: 'simple-icons:git', color: '#F05032' },
  Tauri: { icon: 'simple-icons:tauri', color: '#24C8DB' },
  SQLite: { icon: 'simple-icons:sqlite', color: '#003B57' },
  Rust: { icon: 'simple-icons:rust', color: '#E0573E' },
  Java: { icon: 'simple-icons:openjdk', color: '#E76F00' },
  CSS: { icon: 'simple-icons:css', color: '#663399' },
  Gradle: { icon: 'simple-icons:gradle', color: '#02303A' },
};

const getTechLogo = (tech: string) => {
  const config = techLogos[tech];
  if (config) {
    return {
      icon: config.icon,
      color: config.color,
      name: tech,
      hasIcon: true,
    };
  }
  // Fallback for unknown techs
  return {
    icon: '',
    color: '#6B7280',
    name: tech,
    hasIcon: false,
  };
};

const i18n = useI18n();

const selectedProject = ref<Project | null>(null);

const projectFeatures = computed((): string[] => {
  if (!selectedProject.value) return [];
  const features = i18n.tm(`projects.${selectedProject.value.key}.features`);
  return Array.isArray(features) ? features.map((f: unknown) => i18n.rt(f as string)) : [];
});

// Projects data - titles/descriptions/features pulled from i18n
const projects = [
  {
    key: 'lokapandu',
    tags: ['Flutter', 'Supabase', 'Provider', 'Gemini', 'Dart'],
    image: lokapanduImg,
    link: 'https://drive.google.com/drive/folders/1HIW2WgRz-RxB3vCe9joTAXPQ5N1v3HqY?usp=drive_link',
    github: 'https://github.com/Lokapandu/Lokapandu',
  },
  {
    key: 'nutrivision',
    tags: ['Flutter', 'Dart', 'Provider', 'Firebase', 'Gemini'],
    image: nutrivisionImg,
    link: null,
    github: 'https://github.com/Andi-IM/meal_detection',
  },
  {
    key: 'deretsolver',
    tags: ['React', 'JavaScript', 'Firebase', 'Tailwindcss', 'Gemini'],
    image: deretsolverImg,
    link: 'https://deretsolver.web.app/',
    github: 'https://github.com/Andi-IM/deretsolver',
  },
  {
    key: 'fintrack',
    tags: ['Nextjs', 'React', 'TypeScript', 'Supabase', 'Tailwindcss', 'Gemini'],
    image: fintrackImg,
    link: 'https://preview.fintrek.web.id/',
    github: 'https://github.com/Andi-IM/fintrack-saas',
  },
  {
    key: 'visiflow',
    tags: ['React', 'TypeScript', 'Node', 'Tailwindcss', 'Gemini'],
    image: operationalReceiptImg,
    link: 'https://visiflow.fun',
    github: 'https://github.com/Andi-IM/operational-receipt',
  },
  {
    key: 'siaas',
    tags: ['Nextjs', 'React', 'TypeScript', 'Tauri', 'SQLite', 'Rust'],
    image: siaasImg,
    link: 'https://github.com/Andi-IM/siaas/releases',
    github: 'https://github.com/Andi-IM/siaas',
  },
  {
    key: 'masjidku',
    tags: ['Java', 'JavaFX', 'SQLite', 'CSS', 'Gradle'],
    image: masjidkuImg,
    link: 'https://github.com/Andi-IM/Masjidku/releases',
    github: 'https://github.com/Andi-IM/Masjidku',
  },
];

const openProject = (project: Project) => {
  selectedProject.value = project;
};

const closeProject = () => {
  selectedProject.value = null;
};

const openLink = (url?: string | null) => {
  if (url) {
    window.open(url, '_blank');
  }
};
</script>

<template>
  <section id="projects" class="py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold mb-12">{{ $t('projects.title') }}</h2>
      <p class="mb-8 -mt-8" style="color: var(--color-text-muted)">{{ $t('projects.subtitle') }}</p>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(project, index) in projects"
          :key="index"
          @click="openProject(project)"
          class="rounded-xl overflow-hidden transition-all duration-300 group cursor-pointer transform hover:-translate-y-2"
          style="
            background-color: var(--color-bg-card);
            border: 1px solid var(--color-border);
            box-shadow: var(--shadow-card);
          "
        >
          <div class="relative h-48 overflow-hidden">
            <div
              class="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors z-10"
            ></div>
            <img
              :src="project.image"
              :alt="$t(`projects.${project.key}.title`)"
              class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div
              class="absolute bottom-4 right-4 bg-black/60 backdrop-blur text-white text-xs px-2 py-1 rounded z-20 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {{ $t('projects.clickForDetails') }}
            </div>
          </div>
          <div class="p-6">
            <h3
              class="text-xl font-bold mb-2 transition-colors"
              style="color: var(--color-text-heading)"
            >
              {{ $t(`projects.${project.key}.title`) }}
            </h3>
            <p class="text-sm mb-4 line-clamp-2" style="color: var(--color-text-muted)">
              {{ $t(`projects.${project.key}.description`) }}
            </p>
            <div class="flex flex-wrap gap-3 mb-6">
              <q-avatar
                v-for="(tag, tagIndex) in project.tags.slice(0, 5)"
                :key="tagIndex"
                size="28px"
                class="tech-logo-avatar"
                style="background-color: var(--color-tag-bg)"
              >
                <Icon
                  v-if="getTechLogo(tag).hasIcon"
                  :icon="getTechLogo(tag).icon"
                  :style="{ color: getTechLogo(tag).color }"
                  class="w-4 h-4"
                />
                <span v-else class="text-xs font-bold" style="color: var(--color-tag-text)">
                  {{ tag.charAt(0) }}
                </span>
                <q-tooltip class="text-sm">{{ tag }}</q-tooltip>
              </q-avatar>
              <q-avatar
                v-if="project.tags.length > 5"
                size="28px"
                style="
                  background-color: var(--color-bg-card-hover);
                  border: 1px solid var(--color-border);
                "
              >
                <span class="text-xs" style="color: var(--color-text-muted)">
                  +{{ project.tags.length - 5 }}
                </span>
              </q-avatar>
            </div>
            <div class="flex gap-4 pt-4" style="border-top: 1px solid var(--color-border)">
              <button
                v-if="project.link"
                @click.stop="openLink(project.link)"
                class="flex items-center gap-2 text-sm transition-colors"
                style="color: var(--color-text-heading)"
              >
                <ExternalLink :size="16" /> {{ $t('projects.website') }}
              </button>
              <button
                @click.stop="openLink(project.github)"
                class="flex items-center gap-2 text-sm transition-colors"
                style="color: var(--color-text-heading)"
              >
                <Github :size="16" /> {{ $t('projects.github') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Project Detail Modal -->
  <div
    v-if="selectedProject"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    @click="closeProject"
  >
    <div
      class="rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-300"
      style="background-color: var(--color-bg-card); border: 1px solid var(--color-border)"
      @click.stop
    >
      <!-- Close Button -->
      <button
        @click="closeProject"
        class="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-red-500/80 rounded-full text-white transition-all backdrop-blur"
      >
        <X :size="24" />
      </button>

      <!-- Modal Image -->
      <div class="relative h-64 sm:h-80 w-full">
        <img
          :src="selectedProject.image"
          :alt="$t(`projects.${selectedProject.key}.title`)"
          class="w-full h-full object-cover"
        />
        <div
          class="absolute inset-0"
          style="background: linear-gradient(to top, var(--color-bg-card), transparent)"
        ></div>
        <h3
          class="absolute bottom-6 left-6 text-3xl md:text-4xl font-bold text-white shadow-black drop-shadow-lg"
        >
          {{ $t(`projects.${selectedProject.key}.title`) }}
        </h3>
      </div>

      <!-- Modal Content -->
      <div class="p-6 sm:p-8 space-y-8">
        <!-- Description -->
        <div>
          <h4
            class="text-lg font-semibold mb-3 flex items-center gap-2"
            style="color: var(--color-primary)"
          >
            <Smartphone :size="20" /> {{ $t('projects.aboutTheApp') }}
          </h4>
          <p class="leading-relaxed text-lg" style="color: var(--color-text-body)">
            {{ $t(`projects.${selectedProject.key}.longDescription`) }}
          </p>
        </div>

        <!-- Tech Stack -->
        <div>
          <h4
            class="text-lg font-semibold mb-4 flex items-center gap-2"
            style="color: var(--color-primary)"
          >
            <Code :size="20" /> {{ $t('projects.technologiesUsed') }}
          </h4>
          <div class="flex flex-wrap gap-3">
            <div
              v-for="(tag, idx) in selectedProject.tags"
              :key="idx"
              class="flex items-center gap-2 px-4 py-2 rounded-full"
              style="background-color: var(--color-tag-bg)"
            >
              <Icon
                v-if="getTechLogo(tag).hasIcon"
                :icon="getTechLogo(tag).icon"
                :style="{ color: getTechLogo(tag).color }"
                class="w-5 h-5"
              />
              <span
                v-else
                class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style="background-color: var(--color-primary); color: white"
              >
                {{ tag.charAt(0) }}
              </span>
              <span class="font-medium" style="color: var(--color-tag-text)">{{ tag }}</span>
            </div>
          </div>
        </div>

        <!-- Features List -->
        <div
          class="p-6 rounded-xl"
          style="
            background-color: var(--color-bg-card-hover);
            border: 1px solid var(--color-border);
          "
        >
          <h4
            class="text-lg font-semibold mb-4 flex items-center gap-2"
            style="color: var(--color-text-heading)"
          >
            <CheckCircle2 :size="20" class="text-green-500" /> {{ $t('projects.keyFeatures') }}
          </h4>
          <div class="grid md:grid-cols-2 gap-3">
            <div
              v-for="(feature, idx) in projectFeatures"
              :key="idx"
              class="flex items-start gap-3"
              style="color: var(--color-text-body)"
            >
              <span
                class="w-1.5 h-1.5 rounded-full mt-2.5 shrink-0"
                style="background-color: var(--color-primary)"
              ></span>
              <span>{{ feature }}</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div
          class="flex flex-col sm:flex-row gap-4 pt-4"
          style="border-top: 1px solid var(--color-border)"
        >
          <a
            v-if="selectedProject.link"
            :href="selectedProject.link"
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 text-white font-bold py-3.5 rounded-xl text-center transition-all hover:shadow-lg flex items-center justify-center gap-2"
            style="background-color: var(--color-primary)"
          >
            <ExternalLink :size="20" /> {{ $t('projects.visitWebsite') }}
          </a>
          <a
            :href="selectedProject.github"
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 font-bold py-3.5 rounded-xl text-center transition-all flex items-center justify-center gap-2"
            style="
              background-color: var(--color-bg-card-hover);
              color: var(--color-text-heading);
              border: 1px solid var(--color-border);
            "
          >
            <Github :size="20" /> {{ $t('projects.viewSourceCode') }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
