import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useFavicon } from '../use-favicon';

describe('useFavicon', () => {
  beforeEach(() => {
    let link = document.querySelector(
      "link[rel*='icon']",
    ) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      link.href = 'https://lumen.local/favicon.ico';
      document.head.appendChild(link);
    } else {
      link.href = 'https://lumen.local/favicon.ico';
    }
  });

  it('should update favicon href and restore on unmount', () => {
    const { rerender, unmount } = renderHook(
      ({ href }) => useFavicon(href, { restoreOnUnmount: true }),
      { initialProps: { href: 'https://lumen.local/alert-favicon.ico' } },
    );

    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    expect(link.href).toBe('https://lumen.local/alert-favicon.ico');

    rerender({ href: 'https://lumen.local/wilted-favicon.ico' });
    expect(link.href).toBe('https://lumen.local/wilted-favicon.ico');

    unmount();
    expect(link.href).toBe('https://lumen.local/favicon.ico');
  });
});
