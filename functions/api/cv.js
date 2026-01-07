export async function onRequestGet(context) {
  const { env } = context;
  const FILE_ID = '1QbzsxhPtMktVzFAXZiwY4HlSKGJj__Djw431fUFSKO0';
  const API_KEY = env.VITE_GOOGLE_API_KEY || env.GOOGLE_DRIVE_API;

  if (!API_KEY) {
    return new Response('Missing API Key configuration', { status: 500 });
  }

  // 1. Fetch file metadata to get exportLinks
  const metadataUrl = `https://www.googleapis.com/drive/v3/files/${FILE_ID}?fields=exportLinks&key=${API_KEY}`;

  try {
    const metadataResponse = await fetch(metadataUrl);

    if (!metadataResponse.ok) {
      return new Response(`Google Drive API Error: ${metadataResponse.statusText}`, {
        status: metadataResponse.status,
      });
    }

    const metadata = await metadataResponse.json();

    // 2. Check for PDF export link
    const pdfUrl = metadata.exportLinks ? metadata.exportLinks['application/pdf'] : null;

    if (!pdfUrl) {
      return new Response('PDF export link not available for this file.', { status: 404 });
    }

    // 3. Redirect the user to the actual download URL
    return Response.redirect(pdfUrl, 302);
  } catch (error) {
    return new Response(`Server Error: ${error.message}`, { status: 500 });
  }
}
