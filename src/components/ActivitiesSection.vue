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
      <h2 class="text-3xl font-bold text-white mb-12">{{ $t('activities.title') }}</h2>

      <div v-if="loading" class="text-center text-gray-400">
        {{ $t('common.loading') }}
      </div>

      <div v-else-if="posts.length === 0" class="text-center text-gray-400">
        {{ $t('common.noPostsFound') }}
      </div>

      <div
        v-else
        class="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-blue-500 before:to-transparent"
      >
        <div
          v-for="post in posts"
          :key="post.id"
          class="relative flex items-center justify-between group is-active cursor-pointer"
          @click="navigateToPost(post.slug)"
        >
          <!-- Timeline Dot (Absolute centered on the line) -->
          <div
            class="absolute left-5 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full border border-gray-700 bg-gray-900 group-hover:bg-blue-600 group-hover:border-blue-500 transition-colors z-10 shadow shadow-blue-900/20"
          >
            <div
              class="w-3 h-3 bg-blue-500 rounded-full group-hover:bg-white transition-colors"
            ></div>
          </div>

          <!-- Content Card -->
          <div
            class="w-[calc(100%-4rem)] ml-auto p-6 rounded-xl border border-gray-700 bg-gray-800 hover:border-blue-500 transition-all shadow-lg"
          >
            <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
              <h3 class="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">
                {{ post.title }}
              </h3>
              <span class="text-blue-400 text-sm font-mono mt-1 sm:mt-0">{{
                formatDate(post.createdAt, 'MMM DD, YYYY')
              }}</span>
            </div>
            <p class="text-gray-400 text-sm leading-relaxed line-clamp-3">
              {{ post.excerpt }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
