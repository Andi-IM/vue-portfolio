import { getFromCache, setCache, invalidateCache, CACHE_KEYS } from '../lib/cache.js';

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  try {
    if (id) {
      // Get single post - check cache first
      const cached = await getFromCache(env, CACHE_KEYS.post(id));
      if (cached) {
        return new Response(JSON.stringify(cached), {
          headers: { 'Content-Type': 'application/json', 'X-Cache': 'HIT' },
        });
      }

      // Cache miss - query D1
      const result = await env.BLOG_DB.prepare(
        'SELECT id, title, slug, excerpt, content, cover_image as coverImage, created_at as createdAt, updated_at as updatedAt FROM posts WHERE id = ?',
      )
        .bind(id)
        .first();

      if (!result) {
        return new Response('Post not found', { status: 404 });
      }

      // Store in cache
      await setCache(env, CACHE_KEYS.post(id), result);

      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json', 'X-Cache': 'MISS' },
      });
    } else {
      // List all posts - check cache first
      const cached = await getFromCache(env, CACHE_KEYS.POSTS_INDEX);
      if (cached) {
        return new Response(JSON.stringify(cached), {
          headers: { 'Content-Type': 'application/json', 'X-Cache': 'HIT' },
        });
      }

      // Cache miss - query D1
      const { results } = await env.BLOG_DB.prepare(
        'SELECT id, title, slug, excerpt, cover_image as coverImage, created_at as createdAt, updated_at as updatedAt FROM posts ORDER BY created_at DESC',
      ).all();

      const postsIndex = results || [];

      // Store in cache
      await setCache(env, CACHE_KEYS.POSTS_INDEX, postsIndex);

      return new Response(JSON.stringify(postsIndex), {
        headers: { 'Content-Type': 'application/json', 'X-Cache': 'MISS' },
      });
    }
  } catch (e) {
    console.error('GET /api/posts error:', e);
    return new Response(e.message, { status: 500 });
  }
}

export async function onRequestPost(context) {
  const { env, request } = context;

  try {
    const data = await request.json();
    const id = data.id || Date.now().toString();
    const now = new Date().toISOString();

    const post = {
      id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || null,
      content: data.content || null,
      coverImage: data.coverImage || null,
      createdAt: data.createdAt || now,
      updatedAt: now,
    };

    // Upsert into D1
    await env.BLOG_DB.prepare(
      `
      INSERT INTO posts (id, title, slug, excerpt, content, cover_image, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        slug = excluded.slug,
        excerpt = excluded.excerpt,
        content = excluded.content,
        cover_image = excluded.cover_image,
        updated_at = excluded.updated_at
    `,
    )
      .bind(
        post.id,
        post.title,
        post.slug,
        post.excerpt,
        post.content,
        post.coverImage,
        post.createdAt,
        post.updatedAt,
      )
      .run();

    // Initialize views counter if new post
    await env.BLOG_DB.prepare(
      `
      INSERT OR IGNORE INTO views (post_id, count) VALUES (?, 0)
    `,
    )
      .bind(post.id)
      .run();

    // Invalidate cache
    await invalidateCache(env, [CACHE_KEYS.POSTS_INDEX, CACHE_KEYS.post(id)]);

    return new Response(JSON.stringify(post), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('POST /api/posts error:', e);
    return new Response(e.message, { status: 500 });
  }
}

export async function onRequestDelete(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) return new Response('Missing ID', { status: 400 });

  try {
    // Delete from D1 (cascade will handle views and seen_visitors)
    await env.BLOG_DB.prepare('DELETE FROM posts WHERE id = ?').bind(id).run();

    // Invalidate cache
    await invalidateCache(env, [CACHE_KEYS.POSTS_INDEX, CACHE_KEYS.post(id)]);

    return new Response('Deleted', { status: 200 });
  } catch (e) {
    console.error('DELETE /api/posts error:', e);
    return new Response(e.message, { status: 500 });
  }
}
