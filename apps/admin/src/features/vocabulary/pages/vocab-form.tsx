import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@lumen/uikit/components';
import { Save, ArrowLeft, Plus, Loader2 } from 'lucide-react';
import { useVocabularyWordDetail, useCreateVocabularyWord, useUpdateVocabularyWord } from '../hooks';
import { RouteEnum } from '@/shared/constants';
import { VocabBasicInfo } from '../components/vocab-basic-info';
import { VocabDefinitionItem, VocabDefinitionData } from '../components/vocab-definition-item';

export default function VocabForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const { data: wordResponse, isLoading } = useVocabularyWordDetail(id!, {
    enabled: isEditing,
  });
  const wordData = wordResponse?.data;

  const createMutation = useCreateVocabularyWord();
  const updateMutation = useUpdateVocabularyWord();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const [term, setTerm] = useState('');
  const [phonetic, setPhonetic] = useState('');
  const [cefrLevel, setCefrLevel] = useState('A1');

  const [definitions, setDefinitions] = useState<VocabDefinitionData[]>([
    {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      partOfSpeech: 'noun',
      definitionEn: '',
      translationVi: '',
      examples: [{ id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString() + '-ex', sentenceEn: '', translationVi: '' }],
    },
  ]);

  useEffect(() => {
    if (isEditing && wordData) {
      setTerm(wordData.term);
      setPhonetic(wordData.phonetic);
      setCefrLevel(wordData.cefrLevel);
      if (wordData.definitions && wordData.definitions.length > 0) {
        setDefinitions(
          wordData.definitions.map((def) => ({
            id: def.id,
            partOfSpeech: def.partOfSpeech,
            definitionEn: def.definitionEn,
            translationVi: def.translationVi,
            examples: def.examples.map((ex) => ({
              id: ex.id,
              sentenceEn: ex.sentenceEn,
              translationVi: ex.translationVi,
            })),
          })),
        );
      }
    }
  }, [isEditing, wordData]);

  const addDefinition = () => {
    setDefinitions([
      ...definitions,
      {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        partOfSpeech: 'noun',
        definitionEn: '',
        translationVi: '',
        examples: [{ id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString() + '-ex', sentenceEn: '', translationVi: '' }],
      },
    ]);
  };

  const removeDefinition = (defIndex: number) => {
    setDefinitions(definitions.filter((_, i) => i !== defIndex));
  };

  const updateDefinition = (defIndex: number, field: keyof VocabDefinitionData, value: string) => {
    const newDefs = [...definitions];
    (newDefs[defIndex][field] as string) = value;
    setDefinitions(newDefs);
  };

  const addExample = (defIndex: number) => {
    const newDefs = [...definitions];
    newDefs[defIndex].examples.push({
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      sentenceEn: '',
      translationVi: '',
    });
    setDefinitions(newDefs);
  };

  const removeExample = (defIndex: number, exIndex: number) => {
    const newDefs = [...definitions];
    newDefs[defIndex].examples = newDefs[defIndex].examples.filter((_, i) => i !== exIndex);
    setDefinitions(newDefs);
  };

  const updateExample = (defIndex: number, exIndex: number, field: 'sentenceEn' | 'translationVi', value: string) => {
    const newDefs = [...definitions];
    newDefs[defIndex].examples[exIndex][field] = value;
    setDefinitions(newDefs);
  };

  const handleSave = () => {
    const payload = {
      term,
      phonetic,
      cefrLevel,
      definitions: definitions.map((def) => ({
        partOfSpeech: def.partOfSpeech,
        definitionEn: def.definitionEn,
        translationVi: def.translationVi,
        examples: def.examples.map((ex) => ({
          sentenceEn: ex.sentenceEn,
          translationVi: ex.translationVi,
        })),
      })),
    };

    if (isEditing && id) {
      updateMutation.mutate(
        { id, payload },
        {
          onSuccess: () => navigate(RouteEnum.VOCABULARY),
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => navigate(RouteEnum.VOCABULARY),
      });
    }
  };

  if (isEditing && isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white/40 dark:bg-slate-900/40 p-4 rounded-2xl backdrop-blur-lg border border-slate-200/50 dark:border-slate-800/50 shadow-sm sticky top-4 z-10">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(RouteEnum.VOCABULARY)}
            className="p-2 h-10 w-10 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-400">
            {isEditing ? 'Edit Vocabulary Word' : 'Create New Word'}
          </h2>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isPending}
          className="rounded-full px-6 shadow-md hover:shadow-lg transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isEditing ? 'Save Changes' : 'Create Word'}
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        <div className="lg:col-span-4 sticky top-28">
          <VocabBasicInfo
            term={term}
            setTerm={setTerm}
            phonetic={phonetic}
            setPhonetic={setPhonetic}
            cefrLevel={cefrLevel}
            setCefrLevel={setCefrLevel}
          />
        </div>

        <div className="lg:col-span-8 space-y-6">
          <Card className="shadow-sm border-slate-200/60 bg-white/30 backdrop-blur-xl dark:bg-slate-900/30 dark:border-slate-800/60 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pb-4">
              <CardTitle className="text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                Definitions & Examples
              </CardTitle>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={addDefinition}
                className="rounded-full shadow-sm hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all dark:hover:bg-blue-900/30 dark:hover:border-blue-800 dark:hover:text-blue-400"
              >
                <Plus className="h-4 w-4 mr-1.5" /> Add Definition
              </Button>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {definitions.map((def, defIndex) => (
                <VocabDefinitionItem
                  key={def.id}
                  definition={def}
                  index={defIndex}
                  showRemove={definitions.length > 1}
                  onChange={(field, value) => updateDefinition(defIndex, field, value)}
                  onRemove={() => removeDefinition(defIndex)}
                  onAddExample={() => addExample(defIndex)}
                  onRemoveExample={(exIndex) => removeExample(defIndex, exIndex)}
                  onChangeExample={(exIndex, field, value) => updateExample(defIndex, exIndex, field, value)}
                />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
