<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AdminLayout from '@/components/admin/AdminLayout.vue';
import QuasarEditor from '@/components/blog/QuasarEditor.vue';
import { useBlogService } from '@/composables/useBlogService';
import { usePostEditor } from '@/composables/usePostEditor';
import { sanitizeHtml } from '@/utils/sanitize';

const route = useRoute();
const router = useRouter();
const blogService = useBlogService();

const { form, loading, isNew, save, handleImageUpload, onImageInserted } = usePostEditor({
  blogService,
  route,
  router,
});

const contentTab = ref('editor');

// Auto-generate slug from title
watch(
  () => form.value.title,
  (newTitle) => {
    // Only update validation-like logic or full slug if needed.
    // Ideally we update the form.slug directly.
    // Simple kebab-case transform:
    const slug = newTitle
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Try to avoid overwriting if user manually edited...
    // BUT user said "automate it", implying we fully control it or it's hidden.
    // Since we are removing the field, we MUST update it.
    form.value.slug = slug;
  },
);

// Auto-extract cover image from content
watch(
  () => form.value.content,
  (newContent) => {
    // Basic regex to find first img src
    const match = newContent.match(/<img[^>]+src="([^">]+)"/);
    if (match && match[1]) {
      form.value.coverImage = match[1];
    } else {
      // should we clear it? maybe not if manually set (but field is gone)
      form.value.coverImage = '';
    }
  },
);

// Sanitize content for safe preview (XSS protection)
const sanitizedContent = computed(() => sanitizeHtml(form.value.content));
</script>

<template>
  <AdminLayout>
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

      <div class="grid gap-2">
        <label class="font-medium">Content</label>
        <q-tabs
          v-model="contentTab"
          dense
          class="text-zinc-600 dark:text-zinc-400"
          active-color="primary"
          indicator-color="primary"
          align="left"
        >
          <q-tab name="editor" label="Editor" />
          <q-tab name="preview" label="Preview" />
        </q-tabs>

        <q-tab-panels v-model="contentTab" animated class="bg-transparent">
          <q-tab-panel name="editor" class="p-0">
            <QuasarEditor
              v-model="form.content"
              :uploader="handleImageUpload"
              @image-inserted="onImageInserted"
            />
          </q-tab-panel>

          <q-tab-panel name="preview" class="p-0">
            <div
              v-if="form.content"
              class="w-full p-6 min-h-[300px] border rounded-lg bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 prose dark:prose-invert max-w-none"
              v-html="sanitizedContent"
            />
            <div
              v-else
              class="w-full p-6 min-h-[300px] border rounded-lg bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-400 italic"
            >
              No content to preview. Start typing in the Editor tab.
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </AdminLayout>
</template>
