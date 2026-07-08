import { ToeicTestPlayer } from '@/features/toeic/components/toeic-test-player';

export const metadata = {
  title: 'Take TOEIC Test | Lumen',
};

interface PageProps {
  params: {
    id: string;
  };
}

export default function ToeicTestPage({ params }: PageProps) {
  return (
    <div className="container mx-auto min-h-[calc(100vh-4rem)] bg-slate-50/50 p-4 py-8 dark:bg-slate-950/50 md:p-8">
      <ToeicTestPlayer testId={params.id} />
    </div>
  );
}
