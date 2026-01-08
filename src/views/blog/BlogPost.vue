<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { useBlogService } from '@/composables/useBlogService';
import { useDate } from '@/composables/useDate';
import { sanitizeHtml } from '@/utils/sanitize';
import type { BlogPost } from '@/types/blog';
import NavBar from '@/components/NavBar.vue';
import BlogHeader from '@/components/blog/BlogHeader.vue';

const route = useRoute();
const blogService = useBlogService();
const { formatDate } = useDate();
const post = ref<BlogPost | null>(null);
const loading = ref(true);

// Extract the first image from content to use as thumbnail
const thumbnailImage = computed(() => {
  if (post.value?.coverImage) {
    return post.value.coverImage;
  }

  // Extract first image from content
  const content = post.value?.content || '';
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  return imgMatch ? imgMatch[1] : null;
});

// Sanitize content for safe rendering (XSS protection)
const sanitizedContent = computed(() =>
  post.value?.content ? sanitizeHtml(post.value.content) : '',
);

// Remove the first image from content to avoid duplication with thumbnail
const contentWithoutThumbnail = computed(() => {
  let content = sanitizedContent.value;

  // Only remove first image if we don't have an explicit coverImage
  // (if coverImage exists, content and cover are different)
  if (!post.value?.coverImage && content) {
    // Remove the first <img> tag from the content
    content = content.replace(/<img[^>]+>/i, '');
  }

  return content;
});

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
  <div
    class="min-h-screen font-sans"
    style="
      background-color: var(--color-bg-primary);
      color: var(--color-text-body);
      transition:
        background-color 0.3s ease,
        color 0.3s ease;
    "
  >
    <NavBar :menu-items="[]" />
    <BlogHeader />
    <main class="max-w-[720px] mx-auto px-6 py-12 md:py-20">
      <div v-if="loading" class="text-center py-12">{{ $t('common.loading') }}</div>
      <div v-else-if="!post" class="text-center py-12">{{ $t('common.postNotFound') }}</div>
      <article v-else class="space-y-12">
        <header class="text-center space-y-6">
          <div class="space-y-2">
            <time
              v-if="post.createdAt"
              class="block text-sm font-medium tracking-wide text-zinc-500 dark:text-zinc-400 uppercase"
            >
              {{ formatDate(post.createdAt) }}
            </time>
            <h1
              class="blog-post-title text-3xl sm:text-4xl md:!text-[42px] font-extrabold text-zinc-900 dark:text-white leading-tight tracking-tight"
            >
              {{ post.title }}
            </h1>
          </div>
        </header>

        <div
          v-if="thumbnailImage"
          class="w-full aspect-video rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-lg"
        >
          <img :src="thumbnailImage" :alt="post.title" class="object-cover w-full h-full" />
        </div>

        <div
          class="prose dark:prose-invert max-w-none blog-content"
          v-html="contentWithoutThumbnail"
        ></div>
      </article>
    </main>
  </div>
</template>

<style>
/* Force title size override */
h1.blog-post-title {
  font-size: 42px !important;
  line-height: 1.1 !important;
}

@media (max-width: 768px) {
  h1.blog-post-title {
    font-size: 2.25rem !important; /* 36px on mobile */
  }
}

/* Custom Typography & Readability Styles */
.blog-content {
  font-size: 1.125rem; /* 18px */
  line-height: 1.75;
  color: var(--color-text-body);
}

.blog-content p {
  margin-bottom: 2rem; /* Airy paragraphs */
}

/* Headings */
.blog-content h2 {
  font-size: 1.875rem; /* 30px */
  font-weight: 700;
  margin-top: 3.5rem;
  margin-bottom: 1.5rem;
  color: var(--color-text-heading);
  letter-spacing: -0.025em;
}

.blog-content h3 {
  font-size: 1.5rem; /* 24px */
  font-weight: 600;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  color: var(--color-text-heading);
}

/* Lists */
.blog-content ul,
.blog-content ol {
  margin-bottom: 2rem;
  padding-left: 1.5rem;
}

.blog-content ul li {
  list-style-type: disc;
  margin-bottom: 0.75rem;
  padding-left: 0.5rem;
}

.blog-content ul li::marker {
  color: var(--q-primary); /* Use brand color for bullets */
}

/* Blockquotes */
.blog-content blockquote {
  border-left: 4px solid var(--q-primary);
  padding-left: 1.5rem;
  margin: 2.5rem 0;
  font-style: italic;
  font-size: 1.25rem;
  color: var(--color-text-muted);
  background: var(--color-bg-secondary); /* Optional: subtle bg */
  padding: 1.5rem;
  border-radius: 0 0.5rem 0.5rem 0;
}

/* Strong emphasis */
.blog-content strong {
  font-weight: 700;
  color: var(--color-text-heading);
}

/* Links */
.blog-content a {
  color: var(--q-primary);
  text-decoration: underline;
  text-underline-offset: 4px;
  font-weight: 500;
}

.blog-content a:hover {
  text-decoration: none;
}

/* Utilities for overrides if needed */
:root {
  --color-text-heading: #18181b;
  --color-text-body: #3f3f46;
  --color-text-muted: #71717a;
  --color-bg-secondary: #f4f4f5;
}

.dark {
  --color-text-heading: #fafafa;
  --color-text-body: #d4d4d8;
  --color-text-muted: #a1a1aa;
  --color-bg-secondary: #27272a;
}
</style>
