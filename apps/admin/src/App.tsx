import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@lumen/uikit/components';

import MainLayout from './layout/main-layout';
import ProtectedRoute from './shared/components/protected-route';
import LoginPage from './features/auth/pages/login-page';
import DashboardPage from './features/dashboard/pages/overview-page';
import VocabListPage from './features/vocabulary/pages/vocab-list-page';
import VocabFormPage from './features/vocabulary/pages/vocab-form-page';
import UserListPage from './features/users/pages/user-list-page';
import UserFormPage from './features/users/pages/user-form-page';
import MaterialListPage from './features/materials/pages/material-list-page';
import MaterialFormPage from './features/materials/pages/material-form-page';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="users">
                <Route index element={<UserListPage />} />
                <Route path="new" element={<UserFormPage />} />
                <Route path=":id/edit" element={<UserFormPage />} />
              </Route>

              <Route path="materials">
                <Route index element={<MaterialListPage />} />
                <Route path="new" element={<MaterialFormPage />} />
                <Route path=":id/edit" element={<MaterialFormPage />} />
              </Route>

              <Route path="vocabulary">
                <Route index element={<VocabListPage />} />
                <Route path="new" element={<VocabFormPage />} />
                <Route path=":id/edit" element={<VocabFormPage />} />
              </Route>

              <Route
                path="settings"
                element={<div className="p-4">Settings Module</div>}
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
