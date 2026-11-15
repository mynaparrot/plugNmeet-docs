import {describe, expect, it} from 'vitest';
import {pages} from './fixtures';
import {categoryOf, clampLimit, extractSnippet, formatPageList, formatSearchResults, scorePage, searchDocs, tokenize} from '../src/lib/search';

describe('tokenize', () => {
  it('lowercases and splits on non-alphanumerics', () => {
    expect(tokenize('Whiteboard, upload-API!')).toEqual(['whiteboard', 'upload', 'api']);
  });

  it('keeps accented letters and drops duplicates', () => {
    expect(tokenize('configuración configuración')).toEqual(['configuración']);
  });

  it('returns nothing for punctuation-only queries', () => {
    expect(tokenize(' -- ')).toEqual([]);
  });
});

describe('scorePage', () => {
  it('ranks title matches above keyword and body matches', () => {
    const [intro, upload, showcase] = pages;
    const terms = tokenize('whiteboard');
    const uploadScore = scorePage(upload, terms, 'whiteboard');
    const showcaseScore = scorePage(showcase, terms, 'whiteboard');
    const introScore = scorePage(intro, terms, 'whiteboard');

    expect(uploadScore).toBeGreaterThan(introScore);
    expect(showcaseScore).toBeGreaterThan(introScore);
    // exact phrase in title adds 25 on top of the term matches
    expect(showcaseScore).toBe(25 + 10 + 6 + 3 + 5);
  });

  it('caps body occurrences at 5', () => {
    expect(scorePage(pages[2], tokenize('whiteboard'), '')).toBeLessThanOrEqual(10 + 6 + 3 + 5);
  });
});

describe('searchDocs', () => {
  it('sorts results by descending score', () => {
    const hits = searchDocs(pages, {query: 'whiteboard'});
    expect(hits[0]?.page.title).toBe('Whiteboard whiteboard whiteboard showcase');
    const scores = hits.map((hit) => hit.score);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });

  it('applies the section filter', () => {
    const hits = searchDocs(pages, {query: 'whiteboard', section: 'docs'});
    expect(hits).toHaveLength(1);
    expect(hits[0]?.page.section).toBe('docs');
  });

  it('applies the locale filter', () => {
    const hits = searchDocs(pages, {query: 'plugNmeet', locale: 'es'});
    expect(hits).toHaveLength(1);
    expect(hits[0]?.page.path).toBe('/es/docs/intro');
  });

  it('clamps the limit to 1..20 with a default of 5', () => {
    expect(searchDocs(pages, {query: 'whiteboard', limit: 1})).toHaveLength(1);
    expect(clampLimit(undefined)).toBe(5);
    expect(clampLimit(0)).toBe(5);
    expect(clampLimit(3)).toBe(3);
    expect(clampLimit(99)).toBe(20);
  });

  it('returns no hits for unrelated queries', () => {
    expect(searchDocs(pages, {query: 'kubernetes'})).toEqual([]);
    expect(formatSearchResults('kubernetes', [])).toContain('No pages matched');
  });

  it('formats readable results with the follow-up hint', () => {
    const output = formatSearchResults('whiteboard', searchDocs(pages, {query: 'whiteboard', limit: 1}));
    expect(output).toContain('1. Whiteboard whiteboard whiteboard showcase');
    expect(output).toContain('https://www.plugnmeet.org/blog/whiteboard-showcase');
    expect(output).toContain('section: blog · locale: en');
    expect(output).toContain('get_docs_content');
  });
});

describe('extractSnippet', () => {
  it('centres the snippet around the first term match and collapses newlines', () => {
    const snippet = extractSnippet(`${'filler '.repeat(100)}\ninstallation guide`, tokenize('installation'));
    expect(snippet).toContain('installation');
    expect(snippet).not.toContain('\n');
    expect(snippet.startsWith('…')).toBe(true);
  });

  it('falls back to the start of the body when no term matches', () => {
    const snippet = extractSnippet('alpha beta gamma', tokenize('zeta'), 7);
    expect(snippet).toBe('alpha b…');
  });

  it('returns an empty string for empty content', () => {
    expect(extractSnippet('', tokenize('x'))).toBe('');
  });
});

describe('categoryOf', () => {
  it('uses the first path segment after the section, skipping the locale prefix', () => {
    expect(categoryOf(pages[1]!)).toBe('api');
    expect(categoryOf(pages[3]!)).toBe('general');
    expect(categoryOf({...pages[1]!, locale: 'es', path: '/es/docs/api/room/create'})).toBe('api');
  });
});

describe('formatPageList', () => {
  it('groups pages by category and reports a total count', () => {
    const output = formatPageList(pages);
    expect(output).toContain('5 pages (en: 4, es: 1)');
    expect(output).toContain('## api (1)');
    expect(output).toContain('API — Whiteboard upload API (/docs/api/room/upload-whiteboard-file)');
    expect(output).toContain('## general (4)');
  });

  it('truncates long descriptions', () => {
    const output = formatPageList([{...pages[0]!, description: 'x'.repeat(200)}]);
    expect(output).toContain('x'.repeat(120));
    expect(output).not.toContain('x'.repeat(121));
  });
});
