import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Icons } from '@lumen/uikit/icons';
import { Button } from '@lumen/uikit/components';
import { useAuthStore } from '@/store/auth.store';
import { useLogout, useMe } from '@/features/auth/hooks';
import { toast } from 'sonner';

const navItems = [
  { to: '/dashboard', icon: 'layout-dashboard', label: 'Dashboard' },
  { to: '/users', icon: 'users', label: 'Users' },
  { to: '/toeic', icon: 'file-text', label: 'TOEIC Tests' },
  { to: '/vocabulary', icon: 'book-marked', label: 'Vocabulary' },
  { to: '/materials', icon: 'book-open', label: 'Materials' },
  { to: '/reading', icon: 'book', label: 'Reading' },
  { to: '/grammar', icon: 'pen-tool', label: 'Grammar' },
  {
    to: '/listening-speaking',
    icon: 'headphones',
    label: 'Listening/Speaking',
  },
  { to: '/quizzes', icon: 'check-circle', label: 'Quizzes' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const logoutMutation = useLogout();

  const { data: meResponse } = useMe();
  const user = meResponse?.data;

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
      },
    });
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white dark:bg-slate-900 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b">
          <span className="font-bold text-xl tracking-tight text-teal-600 dark:text-teal-400">
            Lumen Admin
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-sm font-medium ${
                  isActive
                    ? 'bg-teal-50 text-teal-600 dark:bg-teal-900/50 dark:text-teal-400'
                    : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icons name={icon as any} className="h-4 w-4" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-sm font-medium mb-2 ${
                isActive
                  ? 'bg-teal-50 text-teal-600 dark:bg-teal-900/50 dark:text-teal-400'
                  : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`
            }
          >
            <Icons name="settings" className="h-4 w-4" />
            <span>Settings</span>
          </NavLink>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? (
              <Icons name="loader-2" className="h-4 w-4 mr-3 animate-spin" />
            ) : (
              <Icons name="log-out" className="h-4 w-4 mr-3" />
            )}
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b bg-white dark:bg-slate-900 shrink-0">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Lumen Dashboard
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-7 w-7 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xs uppercase">
                {user?.name?.substring(0, 2) || 'AD'}
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mr-1">
                {user?.name || 'Admin'}
              </span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
