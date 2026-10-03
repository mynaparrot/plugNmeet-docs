import React, { useEffect, useState, type ReactNode } from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import BlogSidebarDesktop from '@theme/BlogSidebar/Desktop';
import BlogSidebarMobile from '@theme/BlogSidebar/Mobile';

import type { Props } from '@theme/BlogLayout';

export default function BlogLayout(props: Props): ReactNode {
  const { sidebar, toc, children, ...layoutProps } = props;
  // Blog list pages have no TOC, blog post pages do: open recents by
  // default on the list, keep them closed on a post.
  const isListPage = !toc;
  const [sidebarOpen, setSidebarOpen] = useState(isListPage);
  useEffect(() => {
    setSidebarOpen(isListPage);
  }, [isListPage]);
  const hasSidebar = Boolean(sidebar && sidebar.items.length > 0);

  return (
    <Layout {...layoutProps}>
      {/* Mobile recent posts live in the navbar drawer (Docusaurus
          default), so the toggle only affects desktop and is hidden
          there via CSS. */}
      {hasSidebar && <BlogSidebarMobile sidebar={sidebar} />}
      <div className="container margin-vert--lg">
        {hasSidebar && (
          <button
            type="button"
            className="button button--secondary button--sm pnm-blog-sidebar-toggle"
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen((v) => !v)}
          >
            <span aria-hidden="true">{sidebarOpen ? '✕' : '☰'}</span>{' '}
            {sidebarOpen ? 'Hide recent posts' : 'Show recent posts'}
          </button>
        )}
        <div className="row pnm-blog-row">
          {hasSidebar && sidebarOpen && (
            <BlogSidebarDesktop sidebar={sidebar} />
          )}
          <main
            className={clsx('col', {
              // Sidebar open + TOC (post with recents): 3 + 7 + 2 = 12
              'col--7': sidebarOpen && Boolean(toc),
              // Sidebar open, no TOC (blog list): 3 + 9 = 12, no right gap
              'col--9': sidebarOpen && !toc,
              // No sidebar but TOC present (blog post): 10 + 2 = 12,
              // keeps TOC on the right instead of wrapping below
              'col--10': !sidebarOpen && Boolean(toc),
              // No sidebar, no TOC (blog list): full width
              'col--12': !sidebarOpen && !toc,
            })}
          >
            {children}
          </main>
          {toc && <div className="col col--2">{toc}</div>}
        </div>
      </div>
    </Layout>
  );
}
