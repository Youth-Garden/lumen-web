import { VocabularyWord, Folder } from './vocabulary.types';

export const wordMapper = (raw?: any): VocabularyWord => {
  return {
    id: raw?.id || '',
    term: raw?.term || '',
    topic: raw?.topic || undefined,
    topicVi: raw?.topicVi || undefined,
    topicImageUrl: raw?.topicImageUrl || undefined,
    phonetic: raw?.phonetic || undefined,
    phoneticUs: raw?.phoneticUs || undefined,
    phoneticUk: raw?.phoneticUk || undefined,
    audioUrl: raw?.audioUrl || undefined,
    audioUsUrl: raw?.audioUsUrl || undefined,
    audioUkUrl: raw?.audioUkUrl || undefined,
    cefrLevel: raw?.cefrLevel || undefined,
    imageUrl: raw?.imageUrl || undefined,
    definitions: (raw?.definitions || []).map((definition: any) => ({
      id: definition?.id || '',
      partOfSpeech: definition?.partOfSpeech || '',
      definitionEn: definition?.definitionEn || '',
      translationVi: definition?.translationVi || '',
      examples: (definition?.examples || []).map((example: any) => ({
        id: example?.id || '',
        sentenceEn: example?.sentenceEn || '',
        translationVi: example?.translationVi || '',
      })),
    })),
  };
};

export const folderMapper = (folder?: any): Folder => ({
  id: folder?.id || '',
  name: folder?.name || '',
  description: folder?.description || undefined,
  category: folder?.category || undefined,
  flashcardCount: folder?.flashcardCount ?? 0,
  flashcards: Array.isArray(folder?.flashcards)
    ? folder.flashcards.map((flashcard: any) => wordMapper(flashcard))
    : undefined,
});

export const folderListMapper = (raw?: any): Folder[] => {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => folderMapper(item));
};
