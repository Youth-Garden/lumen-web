import { Button, Input } from '@lumen/uikit/components';
import { Trash2 } from 'lucide-react';

interface VocabExampleItemProps {
  sentenceEn: string;
  translationVi: string;
  onChangeEn: (value: string) => void;
  onChangeVi: (value: string) => void;
  onRemove: () => void;
}

export function VocabExampleItem({
  sentenceEn,
  translationVi,
  onChangeEn,
  onChangeVi,
  onRemove,
}: VocabExampleItemProps) {
  return (
    <div className="group flex items-center gap-3 relative rounded-lg p-2 transition-all duration-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50">
      {/* Decorative vertical line */}
      <div className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-slate-200 dark:bg-slate-700 group-hover:bg-blue-400 transition-colors duration-300" />
      
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 pl-3">
        <Input
          placeholder="English sentence"
          value={sentenceEn}
          onChange={(e) => onChangeEn(e.target.value)}
          className="bg-transparent border-slate-200 shadow-none transition-all duration-200 focus-visible:ring-1 focus-visible:ring-blue-500 hover:border-blue-300 dark:border-slate-800"
        />
        <Input
          placeholder="Vietnamese translation"
          value={translationVi}
          onChange={(e) => onChangeVi(e.target.value)}
          className="bg-transparent border-slate-200 shadow-none transition-all duration-200 focus-visible:ring-1 focus-visible:ring-blue-500 hover:border-blue-300 dark:border-slate-800"
        />
      </div>
      
      <Button
        size="icon"
        variant="ghost"
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
