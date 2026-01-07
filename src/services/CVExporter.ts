/**
 * Downloads the CV as a PDF file by calling the backend API.
 */
export async function downloadCV(filename: string = 'cv-andi-irham.pdf'): Promise<void> {
  try {
    // Call our internal Cloudflare Function endpoint
    const response = await fetch('/api/cv');

    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Failed to download CV:', error);
    throw error;
  }
}

/**
 * Returns the exported URL (fallback or direct usage if needed)
 * Now points to internal API.
 */
export function getCVDownloadUrl(): string {
  return '/api/cv';
}
