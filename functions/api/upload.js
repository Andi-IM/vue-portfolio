export async function onRequestPut(context) {
  const { env, request } = context;

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return new Response('No file uploaded', { status: 400 });
    }

    const filename = `${Date.now()}-${file.name}`;

    // Upload to R2
    // env.BLOG_BUCKET must be bound in Cloudflare Dashboard
    await env.BLOG_BUCKET.put(filename, file.stream(), {
      httpMetadata: {
        contentType: file.type,
      },
    });

    // Construct public URL
    // Use R2 public domain for production, local API for development
    const origin = new URL(request.url).origin;
    const isLocalDev = origin.includes('localhost') || origin.includes('127.0.0.1');

    const publicUrl = isLocalDev
      ? `${origin}/api/images?file=${encodeURIComponent(filename)}`
      : `https://static.airham.my.id/${filename}`;

    return new Response(JSON.stringify({ url: publicUrl }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(e.message, { status: 500 });
  }
}
