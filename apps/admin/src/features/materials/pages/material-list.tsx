import { useNavigate } from "react-router-dom"
import { DataTable } from "@/shared/components/data-table"
import { Button } from "@lumen/uikit/components"
import { Icons } from '@lumen/uikit/icons';
import { useMaterials, useDeleteMaterial } from "../hooks"
import type { ColumnDef } from "@tanstack/react-table"
import type { MaterialDto } from "@/services/materials"
import { RouteEnum } from "@/shared/constants"

type MaterialListItem = Omit<MaterialDto, 'content'>

export default function MaterialList() {
  const navigate = useNavigate()
  const { data: response, isLoading } = useMaterials({ limit: 100 })
  const materials: MaterialListItem[] = response?.data?.items || []

  const deleteMutation = useDeleteMaterial()

  const columns: ColumnDef<MaterialListItem>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "category",
      header: "Type",
      cell: ({ row }) => {
        const category = row.original.category
        return (
          <span className={`px-2 py-1 rounded-md text-xs font-medium inline-flex items-center gap-1 ${
            category === "Reading"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
              : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
          }`}>
            {category === "Reading" ? <Icons name="book-open" className="h-3 w-3" /> : <Icons name="headphones" className="h-3 w-3" />}
            {category}
          </span>
        )
      }
    },
    {
      accessorKey: "level",
      header: "Level",
    },
    {
      accessorKey: "views",
      header: "Views",
      cell: () => 0 // Mock views for now since it's not in the DTO
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status || "Draft"
        return (
          <span className={`px-2 py-1 rounded-md text-xs font-medium inline-block ${
            status === "Published" ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-800"
          }`}>
            {status}
          </span>
        )
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const isPending = deleteMutation.isPending && deleteMutation.variables === row.original.id
        return (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate(`${RouteEnum.MATERIALS}/${row.original.id}/edit`)}>
              <Icons name="edit" className="h-4 w-4 mr-1" /> Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => {
              if (confirm("Are you sure you want to delete this material?")) {
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
          <h2 className="text-2xl font-bold tracking-tight">Learning Materials</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage reading passages and listening exercises</p>
        </div>
        <Button onClick={() => navigate(`${RouteEnum.MATERIALS}/new`)}>
          <Icons name="plus" className="mr-2 h-4 w-4" /> Add Material
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total", value: response?.data?.meta?.totalItems || materials.length, icon: <Icons name="book-open" className="h-5 w-5" />, color: "indigo" },
          { label: "Reading", value: materials.filter((m) => m.category === "Reading").length, icon: <Icons name="book-open" className="h-5 w-5" />, color: "blue" },
          { label: "Listening", value: materials.filter((m) => m.category === "Listening").length, icon: <Icons name="headphones" className="h-5 w-5" />, color: "amber" },
          { label: "Published", value: materials.filter((m) => m.status === "Published").length, icon: <Icons name="book-open" className="h-5 w-5" />, color: "green" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-slate-900 border rounded-lg p-4 flex items-center gap-4">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center bg-${stat.color}-100 text-${stat.color}-600`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <DataTable columns={columns} data={materials} searchKey="title" />
    </div>
  )
}
