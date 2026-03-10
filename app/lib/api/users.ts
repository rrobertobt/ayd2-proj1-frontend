import type { PagedResponse, PaginationApiOptions } from "./base";

export interface UserItemResponse {
    id:                  number;
    username:            string;
    email:               string;
    active:              boolean;
    onboardingCompleted: boolean;
    role:                Role;
    employee:            Employee;
}

export interface Employee {
    id:         number;
    firstName:  string;
    lastName:   string;
    hourlyRate: number;
}

export interface Role {
    id:   number;
    code: string;
    name: string;
}

export interface FilterUsersOptions extends PaginationApiOptions {
  search?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  roleId?: number;
  roleCode?: string;
  active?: boolean;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password?: string;
  roleId: number;
  employee: {
    firstName: string;
    lastName: string;
    hourlyRate: number;
  }
}

export interface UpdateUserRequest {
  username: string;
  email: string;
  employee: {
    firstName: string;
    lastName: string;
    hourlyRate: number;
  }
}

export const usersApi = {
  list: (queryOptions?: FilterUsersOptions) => {
    return $api<PagedResponse<UserItemResponse>>("/users", {
      method: "GET",
      query: queryOptions,
    });
  },
  listDevelopers: ({ fullName }: { fullName?: string;  }) => {
    return $api<UserItemResponse[]>("/users/developers", {
      method: "GET",
      query: { fullName },
    });
  },
  create: (userData: CreateUserRequest) => {
    return $api<UserItemResponse>("/users", {
      method: "POST",
      body: userData,
    });
  },
  resendOnboardingEmail: (userId: number) => {
    return $api(`/users/${userId}/onboarding/resend`, {
      method: "POST",
    });
  },
  toggleUserStatus: (userId: number) => {
    return $api(`/users/${userId}/toggle-status`, {
      method: "PATCH",
    });
  },
  getById: (userId: number) => {
    return $api<UserItemResponse>(`/users/${userId}`, {
      method: "GET",
    });
  },
  update: (userId: number, userData: UpdateUserRequest) => {
    return $api<UserItemResponse>(`/users/${userId}`, {
      method: "PATCH",
      body: userData,
    });
  },
  changePassword: (data: ChangePasswordRequest) => {
    return $api("/users/me/password", {
      method: "PATCH",
      body: data,
    });
  },
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}