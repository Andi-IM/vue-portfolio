import type { IBlogService, BlogPost, BlogPostIndex } from '../types/blog';

export class MockBlogService implements IBlogService {
  private posts: BlogPost[] = [];
  private readonly STORAGE_KEY = 'mock_blog_posts';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = sessionStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.posts = JSON.parse(stored);
      } else {
        // Default initial data
        this.posts = [
          {
            id: '1',
            title: 'Mock Post 1',
            slug: 'mock-post-1',
            excerpt: 'This is a mock post for testing.',
            content: '<p>Mock content here.</p>',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'Mock Post 2',
            slug: 'mock-post-2',
            excerpt: 'Another mock post.',
            content: '<p>More mock content.</p>',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        this.persist();
      }
    } catch (e) {
      console.warn('Failed to access sessionStorage', e);
    }
  }

  private persist() {
    try {
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.posts));
    } catch (e) {
      console.warn('Failed to save to sessionStorage', e);
    }
  }

  async getPosts(): Promise<BlogPostIndex[]> {
    await Promise.resolve();
    // oxlint-disable-next-line no-unused-vars
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return this.posts.map(({ content, ...index }) => index as BlogPostIndex);
  }

  async getPost(id: string): Promise<BlogPost> {
    await Promise.resolve();
    const post = this.posts.find((p) => p.id === id);
    if (!post) throw new Error('Post not found');
    return post;
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    await Promise.resolve();
    const post = this.posts.find((p) => p.slug === slug || p.id === slug);
    return post || null;
  }

  async savePost(post: Partial<BlogPost>): Promise<BlogPost> {
    await Promise.resolve();
    const newPost = {
      id: post.id || Math.random().toString(36).substr(2, 9),
      title: post.title || 'Untitled',
      slug: post.slug || 'untitled',
      excerpt: post.excerpt || '',
      content: post.content || '',
      createdAt: post.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...post,
    } as BlogPost;

    const existingIndex = this.posts.findIndex((p) => p.id === newPost.id);
    if (existingIndex >= 0) {
      this.posts[existingIndex] = newPost;
    } else {
      this.posts.push(newPost);
    }

    this.persist();
    return newPost;
  }

  async deletePost(id: string): Promise<void> {
    await Promise.resolve();
    this.posts = this.posts.filter((p) => p.id !== id);
    this.persist();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async uploadImage(_file: File): Promise<string> {
    await Promise.resolve();
    return 'https://example.com/mock-image.png';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async incrementView(_id: string): Promise<void> {
    await Promise.resolve();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPostViews(_id: string): Promise<number> {
    await Promise.resolve();
    return 100; // Mock view count
  }

  async getAllViews(): Promise<Record<string, number>> {
    await Promise.resolve();
    return {
      '1': 150,
      '2': 50,
    };
  }
}
