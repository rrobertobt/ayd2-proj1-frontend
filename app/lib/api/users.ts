import type { PagedResponse, PaginationApiOptions } from "./base";

export interface UserItemResponse {
    id:       number;
    username: string;
    email:    string;
    active:   boolean;
    role:     Role;
    employee: Employee;
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
  email?: string;
  roleId?: number;
  active?: boolean;
}

export const usersApi = {
  list: (queryOptions?: FilterUsersOptions) => {
    return $api<PagedResponse<UserItemResponse>>("/users", {
      method: "GET",
      query: queryOptions,
    });
  }
}