'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { cn } from '@lumen/uikit/utils';
import { useGetToeicNotes, useSaveToeicNote } from '../../hooks/use-toeic';

interface ToeicNotePanelProps {
  questionId: string;
  testId: string;
  onClose: () => void;
  initialQuote?: string;
}

export const ToeicNotePanel = ({
  questionId,
  testId,
  onClose,
  initialQuote,
}: ToeicNotePanelProps) => {
  const { data: notes = [], isLoading } = useGetToeicNotes(testId);
  const saveNoteMutation = useSaveToeicNote();

  // Find if there is an existing note for this question
  const currentNote = notes.find((note) => note.questionId === questionId);

  const [content, setContent] = useState('');
  const [category, setCategory] = useState('REMINDER');
  const [tagsInput, setTagsInput] = useState('');
  const [quote, setQuote] = useState(initialQuote || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>(
    'idle',
  );

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state with existing note details
  useEffect(() => {
    if (currentNote) {
      setContent(currentNote.content || '');
      setCategory(currentNote.category || 'REMINDER');
      setTagsInput((currentNote.tags || []).join(' '));
      setQuote(currentNote.quote || initialQuote || '');
    } else {
      setContent('');
      setCategory('REMINDER');
      setTagsInput('');
      setQuote(initialQuote || '');
    }
    setSaveStatus('idle');
  }, [questionId, currentNote, initialQuote]);

  // Debounced auto-save logic
  const triggerAutoSave = (
    updatedContent: string,
    updatedCategory: string,
    updatedTagsInput: string,
    updatedQuote: string,
  ) => {
    setSaveStatus('saving');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      // Parse hashtags
      const parsedTags = updatedTagsInput
        .split(/\s+/)
        .map((t) => t.trim())
        .filter((t) => t.startsWith('#') && t.length > 1);

      saveNoteMutation.mutate(
        {
          questionId,
          testId,
          content: updatedContent,
          category: updatedCategory,
          tags: parsedTags,
          quote: updatedQuote,
        },
        {
          onSuccess: () => {
            setSaveStatus('saved');
          },
          onError: () => {
            setSaveStatus('idle');
          },
        },
      );
    }, 1000);
  };

  const handleContentChange = (val: string) => {
    setContent(val);
    triggerAutoSave(val, category, tagsInput, quote);
  };

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    triggerAutoSave(content, val, tagsInput, quote);
  };

  const handleTagsChange = (val: string) => {
    setTagsInput(val);
    triggerAutoSave(content, category, val, quote);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex h-full w-[350px] flex-col border-l bg-card shadow-lg dark:border-slate-800 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3 dark:border-slate-800">
        <div className="flex items-center gap-2 font-semibold">
          <Icons name="book-open" className="h-5 w-5 text-indigo-500" />
          <span>Question Notes</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <Icons name="close" className="h-4 w-4" />
        </Button>
      </div>

      {/* Main Body */}
      <div className="flex flex-1 flex-col p-4 overflow-y-auto space-y-4">
        {/* Category Picker */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-800"
          >
            <option value="GRAMMAR">Grammar</option>
            <option value="VOCABULARY">Vocabulary</option>
            <option value="STRATEGY">Test Strategy</option>
            <option value="REMINDER">Personal Reminder</option>
          </select>
        </div>

        {/* Quote Block */}
        {quote && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Quoted Text
            </label>
            <div className="rounded-lg border-l-4 border-indigo-500 bg-indigo-500/10 px-3 py-2 text-sm italic text-foreground dark:border-indigo-400">
              {quote}
            </div>
          </div>
        )}

        {/* Note Textarea */}
        <div className="flex-1 flex flex-col space-y-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Notes
          </label>
          <textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Type your notes here... (auto-saved)"
            className="w-full flex-1 min-h-[150px] resize-none rounded-xl border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-800 leading-relaxed"
          />
        </div>

        {/* Tags / Hashtags */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Tags (space separated)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => handleTagsChange(e.target.value)}
            placeholder="e.g. #grammar #Part5"
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-800"
          />
        </div>

        {/* Saving Indicator */}
        <div className="flex items-center justify-end text-xs text-muted-foreground">
          {saveStatus === 'saving' && (
            <span className="flex items-center gap-1.5 text-indigo-500">
              <Icons name="loader-2" className="h-3 w-3 animate-spin" />
              Saving...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="flex items-center gap-1 text-green-500 font-medium">
              <Icons name="check" className="h-3.5 w-3.5" />
              Saved
            </span>
          )}
          {saveStatus === 'idle' && <span>All changes saved</span>}
        </div>

        {/* Notes list in this test */}
        {notes.length > 1 && (
          <div className="pt-4 border-t dark:border-slate-800">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Other Notes in this Test
            </h4>
            <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
              {notes
                .filter((note) => note.questionId !== questionId)
                .map((note) => (
                  <div
                    key={note.id}
                    className="p-2.5 rounded-lg border bg-slate-50/50 dark:bg-slate-900/50 dark:border-slate-800 text-xs space-y-1"
                  >
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span className="font-semibold text-[10px] text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-1.5 py-0.5 rounded dark:text-indigo-400">
                        {note.category}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-foreground/80 leading-normal">
                      {note.content}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
