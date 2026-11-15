import type {DocsPage} from './docs-index';
import {searchDocs, type SearchHit} from './search';

const SOURCE_BASE_URL = 'https://github.com/mynaparrot/plugNmeet-docs/blob/main/';

export function normalizeRequestPath(input: string): string {
  let value = (input ?? '').trim();
  if (!value) {
    return '';
  }
  if (/^https?:\/\//i.test(value)) {
    try {
      value = new URL(value).pathname;
    } catch {
      // treat malformed URLs as plain paths
    }
  }
  value = value.split(/[?#]/)[0];
  value = value.replace(/\/{2,}/g, '/');
  if (!value.startsWith('/')) {
    value = `/${value}`;
  }
  value = value.replace(/\/+$/, '');
  return value || '/';
}

export function findPage(pages: DocsPage[], input: string): DocsPage | null {
  const target = normalizeRequestPath(input);
  if (!target) {
    return null;
  }
  const exact = pages.find((page) => page.path === target);
  if (exact) {
    return exact;
  }
  const lower = target.toLowerCase();
  return pages.find((page) => page.path.toLowerCase() === lower) ?? null;
}

export function suggestPages(pages: DocsPage[], input: string, limit = 5): SearchHit[] {
  const target = normalizeRequestPath(input);
  const words = target.replace(/[/_-]+/g, ' ').split(/\s+/).filter(Boolean);
  const query = words.join(' ');
  if (!query) {
    return [];
  }
  return searchDocs(pages, {query, limit});
}

export function formatPageContent(page: DocsPage): string {
  return [
    `${page.title}`,
    `URL: ${page.url}`,
    `Source: ${SOURCE_BASE_URL}${page.source}`,
    `Section: ${page.section} · Locale: ${page.locale}`,
    '',
    page.content,
  ].join('\n');
}

export function formatNotFound(input: string, suggestions: SearchHit[]): string {
  const lines = [`No page found for "${input}".`];
  if (suggestions.length === 0) {
    lines.push('Call list_docs to browse the available pages.');
    return lines.join('\n');
  }
  lines.push('', 'Closest matches:');
  suggestions.forEach((hit, index) => {
    lines.push(`${index + 1}. ${hit.page.title} — ${hit.page.path}`);
  });
  return lines.join('\n');
}
