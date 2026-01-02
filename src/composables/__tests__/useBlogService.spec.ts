/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { inject } from 'vue';
import { useBlogService, BLOG_SERVICE_KEY } from '../useBlogService';

vi.mock('vue', () => ({
  inject: vi.fn(),
}));

describe('useBlogService', () => {
  it('returns service when provided', () => {
    const mockService = { getPosts: vi.fn() };
    (inject as any).mockReturnValue(mockService);

    const service = useBlogService();
    expect(service).toBe(mockService);
    expect(inject).toHaveBeenCalledWith(BLOG_SERVICE_KEY);
  });

  it('throws error when not provided', () => {
    (inject as any).mockReturnValue(undefined);

    expect(() => useBlogService()).toThrow('BlogService not provided');
  });
});
