<script setup lang="ts">
import { ref } from 'vue'
import { ExternalLink, Github, X, Smartphone, Code, CheckCircle2 } from 'lucide-vue-next'
import marketMingleImg from '../images/market-mingle.png'
import lokapanduImg from '../images/lokapandu.png'

interface Project {
  title: string
  description: string
  longDescription: string
  features: string[]
  tags: string[]
  image: string
  link: string
  github: string
}

const selectedProject = ref<Project | null>(null)

const projects = [
  {
    title: 'Lokapandu',
    description:
      'Solusi terpusat bagi wisatawan untuk menemukan rekomendasi destinasi anti-mainstream dan menyusun rencana perjalanan secara visual dan efisien.',
    longDescription:
      'Lokapandu dikembangkan untuk menjawab tantangan pariwisata Indonesia yang tumbuh pesat, di mana wisatawan kesulitan merencanakan perjalanan akibat informasi destinasi yang tersebar. Aplikasi ini menyatukan pencarian dan perencanaan wisata dalam satu platform. MVP aplikasi Lokapandu memiliki tiga fitur utama: Rekomendasi Wisata, Rencana Wisata, dan Asisten Wisata AI berbasis Gemini. Dibangun dengan Flutter dan Supabase, Lokapandu menghadirkan solusi modern, aman, dan siap pakai bagi wisatawan.',
    features: [
      'Rekomendasi Wisata',
      'Rencana Wisata',
      'Asisten Wisata AI berbasis Gemini',
    ],
    tags: ['Flutter', 'Supabase', 'Provider', 'Gemini', 'Dart'],
    image: lokapanduImg,
    link: 'https://drive.google.com/drive/folders/1HIW2WgRz-RxB3vCe9joTAXPQ5N1v3HqY?usp=drive_link',
    github: 'https://github.com/Lokapandu/Lokapandu',
  },
  {
    title: 'Market Mingle - Aplikasi E-commerce sederhana',
    description: 'Aplikasi multi platform sederhana yang menampilkan daftar',
    longDescription:
      'FinTrack adalah solusi manajemen keuangan pribadi yang komprehensif. Dibangun dengan Flutter untuk performa native yang mulus, aplikasi ini memungkinkan pengguna untuk mencatat transaksi harian, memvisualisasikan arus kas dengan grafik interaktif, dan menetapkan anggaran bulanan agar tetap pada jalurnya. Sinkronisasi cloud memastikan data Anda aman dan dapat diakses dari perangkat mana pun.',
    features: [
      'Penjelajahan produk',
      'Keranjang belanja',
      'multi-platform (web, mobile, desktop)',
    ],
    tags: ['Flutter','Dart', 'Provider', ],
    image: marketMingleImg,
    link: 'https://marketmingle.andi-irhamm.workers.dev/',
    github: 'https://github.com/Andi-IM/market-mingle.git',
  },
]

const openProject = (project: Project) => {
  selectedProject.value = project
}

const closeProject = () => {
  selectedProject.value = null
}

const openLink = (url: string) => {
  window.open(url, '_blank')
}
</script>

<template>
  <section id="proyek" class="py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-white mb-12">Proyek Terselesaikan</h2>
      <p class="text-gray-400 mb-8 -mt-8">Klik pada kartu proyek untuk melihat detail lengkap.</p>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(project, index) in projects"
          :key="index"
          @click="openProject(project)"
          class="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:shadow-xl hover:shadow-blue-900/20 transition-all duration-300 group cursor-pointer transform hover:-translate-y-2"
        >
          <div class="relative h-48 overflow-hidden">
            <div
              class="absolute inset-0 bg-blue-900/20 group-hover:bg-transparent transition-colors z-10"
            ></div>
            <img
              :src="project.image"
              :alt="project.title"
              class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div
              class="absolute bottom-4 right-4 bg-black/60 backdrop-blur text-white text-xs px-2 py-1 rounded z-20 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Klik untuk detail
            </div>
          </div>
          <div class="p-6">
            <h3
              class="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors"
            >
              {{ project.title }}
            </h3>
            <p class="text-gray-400 text-sm mb-4 line-clamp-2">{{ project.description }}</p>
            <div class="flex flex-wrap gap-2 mb-6">
              <span
                v-for="(tag, tagIndex) in project.tags.slice(0, 3)"
                :key="tagIndex"
                class="bg-blue-900/30 text-blue-400 text-xs px-3 py-1 rounded-full border border-blue-900/50"
              >
                {{ tag }}
              </span>
              <span
                v-if="project.tags.length > 3"
                class="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded-full border border-gray-700"
              >
                +{{ project.tags.length - 3 }}
              </span>
            </div>
            <div class="flex gap-4 pt-4 border-t border-gray-700">
              <button
                @click.stop="openLink(project.link)"
                class="flex items-center gap-2 text-sm text-white hover:text-blue-400 transition-colors"
              >
                <ExternalLink :size="16" /> Website
              </button>
              <button
                @click.stop="openLink(project.github)"
                class="flex items-center gap-2 text-sm text-white hover:text-blue-400 transition-colors"
              >
                <Github :size="16" /> GitHub
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
      class="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl relative animate-in zoom-in-95 duration-300"
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
          :alt="selectedProject.title"
          class="w-full h-full object-cover"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"
        ></div>
        <h3
          class="absolute bottom-6 left-6 text-3xl md:text-4xl font-bold text-white shadow-black drop-shadow-lg"
        >
          {{ selectedProject.title }}
        </h3>
      </div>

      <!-- Modal Content -->
      <div class="p-6 sm:p-8 space-y-8">
        <!-- Description -->
        <div>
          <h4 class="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
            <Smartphone :size="20" /> Tentang Aplikasi
          </h4>
          <p class="text-gray-300 leading-relaxed text-lg">
            {{ selectedProject.longDescription }}
          </p>
        </div>

        <!-- Tech Stack -->
        <div>
          <h4 class="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
            <Code :size="20" /> Teknologi yang Digunakan
          </h4>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(tag, idx) in selectedProject.tags"
              :key="idx"
              class="bg-blue-900/20 text-blue-300 px-4 py-2 rounded-lg border border-blue-900/50 font-medium"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- Features List -->
        <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
          <h4 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 :size="20" class="text-green-500" /> Fitur Utama
          </h4>
          <div class="grid md:grid-cols-2 gap-3">
            <div
              v-for="(feature, idx) in selectedProject.features"
              :key="idx"
              class="flex items-start gap-3 text-gray-300"
            >
              <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2.5 shrink-0"></span>
              <span>{{ feature }}</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-800">
          <a
            :href="selectedProject.link"
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-center transition-all hover:shadow-lg hover:shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            <ExternalLink :size="20" /> Kunjungi Website / Demo
          </a>
          <a
            :href="selectedProject.github"
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3.5 rounded-xl text-center transition-all border border-gray-700 flex items-center justify-center gap-2"
          >
            <Github :size="20" /> Lihat Source Code
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
