export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  try {
    if (id) {
      // Get single post views
      const views = (await env.BLOG_KV.get(`views:${id}`)) || 0;
      return new Response(JSON.stringify({ views: parseInt(views, 10) }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // List all views
      // We'll iterate through the posts index to get IDs, then fetch views for each.
      // This is N+1 but acceptable for a small blog.
      // Optimization: Store a separate "all_views" object or use "list" with prefix if we had many posts.

      const postsIndex = (await env.BLOG_KV.get('posts_index', { type: 'json' })) || [];
      const viewsMap = {};

      // Fetch in parallel
      await Promise.all(
        postsIndex.map(async (post) => {
          const count = (await env.BLOG_KV.get(`views:${post.id}`)) || 0;
          viewsMap[post.id] = parseInt(count, 10);
        }),
      );

      return new Response(JSON.stringify(viewsMap), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (e) {
    return new Response(e.message, { status: 500 });
  }
}

export async function onRequestPost(context) {
  const { env, request } = context;

  try {
    const data = await request.json();
    const id = data.id;

    if (!id) {
      return new Response('Missing ID', { status: 400 });
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const userAgent = request.headers.get('User-Agent') || 'unknown';

    // simple hash
    const msgBuffer = new TextEncoder().encode(ip + userAgent);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    const seenKey = `seen:${id}:${hashHex}`;
    const hasSeen = await env.BLOG_KV.get(seenKey);

    let currentViews = parseInt((await env.BLOG_KV.get(`views:${id}`)) || '0', 10);

    if (!hasSeen) {
      // Update view count
      currentViews += 1;
      await env.BLOG_KV.put(`views:${id}`, currentViews.toString());
      await env.BLOG_KV.put(seenKey, Date.now().toString()); // could set expiration ttl here if we want unique views per day
    }

    return new Response(JSON.stringify({ views: currentViews }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(e.message, { status: 500 });
  }
}
