import { DeckDetailPage } from '@/features/vocabulary/pages/deck-detail-page';

export default function DeckDetailRoute({
  params,
}: {
  params: { id: string };
}) {
  return <DeckDetailPage deckId={params.id} />;
}
