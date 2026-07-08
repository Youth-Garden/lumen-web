import { ToeicTestList } from '@/features/toeic/components/toeic-test-list';

export const metadata = {
  title: 'TOEIC Tests | Lumen',
};

export default function ToeicPage() {
  return (
    <div className="container mx-auto p-4 py-8 md:p-8">
      <ToeicTestList />
    </div>
  );
}
