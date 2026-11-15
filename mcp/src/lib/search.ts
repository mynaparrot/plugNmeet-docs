import type {DocsLocale, DocsPage, DocsSection} from './docs-index';

export type SearchHit = {
  page: DocsPage;
  score: number;
  snippet: string;
};

export type SearchOptions = {
  query: string;
  limit?: number;
  section?: DocsSection;
  locale?: DocsLocale;
};

const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 20;
const SNIPPET_LENGTH = 300;

export function tokenize(query: string): string[] {
  const terms = query
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
  return [...new Set(terms)];
}

function countOccurrences(haystack: string, needle: string): number {
  let count = 0;
  let index = haystack.indexOf(needle);
  while (index !== -1) {
    count += 1;
    index = haystack.indexOf(needle, index + needle.length);
  }
  return count;
}

export function scorePage(page: DocsPage, terms: string[], phrase: string): number {
  const title = page.title.toLowerCase();
  const keywords = page.keywords.join(' ').toLowerCase();
  const description = page.description.toLowerCase();
  const content = page.content.toLowerCase();

  let score = phrase && title.includes(phrase) ? 25 : 0;
  for (const term of terms) {
    if (title.includes(term)) {
      score += 10;
    }
    if (keywords.includes(term)) {
      score += 6;
    }
    if (description.includes(term)) {
      score += 3;
    }
    score += Math.min(countOccurrences(content, term), 5);
  }
  return score;
}

export function extractSnippet(content: string, terms: string[], maxLength = SNIPPET_LENGTH): string {
  const flat = content.replace(/\s+/g, ' ').trim();
  if (!flat) {
    return '';
  }

  const lower = flat.toLowerCase();
  let matchIndex = -1;
  for (const term of terms) {
    const index = lower.indexOf(term);
    if (index !== -1 && (matchIndex === -1 || index < matchIndex)) {
      matchIndex = index;
    }
  }

  if (matchIndex === -1) {
    return flat.length > maxLength ? `${flat.slice(0, maxLength).trimEnd()}…` : flat;
  }

  const start = Math.max(0, matchIndex - 80);
  const end = Math.min(flat.length, start + maxLength);
  const prefix = start > 0 ? '…' : '';
  const suffix = end < flat.length ? '…' : '';
  return `${prefix}${flat.slice(start, end).trim()}${suffix}`;
}

export function clampLimit(limit?: number): number {
  if (!limit || Number.isNaN(limit)) {
    return DEFAULT_LIMIT;
  }
  return Math.min(Math.max(Math.trunc(limit), 1), MAX_LIMIT);
}

export function searchDocs(pages: DocsPage[], options: SearchOptions): SearchHit[] {
  const terms = tokenize(options.query);
  const phrase = options.query.toLowerCase().replace(/\s+/g, ' ').trim();
  if (terms.length === 0) {
    return [];
  }

  const hits: SearchHit[] = [];
  for (const page of pages) {
    if (options.section && page.section !== options.section) {
      continue;
    }
    if (options.locale && page.locale !== options.locale) {
      continue;
    }
    const score = scorePage(page, terms, phrase);
    if (score > 0) {
      hits.push({page, score, snippet: extractSnippet(page.content, terms)});
    }
  }

  hits.sort((a, b) => b.score - a.score || a.page.title.localeCompare(b.page.title));
  return hits.slice(0, clampLimit(options.limit));
}

export function formatSearchResults(query: string, hits: SearchHit[]): string {
  if (hits.length === 0) {
    return `No pages matched "${query}". Try broader keywords, or call list_docs to browse the available pages.`;
  }

  const blocks = hits.map((hit, index) => {
    const {page} = hit;
    return [
      `${index + 1}. ${page.title}`,
      `   ${page.url}`,
      `   section: ${page.section} · locale: ${page.locale}`,
      `   ${page.description || '(no description)'}`,
      `   snippet: ${hit.snippet || '(no body match)'}`,
    ].join('\n');
  });

  return [
    `${hits.length} result(s) for "${query}":`,
    '',
    blocks.join('\n\n'),
    '',
    'Use get_docs_content with a path (for example /docs/intro) to read a full page.',
  ].join('\n');
}

export function categoryOf(page: DocsPage): string {
  const withoutLocale = page.locale === 'en' ? page.path : page.path.replace(new RegExp(`^/${page.locale}`), '');
  const prefix = `/${page.section}/`;
  if (!withoutLocale.startsWith(prefix)) {
    return 'general';
  }
  const rest = withoutLocale.slice(prefix.length);
  const segment = rest.split('/')[0];
  return rest.includes('/') && segment ? segment : 'general';
}

export function formatPageList(pages: DocsPage[]): string {
  if (pages.length === 0) {
    return 'No pages found for the requested section/locale filters.';
  }

  const groups = new Map<string, DocsPage[]>();
  for (const page of pages) {
    const category = categoryOf(page);
    groups.set(category, [...(groups.get(category) ?? []), page]);
  }

  const sections = [...groups.keys()].sort().map((category) => {
    const lines = groups
      .get(category)!
      .slice()
      .sort((a, b) => a.title.localeCompare(b.title))
      .map((page) => {
        const description = page.description.length > 120 ? `${page.description.slice(0, 120).trimEnd()}…` : page.description;
        return `${category.toUpperCase()} — ${page.title} (${page.path})${description ? ` — ${description}` : ''}`;
      });
    return [`## ${category} (${lines.length})`, ...lines].join('\n');
  });

  const enCount = pages.filter((page) => page.locale === 'en').length;
  const esCount = pages.filter((page) => page.locale === 'es').length;
  return [`${pages.length} pages (en: ${enCount}, es: ${esCount})`, '', sections.join('\n\n')].join('\n');
}
