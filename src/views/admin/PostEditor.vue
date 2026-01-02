<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import QuasarEditor from '@/components/blog/QuasarEditor.vue';
import { useBlogService } from '@/composables/useBlogService';
import { usePostEditor } from '@/composables/usePostEditor';

const route = useRoute();
const router = useRouter();
const blogService = useBlogService();

const { form, loading, isNew, save, handleImageUpload } = usePostEditor({
  blogService,
  route,
  router,
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50">
    <div class="max-w-4xl mx-auto px-4 py-12">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold">{{ isNew ? 'New Post' : 'Edit Post' }}</h1>
        <div class="space-x-4">
          <button
            @click="$router.push('/admin')"
            class="px-4 py-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            @click="save"
            :disabled="loading"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {{ loading ? 'Saving...' : 'Save Post' }}
          </button>
        </div>
      </div>

      <div class="grid gap-6">
        <div class="grid gap-2">
          <label class="font-medium">Title</label>
          <input
            v-model="form.title"
            type="text"
            class="w-full px-4 py-2 border rounded-lg bg-transparent border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Post Title"
          />
        </div>

        <div class="grid grid-cols-2 gap-6">
          <div class="grid gap-2">
            <label class="font-medium">Slug</label>
            <input
              v-model="form.slug"
              type="text"
              class="w-full px-4 py-2 border rounded-lg bg-transparent border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="post-url-slug"
            />
          </div>
          <div class="grid gap-2">
            <label class="font-medium">Cover Image URL</label>
            <input
              v-model="form.coverImage"
              type="text"
              class="w-full px-4 py-2 border rounded-lg bg-transparent border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
          </div>
        </div>

        <div class="grid gap-2">
          <label class="font-medium">Excerpt</label>
          <textarea
            v-model="form.excerpt"
            rows="3"
            class="w-full px-4 py-2 border rounded-lg bg-transparent border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Short summary..."
          ></textarea>
        </div>

        <div class="grid gap-2">
          <label class="font-medium">Content</label>
          <QuasarEditor v-model="form.content" :uploader="handleImageUpload" />
        </div>
      </div>
    </div>
  </div>
</template>
