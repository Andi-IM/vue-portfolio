<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useBlogService } from '../composables/useBlogService';
import { useDate } from '../composables/useDate';
import type { BlogPostIndex } from '../types/blog';

const blogService = useBlogService();
const { formatDate } = useDate();
const router = useRouter();

const posts = ref<BlogPostIndex[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const allPosts = await blogService.getPosts();
    // Sort by date desc and take top 3
    posts.value = allPosts
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  } catch (e) {
    console.error('Failed to load posts', e);
  } finally {
    loading.value = false;
  }
});

const navigateToPost = (slug: string) => {
  void router.push({ name: 'blog-post', params: { slug } });
};
</script>

<template>
  <section id="activities" class="py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold mb-12">{{ $t('activities.title') }}</h2>

      <div v-if="loading" class="text-center" style="color: var(--color-text-muted)">
        {{ $t('common.loading') }}
      </div>

      <div
        v-else-if="posts.length === 0"
        class="text-center"
        style="color: var(--color-text-muted)"
      >
        {{ $t('common.noPostsFound') }}
      </div>

      <div v-else class="activities-timeline space-y-12 relative">
        <div
          v-for="post in posts"
          :key="post.id"
          class="relative flex items-center justify-between group is-active cursor-pointer"
          @click="navigateToPost(post.slug)"
        >
          <!-- Timeline Dot (Absolute centered on the line) -->
          <div
            class="activity-dot absolute left-5 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 z-10"
          >
            <div class="activity-dot-inner w-3 h-3 rounded-full transition-all duration-300"></div>
          </div>

          <!-- Content Card -->
          <div
            class="activity-card w-[calc(100%-4rem)] ml-auto p-6 rounded-xl transition-all duration-300"
          >
            <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
              <h3
                class="font-bold text-lg transition-colors"
                style="color: var(--color-text-heading)"
              >
                {{ post.title }}
              </h3>
              <span class="text-sm font-mono mt-1 sm:mt-0" style="color: var(--color-primary)">{{
                formatDate(post.createdAt, 'MMM DD, YYYY')
              }}</span>
            </div>
            <p class="text-sm leading-relaxed line-clamp-3" style="color: var(--color-text-muted)">
              {{ post.excerpt }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Timeline vertical line */
.activities-timeline::before {
  content: '';
  position: absolute;
  left: 1.25rem; /* 20px = left-5 */
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    var(--color-primary) 10%,
    var(--color-primary) 90%,
    transparent 100%
  );
  transform: translateX(-50%);
}

/* Timeline dot styling */
.activity-dot {
  border: 1px solid var(--color-timeline-dot-border);
  background-color: var(--color-timeline-dot-bg);
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1);
}

.activity-dot-inner {
  background-color: var(--color-timeline-dot);
}

/* Hover effects for timeline dot */
.group:hover .activity-dot {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  transform: translateX(-50%) scale(1.1);
}

.group:hover .activity-dot-inner {
  background-color: white;
}

/* Activity card styling */
.activity-card {
  border: 1px solid var(--color-border);
  background-color: var(--color-bg-card);
  box-shadow: var(--shadow-card);
}

/* Hover effects for card */
.activity-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-4px);
}
</style>
