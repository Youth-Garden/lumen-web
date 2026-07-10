import { Button, Input, Label } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { VocabExampleItem } from './vocab-example-item';

export interface VocabDefinitionData {
  id: string;
  partOfSpeech: string;
  definitionEn: string;
  translationVi: string;
  examples: {
    id: string;
    sentenceEn: string;
    translationVi: string;
  }[];
}

interface VocabDefinitionItemProps {
  definition: VocabDefinitionData;
  index: number;
  showRemove: boolean;
  onChange: (field: keyof VocabDefinitionData, value: string) => void;
  onRemove: () => void;
  onAddExample: () => void;
  onRemoveExample: (exIndex: number) => void;
  onChangeExample: (
    exIndex: number,
    field: 'sentenceEn' | 'translationVi',
    value: string,
  ) => void;
}

export function VocabDefinitionItem({
  definition,
  index,
  showRemove,
  onChange,
  onRemove,
  onAddExample,
  onRemoveExample,
  onChangeExample,
}: VocabDefinitionItemProps) {
  return (
    <div className="group/def relative p-5 border border-slate-200/60 rounded-xl bg-white/50 backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-md dark:bg-slate-900/50 dark:border-slate-800/60">
      <div className="flex justify-between items-center mb-5">
        <h4 className="font-semibold text-sm flex items-center gap-2 text-slate-800 dark:text-slate-200">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold dark:bg-blue-900/30 dark:text-blue-400">
            {index + 1}
          </span>
          Definition Details
        </h4>
        {showRemove && (
          <Button
            size="sm"
            variant="ghost"
            className="text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
            onClick={onRemove}
          >
            <Icons name="trash-2" className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="space-y-2">
          <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Part of Speech
          </Label>
          <Input
            value={definition.partOfSpeech}
            onChange={(e) => onChange('partOfSpeech', e.target.value)}
            placeholder="e.g. noun, verb"
            className="transition-all duration-200 focus-visible:ring-blue-500/50 hover:border-blue-400/50"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            English Definition
          </Label>
          <Input
            value={definition.definitionEn}
            onChange={(e) => onChange('definitionEn', e.target.value)}
            placeholder="e.g. a round fruit"
            className="transition-all duration-200 focus-visible:ring-blue-500/50 hover:border-blue-400/50"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Vietnamese Translation
          </Label>
          <Input
            value={definition.translationVi}
            onChange={(e) => onChange('translationVi', e.target.value)}
            placeholder="e.g. quả táo"
            className="transition-all duration-200 focus-visible:ring-blue-500/50 hover:border-blue-400/50"
          />
        </div>
      </div>

      {/* Examples Section */}
      <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Examples ({definition.examples.length})
          </Label>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors"
            onClick={onAddExample}
          >
            <Icons name="plus" className="h-4 w-4 mr-1" /> Add Example
          </Button>
        </div>

        <div className="space-y-1">
          {definition.examples.map((ex, exIndex) => (
            <VocabExampleItem
              key={ex.id}
              sentenceEn={ex.sentenceEn}
              translationVi={ex.translationVi}
              onChangeEn={(value) =>
                onChangeExample(exIndex, 'sentenceEn', value)
              }
              onChangeVi={(value) =>
                onChangeExample(exIndex, 'translationVi', value)
              }
              onRemove={() => onRemoveExample(exIndex)}
            />
          ))}
          {definition.examples.length === 0 && (
            <div className="text-center py-4 text-sm text-slate-500 italic bg-slate-50 rounded-lg dark:bg-slate-900/30">
              No examples added yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
