export async function onRequestGet(context) {
  const { env, request } = context;

  try {
    const url = new URL(request.url);
    // Get filename from query param: /api/images?file=filename.jpg
    const filename = url.searchParams.get('file');

    if (!filename) {
      return new Response('Missing file parameter', { status: 400 });
    }

    // Get from R2 bucket
    const object = await env.BLOG_BUCKET.get(filename);

    if (!object) {
      return new Response('File not found', { status: 404 });
    }

    // Return the file with proper content type
    const headers = new Headers();
    headers.set('Content-Type', object.httpMetadata?.contentType || 'application/octet-stream');
    headers.set('Cache-Control', 'public, max-age=31536000');

    return new Response(object.body, { headers });
  } catch (e) {
    return new Response(e.message, { status: 500 });
  }
}
