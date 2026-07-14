import { useState, useEffect } from 'react';
import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useUpdateExplanation } from '../hooks/use-toeic';
import { toast } from 'sonner';

interface ToeicExplanationEditorProps {
  questionId: string;
  initialExplanation?: string;
  initialMediaUrls?: string[];
  onClose?: () => void;
  onSuccess?: () => void;
}

export const ToeicExplanationEditor = ({
  questionId,
  initialExplanation = '',
  initialMediaUrls = [],
  onClose,
  onSuccess,
}: ToeicExplanationEditorProps) => {
  const [explanation, setExplanation] = useState(initialExplanation);
  const [mediaUrls, setMediaUrls] = useState<string[]>(initialMediaUrls);
  const [newMediaUrl, setNewMediaUrl] = useState('');

  const TEMPLATES = [
    {
      name: 'Grammar Rule',
      content: `**Grammar Rule:** [Rule Name]\n\n- Definition: ...\n- Example: ...\n\n*Why it is correct:* ...\n*Why other options are wrong:* ...`,
    },
    {
      name: 'Vocabulary List',
      content: `**Key Vocabulary:**\n\n- **Word 1** (/pronunciation/): Definition. *Example sentence.*\n- **Word 2**: Definition.\n\n*Analysis of choices:* ...`,
    },
  ];

  const insertTextAtCursor = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById(
      'explanation-editor',
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = explanation.substring(start, end);
    const replacement = prefix + selectedText + suffix;

    const newText =
      explanation.substring(0, start) +
      replacement +
      explanation.substring(end);
    setExplanation(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const applyTemplate = (content: string) => {
    if (
      explanation.trim() !== '' &&
      !window.confirm(
        'This will append the template to your current explanation. Proceed?',
      )
    ) {
      return;
    }
    setExplanation((prev) => (prev ? prev + '\n\n' + content : content));
  };

  const updateExplanationMutation = useUpdateExplanation();

  useEffect(() => {
    setExplanation(initialExplanation);
    setMediaUrls(initialMediaUrls);
  }, [questionId, initialExplanation, initialMediaUrls]);

  const handleAddMediaUrl = () => {
    if (newMediaUrl.trim() && !mediaUrls.includes(newMediaUrl.trim())) {
      setMediaUrls((prev) => [...prev, newMediaUrl.trim()]);
      setNewMediaUrl('');
    }
  };

  const handleRemoveMediaUrl = (urlToRemove: string) => {
    setMediaUrls((prev) => prev.filter((url) => url !== urlToRemove));
  };

  const handleSave = () => {
    updateExplanationMutation.mutate(
      {
        questionId,
        explanation,
        mediaUrls,
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      },
    );
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl border dark:border-slate-800 shadow-xl overflow-hidden max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div>
          <h3 className="text-lg font-bold text-foreground">
            Edit Question Explanation
          </h3>
          <p className="text-xs text-muted-foreground">
            Modify markdown notes and explanation graphics for this question.
          </p>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9"
          >
            <Icons name="close" className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Grid container: Left editor, Right preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 flex-1 min-h-[400px] overflow-hidden">
        {/* Editor (Left Pane) */}
        <div className="p-6 border-r dark:border-slate-800 flex flex-col space-y-4 overflow-y-auto">
          {/* Explanation Area */}
          <div className="flex-1 flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Explanation Markdown
              </label>
              <div className="flex gap-2">
                <select
                  className="text-xs rounded border bg-background px-2 py-1 dark:border-slate-800 focus:outline-none"
                  onChange={(e) => {
                    if (e.target.value) {
                      applyTemplate(
                        TEMPLATES[parseInt(e.target.value)].content,
                      );
                      e.target.value = ''; // reset
                    }
                  }}
                >
                  <option value="">Insert Template...</option>
                  {TEMPLATES.map((t, idx) => (
                    <option key={idx} value={idx}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Markdown Toolbar */}
            <div className="flex items-center gap-1 border border-b-0 rounded-t-xl bg-slate-50 dark:bg-slate-900 px-2 py-1.5 dark:border-slate-800">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => insertTextAtCursor('**', '**')}
              >
                <span className="font-bold">B</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => insertTextAtCursor('*', '*')}
              >
                <span className="italic">I</span>
              </Button>
              <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => insertTextAtCursor('\n- ')}
              >
                <Icons name="list" className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => insertTextAtCursor('[', '](url)')}
              >
                <Icons name="link" className="h-3.5 w-3.5" />
              </Button>
            </div>

            <textarea
              id="explanation-editor"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Provide context and explain grammar rules... (Markdown supported: **bold**, *italic*, - list, [link](url))"
              className="w-full flex-1 min-h-[220px] rounded-b-xl border border-t-0 bg-background p-3 text-sm focus:outline-none dark:border-slate-800 leading-relaxed font-mono resize-none"
            />
          </div>

          {/* Media URL list */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Explanatory Graphics
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={newMediaUrl}
                onChange={(e) => setNewMediaUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-800"
              />
              <Button
                type="button"
                onClick={handleAddMediaUrl}
                className="shrink-0"
              >
                <Icons name="plus" className="h-4 w-4 mr-1.5" />
                Add Image
              </Button>
            </div>

            {mediaUrls.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1.5">
                {mediaUrls.map((url, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300 border dark:border-slate-800 pl-2.5 pr-1.5 py-1 rounded-full max-w-full"
                  >
                    <span className="truncate max-w-[150px]">{url}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMediaUrl(url)}
                      className="text-muted-foreground hover:text-red-500 hover:bg-slate-200 dark:hover:bg-slate-800 p-0.5 rounded-full"
                    >
                      <Icons name="close" className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Live Preview (Right Pane) */}
        <div className="p-6 bg-slate-50/50 dark:bg-slate-900/10 flex flex-col space-y-4 overflow-y-auto">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Live Preview
          </label>
          <div className="flex-1 border rounded-xl bg-card p-5 overflow-y-auto shadow-sm dark:border-slate-800">
            {explanation.trim() ? (
              <div
                className="prose dark:prose-invert max-w-none text-sm leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdownToHtml(explanation),
                }}
              />
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Type in the editor to see explanation preview here.
              </p>
            )}

            {mediaUrls.length > 0 && (
              <div className="mt-4 pt-4 border-t dark:border-slate-800">
                <span className="text-xs font-bold text-primary block mb-2">
                  Explanatory Graphics Preview:
                </span>
                <div className="flex flex-wrap gap-2">
                  {mediaUrls.map((url, i) => (
                    <div
                      key={i}
                      className="border rounded-lg overflow-hidden bg-background p-1 max-w-[120px]"
                    >
                      <img
                        src={url}
                        alt={`Graphic ${i + 1}`}
                        className="max-h-20 object-contain mx-auto"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t px-6 py-4 dark:border-slate-800 flex justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/50">
        {onClose && (
          <Button
            variant="outline"
            onClick={onClose}
            disabled={updateExplanationMutation.isPending}
          >
            Cancel
          </Button>
        )}
        <Button
          onClick={handleSave}
          disabled={updateExplanationMutation.isPending || !explanation.trim()}
          className="px-6 font-bold"
        >
          {updateExplanationMutation.isPending ? (
            <>
              <Icons name="loader-2" className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Explanation'
          )}
        </Button>
      </div>
    </div>
  );
};

// Markdown compiler helper function
const renderMarkdownToHtml = (markdown: string): string => {
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

  // Lists
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
