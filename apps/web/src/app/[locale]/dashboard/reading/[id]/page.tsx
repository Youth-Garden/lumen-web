import { ArticleReader } from '@/features/reading/components/article-reader';

export const metadata = {
  title: 'Read Article | Lumen',
};

interface PageProps {
  params: {
    id: string;
  };
}

export default function ArticlePage({ params }: PageProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50/50 p-4 py-8 dark:bg-slate-950/50 md:p-8">
      <ArticleReader articleId={params.id} />
    </div>
  );
}
