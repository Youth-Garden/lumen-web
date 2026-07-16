import { useNavigate } from 'react-router-dom';
import { Button } from '@lumen/uikit/components';
import { DataTable } from '@/shared/components/data-table';
import { Icons } from '@lumen/uikit/icons';
import { useQuizzes, useDeleteQuiz } from '../hooks/use-quizzes';
import type { ColumnDef } from '@tanstack/react-table';
import type { PresetQuiz } from '../types';
import { format } from 'date-fns';

export default function QuizzesList() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuizzes();
  const deleteQuiz = useDeleteQuiz();

  const columns: ColumnDef<PresetQuiz>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <span
          className="truncate max-w-[200px] block"
          title={row.getValue('description')}
        >
          {row.getValue('description')}
        </span>
      ),
    },
    {
      accessorKey: 'isPublished',
      header: 'Status',
      cell: ({ row }) => {
        const isPublished = row.getValue('isPublished') as boolean;
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              isPublished
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            {isPublished ? 'Published' : 'Draft'}
          </span>
        );
      },
    },
    {
      accessorKey: 'updatedAt',
      header: 'Last Updated',
      cell: ({ row }) => {
        const dateStr = row.getValue('updatedAt') as string;
        return dateStr ? format(new Date(dateStr), 'MMM d, yyyy') : '-';
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const quiz = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/quizzes/${quiz.id}`)}
            >
              <Icons name="edit" className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive/90"
              onClick={() => {
                if (
                  window.confirm('Are you sure you want to delete this quiz?')
                ) {
                  deleteQuiz.mutate(quiz.id);
                }
              }}
            >
              <Icons name="trash-2" className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Quizzes Management
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Manage static preset quizzes
          </p>
        </div>
        <Button onClick={() => navigate('/quizzes/new')}>
          <Icons name="plus" className="mr-2 h-4 w-4" /> Add Quiz
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Icons
            name="loader-2"
            className="h-8 w-8 animate-spin text-primary"
          />
        </div>
      ) : data?.data?.items && data.data.items.length > 0 ? (
        <DataTable columns={columns} data={data.data.items} searchKey="title" />
      ) : (
        <div className="bg-white dark:bg-slate-900 border rounded-lg p-16 text-center text-muted-foreground flex flex-col items-center justify-center">
          <Icons
            name="layers"
            className="h-12 w-12 mb-4 opacity-30 text-teal-500"
          />
          <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
            No quizzes found
          </p>
          <p className="text-sm mt-1 mb-6">
            Click "Add" to create the first entry.
          </p>
        </div>
      )}
    </div>
  );
}
