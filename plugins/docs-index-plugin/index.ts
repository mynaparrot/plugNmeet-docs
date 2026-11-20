import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type {LoadContext, Plugin} from '@docusaurus/types';

type Section = 'docs' | 'blog';

export type DocsIndexPage = {
  title: string;
  description: string;
  keywords: string[];
  sidebarLabel?: string;
  section: Section;
  locale: string;
  path: string;
  url: string;
  source: string;
  content: string;
};

type ContentSource = {
  dir: string;
  section: Section;
  locale: string;
};

const MD_EXT = /\.mdx?$/;

// Same date-in-filename rule as @docusaurus/plugin-content-blog
const BLOG_DATE_FILENAME = /^(?<folder>.*)(?<date>\d{4}[-/]\d{1,2}[-/]\d{1,2})[-/]?(?<text>.*?)(?:\/index)?$/;

function walk(dir: string, files: string[] = []): string[] {
  if (!fs.existsSync(dir)) {
    return files;
  }
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    if (entry.name.startsWith('.') || entry.name.startsWith('_')) {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (MD_EXT.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

function toPosix(value: string): string {
  return value.split(path.sep).join('/');
}

function normalizePath(value: string): string {
  return value.replace(/\/{2,}/g, '/').replace(/\/+$/, '') || '/';
}

// Docusaurus drops ordering prefixes from folder and file names: 02-guides/01-setup -> guides/setup
function stripNumericPrefixes(value: string): string {
  return value
    .split('/')
    .filter(Boolean)
    .map((segment) => segment.replace(/^\d+[-_]/, ''))
    .join('/');
}

function docsPath(relPath: string, slug?: string, frontmatterId?: string): string {
  const fileId = relPath.replace(MD_EXT, '');
  const dir = fileId.includes('/') ? fileId.slice(0, fileId.lastIndexOf('/')) : '';
  if (slug) {
    const clean = slug.replace(/^\/+|\/+$/g, '');
    if (slug.startsWith('/')) {
      return normalizePath(`/docs/${clean}`);
    }
    return normalizePath(`/docs/${stripNumericPrefixes(`${dir ? `${dir}/` : ''}${clean}`)}`);
  }
  const withoutIndex = fileId.replace(/\/index$/, '');
  const idDir = withoutIndex.includes('/') ? withoutIndex.slice(0, withoutIndex.lastIndexOf('/')) : '';
  const name = frontmatterId ?? (idDir ? withoutIndex.slice(idDir.length + 1) : withoutIndex);
  return normalizePath(`/docs/${stripNumericPrefixes(`${idDir ? `${idDir}/` : ''}${name}`)}`);
}

function blogPath(relPath: string, slug?: string): string {
  const rel = relPath.replace(MD_EXT, '');
  if (slug) {
    return normalizePath(`/blog/${slug.replace(/^\/+/, '')}`);
  }
  const match = rel.match(BLOG_DATE_FILENAME);
  if (match?.groups) {
    const {folder, date, text} = match.groups as {folder: string; date: string; text: string};
    return normalizePath(`/blog/${date.replace(/-/g, '/')}/${folder}${text}`);
  }
  return normalizePath(`/blog/${rel.replace(/\/index$/, '')}`);
}

function firstHeading(body: string): string | undefined {
  const match = body.match(/^#\s+(.+)$/m);
  return match?.[1].trim();
}

function firstParagraph(body: string, maxLength = 200): string {
  for (const block of body.split(/\n{2,}/)) {
    const text = block.trim();
    if (!text || /^(#|```|<|import\s|---|\||-|\*|\d+\.)/.test(text)) {
      continue;
    }
    const collapsed = text.replace(/\s+/g, ' ');
    return collapsed.length > maxLength ? `${collapsed.slice(0, maxLength).trimEnd()}…` : collapsed;
  }
  return '';
}

function normalizeKeywords(keywords: unknown): string[] {
  if (Array.isArray(keywords)) {
    return keywords.map(String).map((k) => k.trim()).filter(Boolean);
  }
  if (typeof keywords === 'string') {
    return keywords.split(',').map((k) => k.trim()).filter(Boolean);
  }
  return [];
}

function buildPage(file: string, source: ContentSource, siteDir: string, siteUrl: string): DocsIndexPage | null {
  const {data, content} = matter(fs.readFileSync(file, 'utf8'));
  if (data.draft === true) {
    return null;
  }

  const relPath = toPosix(path.relative(source.dir, file));
  const slug = typeof data.slug === 'string' ? data.slug : undefined;
  const routePath =
    source.section === 'docs'
      ? docsPath(relPath, slug, typeof data.id === 'string' ? data.id : undefined)
      : blogPath(relPath, slug);
  const pagePath = source.locale === 'en' ? routePath : `/${source.locale}${routePath}`;
  const fallbackTitle = path.basename(relPath).replace(MD_EXT, '');

  return {
    title: typeof data.title === 'string' && data.title.trim() ? data.title.trim() : firstHeading(content) ?? fallbackTitle,
    description:
      typeof data.description === 'string' && data.description.trim() ? data.description.trim() : firstParagraph(content),
    keywords: normalizeKeywords(data.keywords),
    sidebarLabel: typeof data.sidebar_label === 'string' ? data.sidebar_label : undefined,
    section: source.section,
    locale: source.locale,
    path: pagePath,
    url: `${siteUrl.replace(/\/$/, '')}${pagePath}`,
    source: toPosix(path.relative(siteDir, file)),
    content: content.trim(),
  };
}

function collectPages(siteDir: string, siteUrl: string): DocsIndexPage[] {
  const sources: ContentSource[] = [
    {dir: path.join(siteDir, 'docs'), section: 'docs', locale: 'en'},
    {dir: path.join(siteDir, 'blog'), section: 'blog', locale: 'en'},
    {dir: path.join(siteDir, 'i18n', 'es', 'docusaurus-plugin-content-docs', 'current'), section: 'docs', locale: 'es'},
    {dir: path.join(siteDir, 'i18n', 'es', 'docusaurus-plugin-content-blog'), section: 'blog', locale: 'es'},
  ];

  const pages: DocsIndexPage[] = [];
  for (const source of sources) {
    for (const file of walk(source.dir)) {
      const page = buildPage(file, source, siteDir, siteUrl);
      if (page) {
        pages.push(page);
      }
    }
  }
  return pages;
}

function readSitemapPaths(sitemapFile: string): Set<string> | null {
  if (!fs.existsSync(sitemapFile)) {
    return null;
  }
  const paths = new Set<string>();
  const xml = fs.readFileSync(sitemapFile, 'utf8');
  for (const match of xml.matchAll(/<loc>(.*?)<\/loc>/g)) {
    try {
      paths.add(normalizePath(new URL(match[1].trim()).pathname));
    } catch {
      // ignore malformed <loc> values
    }
  }
  return paths;
}

// The sitemap plugin writes its postBuild output concurrently with this plugin.
async function waitForSitemapPaths(sitemapFile: string, timeoutMs = 2000): Promise<Set<string> | null> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const paths = readSitemapPaths(sitemapFile);
    if (paths) {
      return paths;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  return null;
}

async function crossCheckPaths(pages: DocsIndexPage[], outDir: string, locale: string, routesPaths: string[]): Promise<void> {
  const sitemapFile = path.join(outDir, 'sitemap.xml');
  const sitemapPaths = await waitForSitemapPaths(sitemapFile);
  if (!sitemapPaths) {
    console.warn(`[docs-index-plugin] sitemap.xml missing for locale "${locale}", cross-checking against generated routes`);
  }
  const knownPaths = sitemapPaths ?? new Set(routesPaths.map((route) => normalizePath(route.replace(/[?#].*$/, ''))));

  const localePages = pages.filter((page) => page.locale === locale);
  for (const page of localePages) {
    if (!knownPaths.has(page.path)) {
      console.warn(`[docs-index-plugin] path not published: ${page.path} (${page.source})`);
    }
  }
}

export default function docsIndexPlugin(context: LoadContext): Plugin {
  // Locales build sequentially, so collect the sources once and reuse them.
  let collected: DocsIndexPage[] | null = null;

  return {
    name: 'docs-index-plugin',
    async postBuild({siteDir, outDir, siteConfig, routesPaths}) {
      const locale = context.i18n.currentLocale;
      collected ??= collectPages(siteDir, siteConfig.url);
      const pages = collected;

      await crossCheckPaths(pages, outDir, locale, routesPaths);

      // Locales are built sequentially; the default locale writes to the build root.
      if (locale !== context.i18n.defaultLocale) {
        return;
      }
      const indexPath = path.join(outDir, 'docs-index.json');
      fs.writeFileSync(
        indexPath,
        JSON.stringify({generatedAt: new Date().toISOString(), siteUrl: siteConfig.url, pages}),
      );
      console.log(`[docs-index-plugin] wrote ${pages.length} pages to ${path.basename(indexPath)}`);
    },
  };
}
