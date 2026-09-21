import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useDocumentTitle } from '../use-document-title';

describe('useDocumentTitle', () => {
  beforeEach(() => {
    document.title = 'Original Title';
  });

  it('should set document title and restore on unmount when restoreOnUnmount is true', () => {
    const { rerender, unmount } = renderHook(
      ({ title }) => useDocumentTitle(title, { restoreOnUnmount: true }),
      { initialProps: { title: 'Study Session | Lumen' } },
    );

    expect(document.title).toBe('Study Session | Lumen');

    rerender({ title: 'Vocabulary List | Lumen' });
    expect(document.title).toBe('Vocabulary List | Lumen');

    unmount();
    expect(document.title).toBe('Original Title');
  });
});
