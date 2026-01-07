import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCVDownloadUrl, downloadCV } from '../CVExporter';

// Mock window.URL and document methods
const mockCreateObjectURL = vi.fn();
const mockRevokeObjectURL = vi.fn();
const mockClick = vi.fn();

global.URL.createObjectURL = mockCreateObjectURL;
global.URL.revokeObjectURL = mockRevokeObjectURL;

describe('CVExporter', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        blob: () => Promise.resolve(new Blob(['test-pdf-content'], { type: 'application/pdf' })),
        statusText: 'OK',
      } as Response),
    );

    // Mock document.createElement
    vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') {
        return {
          href: '',
          download: '',
          click: mockClick,
        } as unknown as HTMLAnchorElement;
      }
      return document.createElement(tagName);
    });

    // Mock document.body.appendChild/removeChild
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => document.body);
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => document.body);
  });

  it('getCVDownloadUrl returns the internal API endpoint', () => {
    const url = getCVDownloadUrl();
    expect(url).toBe('/api/cv');
  });

  it('downloadCV fetches the internal API endpoint', async () => {
    await downloadCV();
    expect(global.fetch).toHaveBeenCalledWith('/api/cv');
  });

  it('downloadCV handles fetch failure', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        statusText: 'Internal Server Error',
      } as Response),
    );

    await expect(downloadCV()).rejects.toThrow('Download failed: Internal Server Error');
  });
});
