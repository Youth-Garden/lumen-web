import { CollectionDetailPage } from '@/features/vocabulary/pages/collection-detail-page';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CollectionPage({ params }: PageProps) {
  const { id } = await params;
  return <CollectionDetailPage collectionId={id} />;
}
