import { DeckDetailPage } from '@/features/vocabulary/pages/deck-detail-page';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DeckDetailRoute({ params }: PageProps) {
  const { id } = await params;
  return <DeckDetailPage deckId={id} />;
}
