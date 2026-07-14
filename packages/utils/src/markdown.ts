/**
 * Simple helper to parse basic markdown format into HTML safely.
 * Features:
 * - HTML escaping to prevent XSS
 * - Bold text: **text**
 * - Italic text: *text*
 * - Links: [text](url)
 * - Lists: - text
 */
export const renderMarkdownToHtml = (markdown: string): string => {
  if (!markdown) return '';
  let html = markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold **text**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Italic *text*
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Links [text](url)
  html = html.replace(
    /\[(.*?)\]\((.*?)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">$1</a>',
  );

  // Lists - item
  const lines = html.split('\n');
  let inList = false;
  const processedLines = lines.map((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ')) {
      const content = trimmed.substring(2);
      if (!inList) {
        inList = true;
        return `<ul class="list-disc pl-5 space-y-1 my-2"><li>${content}</li>`;
      }
      return `<li>${content}</li>`;
    } else {
      if (inList) {
        inList = false;
        return `</ul>${line}`;
      }
      return line;
    }
  });

  if (inList) {
    processedLines.push('</ul>');
  }

  return processedLines.join('<br />');
};
