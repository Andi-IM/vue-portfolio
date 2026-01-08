export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  try {
    if (id) {
      // Get single post views
      const result = await env.BLOG_DB.prepare('SELECT count FROM views WHERE post_id = ?')
        .bind(id)
        .first();

      return new Response(JSON.stringify({ views: result?.count || 0 }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // Get all views
      const { results } = await env.BLOG_DB.prepare('SELECT post_id, count FROM views').all();

      const viewsMap = {};
      for (const row of results || []) {
        viewsMap[row.post_id] = row.count;
      }

      return new Response(JSON.stringify(viewsMap), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (e) {
    console.error('GET /api/views error:', e);
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

    // Generate visitor hash for deduplication
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const userAgent = request.headers.get('User-Agent') || 'unknown';

    const msgBuffer = new TextEncoder().encode(ip + userAgent);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const visitorHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    // Check if visitor already seen (using D1)
    const seen = await env.BLOG_DB.prepare(
      'SELECT id FROM seen_visitors WHERE post_id = ? AND visitor_hash = ?',
    )
      .bind(id, visitorHash)
      .first();

    // Get current view count
    let viewResult = await env.BLOG_DB.prepare('SELECT count FROM views WHERE post_id = ?')
      .bind(id)
      .first();

    let currentViews = viewResult?.count || 0;

    if (!seen) {
      // Increment view count
      currentViews += 1;

      // Upsert view count
      await env.BLOG_DB.prepare(
        `
        INSERT INTO views (post_id, count) VALUES (?, ?)
        ON CONFLICT(post_id) DO UPDATE SET count = excluded.count
      `,
      )
        .bind(id, currentViews)
        .run();

      // Record visitor
      await env.BLOG_DB.prepare(
        `
        INSERT OR IGNORE INTO seen_visitors (post_id, visitor_hash, seen_at)
        VALUES (?, ?, ?)
      `,
      )
        .bind(id, visitorHash, new Date().toISOString())
        .run();
    }

    return new Response(JSON.stringify({ views: currentViews }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('POST /api/views error:', e);
    return new Response(e.message, { status: 500 });
  }
}
