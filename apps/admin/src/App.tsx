import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@lumen/uikit/components"

import AdminLayout from "./layout/admin-layout"
import ProtectedRoute from "./shared/components/protected-route"
import LoginPage from "./features/auth/pages/login"
import DashboardPage from "./features/dashboard/pages/overview"
import TestList from "./features/toeic/pages/test-list"
import TestForm from "./features/toeic/pages/test-form"
import VocabList from "./features/vocabulary/pages/vocab-list"
import VocabForm from "./features/vocabulary/pages/vocab-form"
import UserList from "./features/users/pages/user-list"
import UserForm from "./features/users/pages/user-form"
import MaterialList from "./features/materials/pages/material-list"
import MaterialForm from "./features/materials/pages/material-form"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<AdminLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="users">
                <Route index element={<UserList />} />
                <Route path="new" element={<UserForm />} />
                <Route path=":id/edit" element={<UserForm />} />
              </Route>

              <Route path="materials">
                <Route index element={<MaterialList />} />
                <Route path="new" element={<MaterialForm />} />
                <Route path=":id/edit" element={<MaterialForm />} />
              </Route>
              
              <Route path="toeic">
                <Route index element={<TestList />} />
                <Route path="new" element={<TestForm />} />
                <Route path=":id/edit" element={<TestForm />} />
              </Route>

              <Route path="vocabulary">
                <Route index element={<VocabList />} />
                <Route path="new" element={<VocabForm />} />
                <Route path=":id/edit" element={<VocabForm />} />
              </Route>

              <Route path="settings" element={<div className="p-4">Settings Module Coming Soon</div>} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
