/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BlogService } from '../BlogService';

global.fetch = vi.fn();

describe('BlogService', () => {
  let service: BlogService;

  beforeEach(() => {
    service = new BlogService();
    vi.clearAllMocks();
  });

  it('fetches posts successfully', async () => {
    const mockPosts = [{ id: '1' }];
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockPosts),
    });

    const posts = await service.getPosts();
    expect(global.fetch).toHaveBeenCalledWith('/api/posts');
    expect(posts).toEqual(mockPosts);
  });

  it('throws error when getPosts fails', async () => {
    (global.fetch as any).mockResolvedValue({ ok: false });
    await expect(service.getPosts()).rejects.toThrow('Failed to fetch posts');
  });

  it('fetches single post', async () => {
    const mockPost = { id: '1', title: 'Test' };
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockPost),
    });

    const post = await service.getPost('1');
    expect(global.fetch).toHaveBeenCalledWith('/api/posts?id=1');
    expect(post).toEqual(mockPost);
  });

  it('fetches post by slug', async () => {
    const mockPosts = [
      { id: '1', slug: 'test-slug' },
      { id: '2', slug: 'other' },
    ];
    const mockPost = { id: '1', slug: 'test-slug', content: '...' };

    // First fetch mocks getPosts
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPosts),
      })
      // Second fetch mocks getPost
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPost),
      });

    const result = await service.getPostBySlug('test-slug');
    expect(result).toEqual(mockPost);
  });

  it('returns null if slug not found', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    const result = await service.getPostBySlug('unknown');
    expect(result).toBeNull();
  });

  it('saves post', async () => {
    const postData = { title: 'New' };
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ...postData, id: '1' }),
    });

    await service.savePost(postData);
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/posts',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(postData),
      }),
    );
  });

  it('deletes post', async () => {
    (global.fetch as any).mockResolvedValue({ ok: true });
    await service.deletePost('1');
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/posts?id=1',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('uploads image', async () => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ url: 'http://example.com/img.png' }),
    });

    const url = await service.uploadImage(file);
    expect(url).toBe('http://example.com/img.png');
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/upload',
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  describe('View Telemetry', () => {
    it('increments view count', async () => {
      (global.fetch as any).mockResolvedValue({ ok: true });
      await service.incrementView('1');
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/views',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ id: '1' }),
        }),
      );
    });

    it('handles increment view error silently', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      await service.incrementView('1');
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it('gets post views', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ views: 42 }),
      });

      const views = await service.getPostViews('1');
      expect(views).toBe(42);
      expect(global.fetch).toHaveBeenCalledWith('/api/views?id=1');
    });

    it('returns 0 if getPostViews fails', async () => {
      (global.fetch as any).mockResolvedValue({ ok: false });
      const views = await service.getPostViews('1');
      expect(views).toBe(0);
    });

    it('handles getPostViews network error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      const views = await service.getPostViews('1');
      expect(views).toBe(0);
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it('gets all views', async () => {
      const mockViews = { '1': 100, '2': 50 };
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockViews),
      });

      const result = await service.getAllViews();
      expect(result).toEqual(mockViews);
      expect(global.fetch).toHaveBeenCalledWith('/api/views');
    });

    it('returns empty object if getAllViews fails', async () => {
      (global.fetch as any).mockResolvedValue({ ok: false });
      const result = await service.getAllViews();
      expect(result).toEqual({});
    });

    it('handles getAllViews network error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      const result = await service.getAllViews();
      expect(result).toEqual({});
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });
});
