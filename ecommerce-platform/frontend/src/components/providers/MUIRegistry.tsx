'use client';

import * as React from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

export default function MUIRegistry({ children }: { children: React.ReactNode }) {
  const [cache] = React.useState(() => {
    const c = createCache({ key: 'css', prepend: true });
    c.compat = true;
    return c;
  });
  useServerInsertedHTML(() => {
    return (
      <style
        data-emotion={` `}
        dangerouslySetInnerHTML={{ __html: Object.values(cache.inserted).join(' ') }}
      />
    );
  });
  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
