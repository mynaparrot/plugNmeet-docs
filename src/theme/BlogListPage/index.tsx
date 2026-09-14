import React, { type ReactNode } from 'react';
import OriginalBlogListPage from '@theme-original/BlogListPage';
import type { Props } from '@theme/BlogListPage';

export default function BlogListPage(props: Props): ReactNode {
  return <OriginalBlogListPage {...props} />;
}
