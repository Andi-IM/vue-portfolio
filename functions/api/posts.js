export async function onRequestGet(context) {
  const { env, request } = context
  const url = new URL(request.url)
  const id = url.searchParams.get('id')

  try {
    if (id) {
      // Get single post
      const post = await env.BLOG_KV.get(id, { type: 'json' })
      if (!post) {
        return new Response('Post not found', { status: 404 })
      }
      return new Response(JSON.stringify(post), {
        headers: { 'Content-Type': 'application/json' },
      })
    } else {
      // List all posts
      // Note: KV list is eventually consistent and might not be suitable for very large lists without pagination
      // For a simple personal blog, listing keys is fine.

      // Fetch details for each key (or we could store a separate index)
      // For performance in a real app, you'd want a separate "index" key containing the list of posts metadata.
      // Here we will just return the list of keys/metadata if available.
      // Better approach: Store a secondary index or just metadata in the value?
      // Let's iterate and fetch for now (okay for small blog).

      // Optimization: We will assume the frontend just needs the list first.
      // Let's actually store "posts_index" as a separate key for the list of posts
      const postsIndex = await env.BLOG_KV.get('posts_index', { type: 'json' })
      return new Response(JSON.stringify(postsIndex || []), {
        headers: { 'Content-Type': 'application/json' },
      })
    }
  } catch (e) {
    return new Response(e.message, { status: 500 })
  }
}

export async function onRequestPost(context) {
  const { env, request } = context

  // Basic Auth check (replace with real auth or assume Cloudflare Access handles it)
  // Since user said they implemented Cloudflare Access, we can assume the request is authenticated if it reaches here,
  // OR we can check for identity headers if we want to be strict.

  try {
    const data = await request.json()
    const id = data.id || Date.now().toString()
    const now = new Date().toISOString()

    const post = {
      id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.coverImage,
      createdAt: data.createdAt || now,
      updatedAt: now,
    }

    // Save full post
    await env.BLOG_KV.put(id, JSON.stringify(post))

    // Update index
    let index = (await env.BLOG_KV.get('posts_index', { type: 'json' })) || []
    // Remove existing entry if update
    index = index.filter((p) => p.id !== id)
    // Add new metadata (smaller payload for list view)
    index.unshift({
      id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    })

    await env.BLOG_KV.put('posts_index', JSON.stringify(index))

    return new Response(JSON.stringify(post), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(e.message, { status: 500 })
  }
}

export async function onRequestDelete(context) {
  const { env, request } = context
  const url = new URL(request.url)
  const id = url.searchParams.get('id')

  if (!id) return new Response('Missing ID', { status: 400 })

  try {
    await env.BLOG_KV.delete(id)

    // Update index
    let index = (await env.BLOG_KV.get('posts_index', { type: 'json' })) || []
    index = index.filter((p) => p.id !== id)
    await env.BLOG_KV.put('posts_index', JSON.stringify(index))

    return new Response('Deleted', { status: 200 })
  } catch (e) {
    return new Response(e.message, { status: 500 })
  }
}
