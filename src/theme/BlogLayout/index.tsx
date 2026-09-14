import React, { useState, type ReactNode } from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import BlogSidebar from '@theme/BlogSidebar';

import type { Props } from '@theme/BlogLayout';

export default function BlogLayout(props: Props): ReactNode {
  const { sidebar, toc, children, ...layoutProps } = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const hasSidebar = Boolean(sidebar && sidebar.items.length > 0);

  return (
    <Layout {...layoutProps}>
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
        <div className="row">
          {hasSidebar && sidebarOpen && <BlogSidebar sidebar={sidebar} />}
          <main
            className={clsx('col', {
              // Sidebar open + TOC: 3 + 7 + 2 = 12 (original layout)
              'col--7': sidebarOpen,
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
