"use client";

import { useEffect, useState, useRef } from 'react';
import { useTranslateText } from '../hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '@lumen/uikit/icons';
import { Button } from '@lumen/uikit/components';

interface TranslationPopoverProps {
  text: string;
  position: { x: number; y: number } | null;
  onClose: () => void;
  onAddToFlashcard?: (word: string, translation: string) => void;
}

export const TranslationPopover = ({ text, position, onClose, onAddToFlashcard }: TranslationPopoverProps) => {
  const { data: translationResult, isLoading, isError } = useTranslateText(text);
  const [added, setAdded] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    // Slight delay so the selection click doesn't immediately close it
    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!position || !text) return null;

  const handleAdd = () => {
    if (translationResult?.translation) {
      onAddToFlashcard?.(text, translationResult.translation);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={popoverRef}
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 50,
          transform: 'translate(-50%, -100%)', // Center above the cursor
          marginTop: '-10px',
        }}
        className="w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90"
      >
        <div className="mb-3 border-b border-slate-100 pb-2 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            <Icons name="languages" className="h-4 w-4" /> Translation
          </div>
          <div className="mt-1 line-clamp-2 text-sm font-medium text-slate-800 dark:text-slate-200">
            &quot;{text}&quot;
          </div>
        </div>

        <div className="min-h-[60px]">
          {isLoading ? (
            <div className="flex h-full items-center justify-center space-x-2 text-slate-400">
              <Icons name="loader-2" className="h-5 w-5 animate-spin" />
              <span className="text-sm">Translating...</span>
            </div>
          ) : isError ? (
            <div className="text-sm text-red-500">Failed to load translation.</div>
          ) : (
            <div className="space-y-4">
              <p className="text-base text-slate-700 dark:text-slate-300">
                {translationResult?.translation || 'No translation available.'}
              </p>
              
              <Button 
                onClick={handleAdd}
                variant={added ? "secondary" : "default"}
                size="sm" 
                className={`w-full font-medium ${added ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400' : 'bg-teal-600 hover:bg-teal-700 text-white'}`}
              >
                {added ? (
                  <>
                    <Icons name="check" className="mr-2 h-4 w-4" /> Added to Decks
                  </>
                ) : (
                  <>
                    <Icons name="plus" className="mr-2 h-4 w-4" /> Add to Flashcards
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
        
        {/* Pointer Triangle */}
        <div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"></div>
      </motion.div>
    </AnimatePresence>
  );
};
