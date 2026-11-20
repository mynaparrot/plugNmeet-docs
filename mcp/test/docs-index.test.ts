import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {DocsIndexUnavailableError, loadDocsIndex, parseDocsIndex, resetDocsIndexCache} from '../src/lib/docs-index';

const URL_UNDER_TEST = 'https://www.plugnmeet.org/docs-index.json';

const payload = {
  generatedAt: '2026-01-01T00:00:00.000Z',
  siteUrl: 'https://www.plugnmeet.org',
  pages: [{path: '/docs/intro', title: 'Intro', content: '# Intro'}],
};

function jsonResponse(data: unknown): Response {
  return {ok: true, status: 200, json: async () => data} as unknown as Response;
}

beforeEach(() => {
  resetDocsIndexCache();
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('parseDocsIndex', () => {
  it('rejects payloads without a pages array', () => {
    expect(() => parseDocsIndex(null)).toThrow('no pages array');
    expect(() => parseDocsIndex({pages: 'nope'})).toThrow('no pages array');
  });

  it('fills missing fields and drops pages without a path', () => {
    const index = parseDocsIndex({
      pages: [{path: '/docs/intro'}, {title: 'no path'}, null],
      generatedAt: 42,
      siteUrl: 'https://www.plugnmeet.org',
    });

    expect(index.generatedAt).toBe('');
    expect(index.siteUrl).toBe('https://www.plugnmeet.org');
    expect(index.pages).toHaveLength(1);
    expect(index.pages[0]).toMatchObject({title: '/docs/intro', description: '', keywords: [], content: ''});
  });
});

describe('loadDocsIndex', () => {
  it('caches the index for the isolate and refetches after the TTL', async () => {
    const fetcher = vi.fn(async () => jsonResponse(payload));

    await loadDocsIndex(URL_UNDER_TEST, fetcher);
    await loadDocsIndex(URL_UNDER_TEST, fetcher);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith(URL_UNDER_TEST);

    vi.useFakeTimers();
    vi.setSystemTime(new Date(Date.now() + 2 * 60 * 60 * 1000));
    await loadDocsIndex(URL_UNDER_TEST, fetcher);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('shares one fetch between concurrent calls while the cache is cold', async () => {
    let release!: (value: Response) => void;
    const fetcher = vi.fn(
      () =>
        new Promise<Response>((resolve) => {
          release = resolve;
        }),
    );

    const first = loadDocsIndex(URL_UNDER_TEST, fetcher);
    const second = loadDocsIndex(URL_UNDER_TEST, fetcher);
    expect(fetcher).toHaveBeenCalledTimes(1);

    release(jsonResponse(payload));
    const [a, b] = await Promise.all([first, second]);
    expect(a).toBe(b);
    expect(a.pages).toHaveLength(1);
  });

  it('serves the stale index when a refresh fails', async () => {
    const fetcher = vi.fn(async () => jsonResponse(payload));
    const cached = await loadDocsIndex(URL_UNDER_TEST, fetcher);

    vi.useFakeTimers();
    vi.setSystemTime(new Date(Date.now() + 2 * 60 * 60 * 1000));
    fetcher.mockRejectedValueOnce(new Error('network down'));

    const refreshed = await loadDocsIndex(URL_UNDER_TEST, fetcher);
    expect(refreshed).toBe(cached);
    expect(console.warn).toHaveBeenCalled();
  });

  it('throws DocsIndexUnavailableError when nothing is cached', async () => {
    const fetcher = vi.fn(async () => ({ok: false, status: 503, json: async () => payload}) as unknown as Response);

    await expect(loadDocsIndex(URL_UNDER_TEST, fetcher)).rejects.toBeInstanceOf(DocsIndexUnavailableError);
    await expect(loadDocsIndex(URL_UNDER_TEST, fetcher)).rejects.toThrow('HTTP 503');
  });

  it('clears the shared promise after a failed load so the next call retries', async () => {
    const fetcher = vi.fn(async () => {
      throw new Error('offline');
    });

    await expect(loadDocsIndex(URL_UNDER_TEST, fetcher)).rejects.toBeInstanceOf(DocsIndexUnavailableError);
    await expect(loadDocsIndex(URL_UNDER_TEST, fetcher)).rejects.toBeInstanceOf(DocsIndexUnavailableError);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
});
