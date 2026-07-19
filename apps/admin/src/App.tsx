import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@lumen/uikit/components';

import MainLayout from './layout/main-layout';
import ProtectedRoute from './shared/components/protected-route';
import LoginPage from './features/auth/pages/login-page';
import DashboardPage from './features/dashboard/pages/overview-page';
import TestListPage from './features/toeic/pages/test-list-page';
import TestFormPage from './features/toeic/pages/test-form-page';
import MissingExplanationsPage from './features/toeic/pages/missing-explanations-page';
import VocabListPage from './features/vocabulary/pages/vocab-list-page';
import VocabFormPage from './features/vocabulary/pages/vocab-form-page';
import UserListPage from './features/users/pages/user-list-page';
import UserFormPage from './features/users/pages/user-form-page';
import MaterialListPage from './features/materials/pages/material-list-page';
import MaterialFormPage from './features/materials/pages/material-form-page';
import ReadingListPage from './features/reading/pages/reading-list-page';
import ReadingFormPage from './features/reading/pages/reading-form-page';
import GrammarListPage from './features/grammar/pages/grammar-list-page';
import GrammarFormPage from './features/grammar/pages/grammar-form-page';
import ListeningSpeakingListPage from './features/listening-speaking/pages/listening-speaking-list-page';
import ListeningSpeakingFormPage from './features/listening-speaking/pages/listening-speaking-form-page';
import QuizzesListPage from './features/quizzes/pages/quizzes-list-page';
import QuizzesFormPage from './features/quizzes/pages/quizzes-form-page';

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

              <Route path="toeic">
                <Route index element={<TestListPage />} />
                <Route path="new" element={<TestFormPage />} />
                <Route path=":id/edit" element={<TestFormPage />} />
                <Route
                  path="missing-explanations"
                  element={<MissingExplanationsPage />}
                />
              </Route>

              <Route path="vocabulary">
                <Route index element={<VocabListPage />} />
                <Route path="new" element={<VocabFormPage />} />
                <Route path=":id/edit" element={<VocabFormPage />} />
              </Route>

              <Route path="reading">
                <Route index element={<ReadingListPage />} />
                <Route path="new" element={<ReadingFormPage />} />
                <Route path=":id/edit" element={<ReadingFormPage />} />
              </Route>

              <Route path="grammar">
                <Route index element={<GrammarListPage />} />
                <Route path="new" element={<GrammarFormPage />} />
                <Route path=":id/edit" element={<GrammarFormPage />} />
              </Route>

              <Route path="listening-speaking">
                <Route index element={<ListeningSpeakingListPage />} />
                <Route path="new" element={<ListeningSpeakingFormPage />} />
                <Route
                  path=":id/edit"
                  element={<ListeningSpeakingFormPage />}
                />
              </Route>

              <Route path="quizzes">
                <Route index element={<QuizzesListPage />} />
                <Route path="new" element={<QuizzesFormPage />} />
                <Route path=":id/edit" element={<QuizzesFormPage />} />
              </Route>

              <Route
                path="settings"
                element={<div className="p-4">Settings Module Coming Soon</div>}
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
