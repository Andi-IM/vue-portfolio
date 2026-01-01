<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useBlogService } from '../../composables/useBlogService'
import type { BlogPostIndex } from '../../types/blog'

const blogService = useBlogService()
const posts = ref<BlogPostIndex[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    posts.value = await blogService.getPosts()
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold mb-8 text-zinc-900 dark:text-white">Blog</h1>

    <div v-if="loading" class="text-center py-12">
      <span class="text-zinc-500">Loading posts...</span>
    </div>

    <div v-else-if="posts.length === 0" class="text-center py-12">
      <span class="text-zinc-500">No posts found.</span>
    </div>

    <div v-else class="grid gap-8">
      <article
        v-for="post in posts"
        :key="post.id"
        class="group relative flex flex-col items-start"
      >
        <div
          v-if="post.coverImage"
          class="w-full h-64 mb-4 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800"
        >
          <img
            :src="post.coverImage"
            :alt="post.title"
            class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <h2
          class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
        >
          <RouterLink :to="`/blog/${post.slug || post.id}`">
            <span class="absolute inset-0 z-10"></span>
            {{ post.title }}
          </RouterLink>
        </h2>
        <time
          class="relative z-10 order-first mb-3 flex items-center text-sm text-zinc-400 dark:text-zinc-500 pl-3.5"
        >
          <span class="absolute inset-y-0 left-0 flex items-center" aria-hidden="true">
            <span class="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500"></span>
          </span>
          {{ new Date(post.createdAt).toLocaleDateString() }}
        </time>
        <p class="relative z-10 mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
          {{ post.excerpt }}
        </p>
        <div
          aria-hidden="true"
          class="relative z-10 mt-4 flex items-center text-sm font-medium text-blue-500"
        >
          Read article
          <svg
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            class="ml-1 h-4 w-4 stroke-current"
          >
            <path
              d="M6.75 5.75 9.25 8l-2.5 2.25"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </div>
      </article>
    </div>
  </div>
</template>
