import { useNavigate } from "react-router-dom"
import { DataTable } from "@/shared/components/data-table"
import { Button } from "@lumen/uikit/components"
import { Icons } from '@lumen/uikit/icons';
import { useVocabularyWords, useDeleteVocabularyWord } from "../hooks"

export default function VocabList() {
  const navigate = useNavigate()
  const { data: response, isLoading } = useVocabularyWords({ limit: 100 })
  const words = response?.data?.items || []
  
  const deleteMutation = useDeleteVocabularyWord()

  const columns = [
    {
      accessorKey: "term",
      header: "Word",
      cell: ({ row }: any) => <span className="font-semibold">{row.getValue("term")}</span>
    },
    {
      accessorKey: "phonetic",
      header: "Phonetic",
      cell: ({ row }: any) => {
        const phonetic = row.getValue("phonetic")
        return phonetic ? <span className="text-muted-foreground">{phonetic}</span> : "-"
      }
    },
    {
      accessorKey: "cefrLevel",
      header: "CEFR Level",
      cell: ({ row }: any) => {
        const level = row.getValue("cefrLevel")
        if (!level) return "-"
        return (
          <div className="px-2 py-1 rounded-md text-xs font-bold inline-block bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300">
            {level}
          </div>
        )
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const isPending = deleteMutation.isPending && deleteMutation.variables === row.original.id
        return (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate(`/vocabulary/${row.original.id}/edit`)}>
              <Icons name="edit" className="h-4 w-4 mr-1" /> Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => {
              if (confirm("Are you sure you want to delete this word?")) {
                deleteMutation.mutate(row.original.id)
              }
            }} disabled={isPending || deleteMutation.isPending}>
              {isPending ? <Icons name="loader-2" className="h-4 w-4 animate-spin" /> : <Icons name="trash-2" className="h-4 w-4" />}
            </Button>
          </div>
        )
      }
    }
  ]

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Icons name="loader-2" className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Vocabulary</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage dictionary words and definitions</p>
        </div>
        <Button onClick={() => navigate("/vocabulary/new")}>
          <Icons name="plus" className="mr-2 h-4 w-4" /> Add Word
        </Button>
      </div>

      <DataTable
        columns={columns as any}
        data={words}
        searchKey="term"
      />
    </div>
  )
}
