import { Card, CardContent, CardHeader, CardTitle, Input, Label } from '@lumen/uikit/components';

interface VocabBasicInfoProps {
  term: string;
  setTerm: (value: string) => void;
  phonetic: string;
  setPhonetic: (value: string) => void;
  cefrLevel: string;
  setCefrLevel: (value: string) => void;
}

export function VocabBasicInfo({
  term,
  setTerm,
  phonetic,
  setPhonetic,
  cefrLevel,
  setCefrLevel,
}: VocabBasicInfoProps) {
  return (
    <Card className="shadow-sm border-slate-200/60 bg-white/50 backdrop-blur-xl dark:bg-slate-900/50 dark:border-slate-800/60 transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
          Word Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="term" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Term
          </Label>
          <Input
            id="term"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="e.g. apple"
            className="transition-all duration-200 focus-visible:ring-blue-500/50 hover:border-blue-400/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phonetic" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Phonetic
          </Label>
          <Input
            id="phonetic"
            value={phonetic}
            onChange={(e) => setPhonetic(e.target.value)}
            placeholder="e.g. /ˈæp.əl/"
            className="transition-all duration-200 focus-visible:ring-blue-500/50 hover:border-blue-400/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cefrLevel" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            CEFR Level
          </Label>
          <select
            id="cefrLevel"
            value={cefrLevel}
            onChange={(e) => setCefrLevel(e.target.value)}
            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 transition-all duration-200 hover:border-blue-400/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
          >
            <option value="A1">A1 - Beginner</option>
            <option value="A2">A2 - Elementary</option>
            <option value="B1">B1 - Intermediate</option>
            <option value="B2">B2 - Upper Intermediate</option>
            <option value="C1">C1 - Advanced</option>
            <option value="C2">C2 - Proficient</option>
          </select>
        </div>
      </CardContent>
    </Card>
  );
}
