import type { IBlogService, BlogPost, BlogPostIndex } from '../types/blog'

export class BlogService implements IBlogService {
  async getPosts(): Promise<BlogPostIndex[]> {
    const res = await fetch('/api/posts')
    if (!res.ok) throw new Error('Failed to fetch posts')
    return res.json()
  }

  async getPost(id: string): Promise<BlogPost> {
    const res = await fetch(`/api/posts?id=${id}`)
    if (!res.ok) throw new Error('Failed to fetch post')
    return res.json()
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    // Optimization: In a real app, the API should support filtering by slug directly.
    // Here we fetch the index and match locally, which is inefficient but consistent with current implementation.
    const posts = await this.getPosts()
    const match = posts.find((p) => p.slug === slug || p.id === slug)
    if (!match) return null
    return this.getPost(match.id)
  }

  async savePost(post: Partial<BlogPost>): Promise<BlogPost> {
    const res = await fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify(post),
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error('Failed to save post')
    return res.json()
  }

  async deletePost(id: string): Promise<void> {
    const res = await fetch(`/api/posts?id=${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete post')
  }

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload', {
      method: 'PUT',
      body: formData,
    })

    if (!res.ok) throw new Error('Failed to upload image')
    const data = await res.json()
    return data.url
  }
}
