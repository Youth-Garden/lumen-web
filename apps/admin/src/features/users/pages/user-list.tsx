import { useNavigate } from "react-router-dom"
import { DataTable } from "@/shared/components/data-table"
import { Button } from "@lumen/uikit/components"
import { Plus, Edit, Ban, CheckCircle, Loader2 } from "lucide-react"
import { useUsers } from "../hooks"
import { useBanUser, useUnbanUser } from "../hooks"
import type { AdminUser } from "@/services/users"

export default function UserList() {
  const navigate = useNavigate()
  const { data: response, isLoading } = useUsers({ limit: 100 })
  const users = response?.data?.items || []
  
  const banMutation = useBanUser()
  const unbanMutation = useUnbanUser()

  const toggleBan = (user: AdminUser) => {
    if (user.status === "Active") {
      banMutation.mutate(user.id)
    } else {
      unbanMutation.mutate(user.id)
    }
  }

  const columns = [
    {
      accessorKey: "name",
      header: "Full Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }: any) => {
        const role = row.getValue("role")
        return (
          <span className={`px-2 py-1 rounded-md text-xs font-medium inline-block ${
            role === "Admin" ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
          }`}>
            {role}
          </span>
        )
      }
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("status")
        return (
          <span className={`px-2 py-1 rounded-md text-xs font-semibold inline-flex items-center gap-1 ${
            status === "Active" ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
          }`}>
            {status === "Active" ? <CheckCircle className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
            {status}
          </span>
        )
      }
    },
    {
      accessorKey: "joinedAt",
      header: "Joined Date",
      cell: ({ row }: any) => {
        const dateStr = row.getValue("joinedAt")
        if (!dateStr) return "-"
        return new Date(dateStr).toLocaleDateString("vi-VN")
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const user = row.original
        const isPending = banMutation.isPending || unbanMutation.isPending
        return (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate(`/users/${user.id}/edit`)}>
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
            <Button
              variant={user.status === "Active" ? "destructive" : "outline"}
              size="sm"
              onClick={() => toggleBan(user)}
              disabled={isPending}
            >
              {user.status === "Active" ? <Ban className="h-4 w-4 mr-1" /> : <CheckCircle className="h-4 w-4 mr-1" />}
              {user.status === "Active" ? "Ban" : "Unban"}
            </Button>
          </div>
        )
      }
    }
  ]

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage learner and admin accounts</p>
        </div>
        <Button onClick={() => navigate("/users/new")}>
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border rounded-lg p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><CheckCircle className="h-5 w-5" /></div>
          <div><p className="text-sm text-muted-foreground">Total Users</p><p className="text-2xl font-bold">{response?.data?.meta?.totalItems || users.length}</p></div>
        </div>
        <div className="bg-white dark:bg-slate-900 border rounded-lg p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600"><CheckCircle className="h-5 w-5" /></div>
          <div><p className="text-sm text-muted-foreground">Active</p><p className="text-2xl font-bold">{users.filter(u => u.status === "Active").length}</p></div>
        </div>
        <div className="bg-white dark:bg-slate-900 border rounded-lg p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600"><Ban className="h-5 w-5" /></div>
          <div><p className="text-sm text-muted-foreground">Banned</p><p className="text-2xl font-bold">{users.filter(u => u.status === "Banned").length}</p></div>
        </div>
      </div>

      <DataTable columns={columns as any} data={users} searchKey="name" />
    </div>
  )
}
