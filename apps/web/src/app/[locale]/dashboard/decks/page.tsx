import { DeckList } from '@/features/vocabulary/pages/deck-list';

export default function DecksPage() {
  return (
    <div className="p-6 h-[calc(100vh-4rem)] overflow-y-auto">
      <DeckList />
    </div>
  );
}
