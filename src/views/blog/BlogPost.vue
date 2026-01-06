<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { useBlogService } from '@/composables/useBlogService';
import { useDate } from '@/composables/useDate';
import { sanitizeHtml } from '@/utils/sanitize';
import type { BlogPost } from '@/types/blog';

const route = useRoute();
const blogService = useBlogService();
const { formatDate } = useDate();
const post = ref<BlogPost | null>(null);
const loading = ref(true);

// Sanitize content for safe rendering (XSS protection)
const sanitizedContent = computed(() =>
  post.value?.content ? sanitizeHtml(post.value.content) : '',
);

onMounted(async () => {
  try {
    const slugOrId = route.params.slug as string;
    post.value = await blogService.getPostBySlug(slugOrId);
    if (post.value) {
      void blogService.incrementView(post.value.id);
    }
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-12">
    <div v-if="loading" class="text-center">{{ $t('common.loading') }}</div>
    <div v-else-if="!post" class="text-center">{{ $t('common.postNotFound') }}</div>
    <article v-else class="space-y-8">
      <div class="text-center space-y-4">
        <time v-if="post.createdAt" class="text-zinc-400 dark:text-zinc-500">{{
          formatDate(post.createdAt)
        }}</time>
        <h1 class="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white">
          {{ post.title }}
        </h1>
      </div>

      <div
        v-if="post.coverImage"
        class="w-full aspect-video rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-lg"
      >
        <img :src="post.coverImage" :alt="post.title" class="object-cover w-full h-full" />
      </div>

      <div class="prose dark:prose-invert max-w-none" v-html="sanitizedContent"></div>
    </article>
  </div>
</template>
