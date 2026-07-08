import { ArticleList } from '@/features/reading/components/article-list';

export const metadata = {
  title: 'Reading | Lumen',
};

export default function ReadingPage() {
  return (
    <div className="container mx-auto p-4 py-8 md:p-8">
      <ArticleList />
    </div>
  );
}
