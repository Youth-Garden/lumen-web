import { useNavigate } from 'react-router-dom';
import { DataTable } from '@/shared/components/data-table';
import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useToeicTests, useDeleteToeicTest } from '../hooks';

export default function TestList() {
  const navigate = useNavigate();
  const { data: response, isLoading } = useToeicTests({ limit: 100 });
  const tests = response?.data?.items || [];

  const deleteMutation = useDeleteToeicTest();

  const columns = [
    {
      accessorKey: 'title',
      header: 'Test Title',
    },
    {
      accessorKey: 'totalQuestions',
      header: 'Questions',
    },
    {
      accessorKey: 'durationMinutes',
      header: 'Duration (min)',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => {
        const status = row.getValue('status');
        return (
          <div
            className={`px-2 py-1 rounded-md text-xs font-medium inline-block ${
              status === 'Published'
                ? 'bg-green-100 text-green-800'
                : 'bg-slate-100 text-slate-800'
            }`}
          >
            {status}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => {
        const isPending =
          deleteMutation.isPending &&
          deleteMutation.variables === row.original.id;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/toeic/${row.original.id}/edit`)}
            >
              <Icons name="edit" className="h-4 w-4 mr-1" /> Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (confirm('Are you sure you want to delete this test?')) {
                  deleteMutation.mutate(row.original.id);
                }
              }}
              disabled={isPending || deleteMutation.isPending}
            >
              {isPending ? (
                <Icons name="loader-2" className="h-4 w-4 animate-spin" />
              ) : (
                <Icons name="trash-2" className="h-4 w-4" />
              )}
            </Button>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Icons
          name="loader-2"
          className="h-8 w-8 animate-spin text-muted-foreground"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">TOEIC Tests</h2>
        <Button onClick={() => navigate('/toeic/new')}>
          <Icons name="plus" className="mr-2 h-4 w-4" /> Add New Test
        </Button>
      </div>

      <DataTable columns={columns as any} data={tests} searchKey="title" />
    </div>
  );
}
