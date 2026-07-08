export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Learner';
  status: 'Active' | 'Banned';
  joinedAt: string;
}

export interface UserListResponse {
  items: AdminUser[];
  meta: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'Learner';
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: 'Admin' | 'Learner';
  status?: 'Active' | 'Banned';
}
