import React, { type ReactNode } from 'react';
import OriginalBlogPostPage from '@theme-original/BlogPostPage';
import type { Props } from '@theme/BlogPostPage';

export default function BlogPostPage(props: Props): ReactNode {
  // Keep the collapsible Recent posts panel: BlogLayout renders it hidden
  // by default with a toggle, and the right-side TOC stays in place.
  return <OriginalBlogPostPage {...props} />;
}
