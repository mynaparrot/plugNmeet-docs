import {type CallToolResult, McpServer} from '@modelcontextprotocol/server';
import {createMcpHandler} from 'agents/mcp/server';
import {z} from 'zod';
import {DocsIndexUnavailableError, loadDocsIndex, type DocsPage} from './lib/docs-index';
import {findPage, formatNotFound, formatPageContent, suggestPages} from './lib/paths';
import {formatPageList, formatSearchResults, searchDocs} from './lib/search';

type ToolResult = CallToolResult;

const readOnlyAnnotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};

function text(value: string): ToolResult {
  return {content: [{type: 'text', text: value}]};
}

function errorResult(error: unknown): ToolResult {
  const message = error instanceof Error ? error.message : String(error);
  const hint =
    error instanceof DocsIndexUnavailableError
      ? '\n\nThe docs site does not publish docs-index.json yet, so no content is available.'
      : '\n\nThis usually means the docs index could not be loaded; try again later.';
  return {content: [{type: 'text', text: `${message}${hint}`}], isError: true};
}

export function createServer(env: Env): McpServer {
  const server = new McpServer({name: 'plugnmeet-docs-mcp', version: '1.0.0'});

  const withPages = async (format: (pages: DocsPage[]) => string): Promise<ToolResult> => {
    try {
      const index = await loadDocsIndex(env.DOCS_INDEX_URL);
      return text(format(index.pages));
    } catch (error) {
      return errorResult(error);
    }
  };

  server.registerTool(
    'search_docs',
    {
      title: 'Search plugNmeet docs',
      description:
        'Search the plugNmeet documentation and blog by keywords. Returns ranked pages with title, URL, section/locale, description and a short snippet. Start here, then read the matching page with get_docs_content.',
      inputSchema: {
        query: z.string().min(1).describe('Search keywords, e.g. "whiteboard upload api"'),
        limit: z.number().int().min(1).max(20).optional().describe('Maximum number of results (default 5, max 20)'),
        section: z.enum(['docs', 'blog']).optional().describe('Restrict results to documentation or blog posts'),
        locale: z.enum(['en', 'es']).optional().describe('Restrict results to the English or Spanish content'),
      },
      annotations: readOnlyAnnotations,
    },
    async ({query, limit, section, locale}) =>
      withPages((pages) => formatSearchResults(query, searchDocs(pages, {query, limit, section, locale}))),
  );

  server.registerTool(
    'list_docs',
    {
      title: 'List plugNmeet docs pages',
      description:
        'List available pages grouped by category, with their site paths. Use it to browse what exists before searching, or to see every page in a section or locale.',
      inputSchema: {
        section: z.enum(['docs', 'blog']).optional().describe('Restrict the listing to documentation or blog posts'),
        locale: z.enum(['en', 'es']).optional().describe('Restrict the listing to the English or Spanish content'),
      },
      annotations: readOnlyAnnotations,
    },
    async ({section, locale}) =>
      withPages((pages) =>
        formatPageList(pages.filter((page) => (!section || page.section === section) && (!locale || page.locale === locale))),
      ),
  );

  server.registerTool(
    'get_docs_content',
    {
      title: 'Read a plugNmeet docs page',
      description:
        'Return the full markdown content of one page, plus its URL and GitHub source link. Accepts a site-relative path (/docs/intro) or a full URL. If the path is unknown, returns the closest matches.',
      inputSchema: {
        path: z.string().min(1).describe('Page path such as /docs/intro, or a full https://www.plugnmeet.org/... URL'),
        locale: z.enum(['en', 'es']).optional().describe('Prefer a page in the given locale'),
      },
      annotations: readOnlyAnnotations,
    },
    async ({path, locale}) =>
      withPages((pages) => {
        const candidates = locale ? pages.filter((page) => page.locale === locale) : pages;
        const page = findPage(candidates, path) ?? findPage(pages, path);
        return page ? formatPageContent(page) : formatNotFound(path, suggestPages(candidates, path));
      }),
  );

  return server;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const {pathname} = new URL(request.url);

    if (pathname === '/mcp') {
      return createMcpHandler(() => createServer(env), {route: '/mcp'})(request, env, ctx);
    }
    if (pathname === '/' || pathname === '/health') {
      return Response.json({ok: true, service: 'plugnmeet-docs-mcp'});
    }
    return new Response('Not found. MCP endpoint: /mcp (Streamable HTTP)', {status: 404});
  },
};
