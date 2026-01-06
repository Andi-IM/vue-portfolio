import { ref, onMounted, computed } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router';

import type { BlogPost, IBlogService } from '../types/blog';

export interface PostEditorDependencies {
  blogService: IBlogService;
  route: RouteLocationNormalizedLoaded;
  router: Router;
}

/**
 * Extract the first image URL from HTML content.
 * Used for headline image unification - the first image in editor becomes the cover image.
 */
export function extractFirstImage(html: string): string | null {
  const match = /<img[^>]+src=["']([^"']+)["']/i.exec(html);
  return match?.[1] ?? null;
}

export function usePostEditor({ blogService, route, router }: PostEditorDependencies) {
  const isNew: ComputedRef<boolean> = computed(() => route.params.id === 'new');

  const form: Ref<BlogPost> = ref<BlogPost>({
    id: '',
    title: '',
    slug: '',
    excerpt: '',
    coverImage: '',
    content: '',
  });

  const loading = ref(false);

  onMounted(async () => {
    if (!isNew.value) {
      try {
        const post = await blogService.getPost(route.params.id as string);
        form.value = post;
      } catch (e) {
        console.error('Failed to load post', e);
      }
    }
  });

  const save = async () => {
    if (!form.value.title) {
      alert('Title is required');
      return;
    }

    // Auto generate slug if empty
    if (!form.value.slug) {
      form.value.slug = form.value.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    loading.value = true;
    try {
      await blogService.savePost(form.value);
      alert('Saved!');
      await router.push('/admin/posts');
    } catch (e) {
      console.error('Save error', e);
      alert('Error saving');
    } finally {
      loading.value = false;
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    return await blogService.uploadImage(file);
  };

  /**
   * Handler for when an image is inserted into the editor.
   * Auto-sets coverImage if it's currently empty (headline image unification).
   */
  const onImageInserted = (url: string) => {
    if (!form.value.coverImage) {
      form.value.coverImage = url;
    }
  };

  return {
    form,
    loading,
    isNew,
    save,
    handleImageUpload,
    onImageInserted,
  };
}
