/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BlogService } from '../BlogService'

global.fetch = vi.fn()

describe('BlogService', () => {
  let service: BlogService

  beforeEach(() => {
    service = new BlogService()
    vi.clearAllMocks()
  })

  it('fetches posts successfully', async () => {
    const mockPosts = [{ id: '1' }]
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockPosts)
    })

    const posts = await service.getPosts()
    expect(global.fetch).toHaveBeenCalledWith('/api/posts')
    expect(posts).toEqual(mockPosts)
  })

  it('throws error when getPosts fails', async () => {
    ;(global.fetch as any).mockResolvedValue({ ok: false })
    await expect(service.getPosts()).rejects.toThrow('Failed to fetch posts')
  })

  it('fetches single post', async () => {
    const mockPost = { id: '1', title: 'Test' }
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockPost)
    })

    const post = await service.getPost('1')
    expect(global.fetch).toHaveBeenCalledWith('/api/posts?id=1')
    expect(post).toEqual(mockPost)
  })

  it('fetches post by slug', async () => {
    const mockPosts = [
        { id: '1', slug: 'test-slug' },
        { id: '2', slug: 'other' }
    ]
    const mockPost = { id: '1', slug: 'test-slug', content: '...' }

    // First fetch mocks getPosts
    ;(global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPosts)
      })
      // Second fetch mocks getPost
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPost)
      })

    const result = await service.getPostBySlug('test-slug')
    expect(result).toEqual(mockPost)
  })

  it('returns null if slug not found', async () => {
     ;(global.fetch as any).mockResolvedValue({
       ok: true,
       json: () => Promise.resolve([])
     })

     const result = await service.getPostBySlug('unknown')
     expect(result).toBeNull()
  })

  it('saves post', async () => {
    const postData = { title: 'New' }
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ...postData, id: '1' })
    })

    await service.savePost(postData)
    expect(global.fetch).toHaveBeenCalledWith('/api/posts', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(postData)
    }))
  })

  it('deletes post', async () => {
    ;(global.fetch as any).mockResolvedValue({ ok: true })
    await service.deletePost('1')
    expect(global.fetch).toHaveBeenCalledWith('/api/posts?id=1', expect.objectContaining({ method: 'DELETE' }))
  })

  it('uploads image', async () => {
    const file = new File([''], 'test.png', { type: 'image/png' })
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ url: 'http://example.com/img.png' })
    })

    const url = await service.uploadImage(file)
    expect(url).toBe('http://example.com/img.png')
    expect(global.fetch).toHaveBeenCalledWith('/api/upload', expect.objectContaining({ method: 'PUT' }))
  })
})
