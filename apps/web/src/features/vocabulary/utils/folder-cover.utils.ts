import { getAvatarUrl } from '@lumen/utils';

const FOLDER_COVER_STYLES = ['glass', 'waves'] as const satisfies Parameters<
  typeof getAvatarUrl
>[0][];

export function getFolderCoverUrl(folderId: string): string {
  const charSum = folderId
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const style = FOLDER_COVER_STYLES[charSum % FOLDER_COVER_STYLES.length];
  return getAvatarUrl(style, folderId, {}, 'webp');
}
