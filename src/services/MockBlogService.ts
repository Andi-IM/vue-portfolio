import type { IBlogService, BlogPost, BlogPostIndex } from '../types/blog';

export class MockBlogService implements IBlogService {
  private posts: BlogPost[] = [
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

  async getPosts(): Promise<BlogPostIndex[]> {
    // oxlint-disable-next-line no-unused-vars
    return this.posts.map(({ content, ...index }) => index as BlogPostIndex);
  }

  async getPost(id: string): Promise<BlogPost> {
    const post = this.posts.find((p) => p.id === id);
    if (!post) throw new Error('Post not found');
    return post;
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const post = this.posts.find((p) => p.slug === slug || p.id === slug);
    return post || null;
  }

  async savePost(post: Partial<BlogPost>): Promise<BlogPost> {
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
    this.posts.push(newPost);
    return newPost;
  }

  async deletePost(id: string): Promise<void> {
    this.posts = this.posts.filter((p) => p.id !== id);
  }

  async uploadImage(_file: File): Promise<string> {
    return 'https://example.com/mock-image.png';
  }
}
