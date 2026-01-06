import type { IBlogService, BlogPost, BlogPostIndex } from '../types/blog';

export class BlogService implements IBlogService {
  async getPosts(): Promise<BlogPostIndex[]> {
    const res = await fetch('/api/posts');
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
  }

  async getPost(id: string): Promise<BlogPost> {
    const res = await fetch(`/api/posts?id=${id}`);
    if (!res.ok) throw new Error('Failed to fetch post');
    return res.json();
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    // Optimization: In a real app, the API should support filtering by slug directly.
    // Here we fetch the index and match locally, which is inefficient but consistent with current implementation.
    const posts = await this.getPosts();
    const match = posts.find((p) => p.slug === slug || p.id === slug);
    if (!match) return null;
    return this.getPost(match.id);
  }

  async savePost(post: Partial<BlogPost>): Promise<BlogPost> {
    const res = await fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify(post),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to save post');
    return res.json();
  }

  async deletePost(id: string): Promise<void> {
    const res = await fetch(`/api/posts?id=${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete post');
  }

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'PUT',
      body: formData,
    });

    if (!res.ok) throw new Error('Failed to upload image');
    const data = await res.json();
    return data.url;
  }

  async incrementView(id: string): Promise<void> {
    try {
      await fetch('/api/views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch (e) {
      console.error('Failed to increment view', e);
    }
  }

  async getPostViews(id: string): Promise<number> {
    try {
      const res = await fetch(`/api/views?id=${id}`);
      if (!res.ok) return 0;
      const data = await res.json();
      return data.views || 0;
    } catch (e) {
      console.error('Failed to get post views', e);
      return 0;
    }
  }

  async getAllViews(): Promise<Record<string, number>> {
    try {
      const res = await fetch('/api/views');
      if (!res.ok) return {};
      return await res.json();
    } catch (e) {
      console.error('Failed to get all views', e);
      return {};
    }
  }
}
