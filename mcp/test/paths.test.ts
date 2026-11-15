import {describe, expect, it} from 'vitest';
import {pages} from './fixtures';
import {findPage, formatNotFound, formatPageContent, normalizeRequestPath, suggestPages} from '../src/lib/paths';

describe('normalizeRequestPath', () => {
  it('accepts site-relative paths with or without a leading slash', () => {
    expect(normalizeRequestPath('/docs/intro')).toBe('/docs/intro');
    expect(normalizeRequestPath('docs/intro')).toBe('/docs/intro');
  });

  it('accepts full URLs, ignoring the origin, query and hash', () => {
    expect(normalizeRequestPath('https://www.plugnmeet.org/docs/api/room/create?x=1#top')).toBe('/docs/api/room/create');
  });

  it('strips trailing slashes and duplicate slashes', () => {
    expect(normalizeRequestPath('/docs//intro/')).toBe('/docs/intro');
  });

  it('keeps accented characters intact', () => {
    expect(normalizeRequestPath('es/docs/introducción')).toBe('/es/docs/introducción');
  });
});

describe('findPage', () => {
  it('finds pages by exact path and by full URL', () => {
    expect(findPage(pages, '/docs/intro')?.title).toBe('Introduction');
    expect(findPage(pages, 'https://www.plugnmeet.org/es/docs/intro')?.locale).toBe('es');
  });

  it('falls back to a case-insensitive match', () => {
    expect(findPage(pages, '/docs/API/Room/Upload-Whiteboard-File')?.title).toBe('Whiteboard upload API');
  });

  it('returns null for unknown paths', () => {
    expect(findPage(pages, '/docs/nope')).toBeNull();
    expect(findPage(pages, '')).toBeNull();
  });
});

describe('suggestPages', () => {
  it('suggests close matches for a missed path', () => {
    const suggestions = suggestPages(pages, '/docs/whiteboard');
    const paths = suggestions.map((hit) => hit.page.path);
    expect(paths).toContain('/docs/api/room/upload-whiteboard-file');
    expect(paths).not.toContain('/docs/firewall');
  });

  it('reports a miss with suggestions', () => {
    const output = formatNotFound('/docs/whiteboard', suggestPages(pages, '/docs/whiteboard', 2));
    expect(output).toContain('No page found for "/docs/whiteboard"');
    expect(output).toContain('Closest matches:');
    expect(output.split('\n').filter((line) => line.includes(' — ')).length).toBe(2);
  });
});

describe('formatPageContent', () => {
  it('returns title, url, source link and markdown body', () => {
    const output = formatPageContent(pages[0]!);
    expect(output).toContain('Introduction');
    expect(output).toContain('URL: https://www.plugnmeet.org/docs/intro');
    expect(output).toContain('https://github.com/mynaparrot/plugNmeet-docs/blob/main/docs/intro.md');
    expect(output).toContain('self-hosted WebRTC conferencing platform');
  });
});
