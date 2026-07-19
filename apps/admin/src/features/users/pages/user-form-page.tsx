import { RouteEnum } from '@/shared/constants/route';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useUserDetail, useCreateUser, useUpdateUser } from '../hooks';

export default function UserFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const { data: userResponse, isLoading } = useUserDetail(id as string, {
    enabled: isEditing,
  });
  const user = userResponse?.data;

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Admin' | 'Learner'>('Learner');
  const [status, setStatus] = useState<'Active' | 'Banned'>('Active');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isEditing && user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setRole(user.role || 'Learner');
      setStatus(user.status || 'Active');
    }
  }, [isEditing, user]);

  const handleSave = () => {
    if (isEditing) {
      updateMutation.mutate(
        {
          id: id as string,
          payload: {
            name,
            email,
            role,
            status,
            ...(password ? { password } : {}),
          },
        },
        {
          onSuccess: () => navigate(RouteEnum.USERS),
        },
      );
    } else {
      createMutation.mutate(
        {
          name,
          email,
          role,
          password,
        },
        {
          onSuccess: () => navigate(RouteEnum.USERS),
        },
      );
    }
  };

  if (isEditing && isLoading) {
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
    <div className="space-y-6 max-w-2xl mx-auto pb-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(RouteEnum.USERS)}
            className="p-2 h-8 w-8"
          >
            <Icons name="arrow-left" className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">
            {isEditing ? 'Edit User' : 'Add New User'}
          </h2>
        </div>
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? (
            <Icons name="loader-2" className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons name="save" className="mr-2 h-4 w-4" />
          )}
          Save
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
            />
          </div>
          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
              />
            </div>
          )}
          {isEditing && (
            <div className="space-y-2">
              <Label htmlFor="newPassword">
                New Password (leave blank to keep current)
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Role</Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('Learner')}
                className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-colors cursor-pointer ${
                  role === 'Learner'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-border bg-white dark:bg-slate-900'
                }`}
              >
                <Icons
                  name="user"
                  className={`h-5 w-5 ${role === 'Learner' ? 'text-indigo-600' : 'text-muted-foreground'}`}
                />
                <div className="text-left">
                  <p className="font-medium text-sm">Learner</p>
                  <p className="text-xs text-muted-foreground">
                    Access learning content
                  </p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setRole('Admin')}
                className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-colors cursor-pointer ${
                  role === 'Admin'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-border bg-white dark:bg-slate-900'
                }`}
              >
                <Icons
                  name="shield"
                  className={`h-5 w-5 ${role === 'Admin' ? 'text-indigo-600' : 'text-muted-foreground'}`}
                />
                <div className="text-left">
                  <p className="font-medium text-sm">Admin</p>
                  <p className="text-xs text-muted-foreground">
                    Full management access
                  </p>
                </div>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Account Status</Label>
            <div className="grid grid-cols-2 gap-4">
              {['Active', 'Banned'].map((statusOption) => (
                <button
                  key={statusOption}
                  type="button"
                  onClick={() => setStatus(statusOption as any)}
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-colors cursor-pointer ${
                    status === statusOption
                      ? statusOption === 'Active'
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-border bg-white dark:bg-slate-900'
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${statusOption === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}
                  />
                  <p className="font-medium text-sm">{statusOption}</p>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
