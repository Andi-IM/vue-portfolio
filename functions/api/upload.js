export async function onRequestPut(context) {
  const { env, request } = context

  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return new Response('No file uploaded', { status: 400 })
    }

    const filename = `${Date.now()}-${file.name}`

    // Upload to R2
    // env.BLOG_BUCKET must be bound in Cloudflare Dashboard
    await env.BLOG_BUCKET.put(filename, file.stream(), {
      httpMetadata: {
        contentType: file.type,
      },
    })

    // Construct public URL
    // You need to set up a public domain for your R2 bucket or use a worker to serve it.
    // For now, assuming direct public access or a custom domain mapped to the bucket.
    // Let's assume the user has a domain like 'custom-domain.com' or we return a relative path if wrapped.
    // Best practice: Use a worker or public bucket domain.
    // Placeholder: returning a hypothetical URL structure.
    // The User needs to Replace `https://pub-your-r2-domain.rn2.dev` with their actual public R2 bucket URL.

    const publicUrl = `https://pub-insert-your-r2-domain-here/${filename}`

    return new Response(JSON.stringify({ url: publicUrl }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(e.message, { status: 500 })
  }
}
