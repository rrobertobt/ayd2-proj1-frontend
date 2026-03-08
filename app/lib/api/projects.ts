import type { PagedResponse, PaginationApiOptions } from "./base";

export interface ProjectItemResponse {
    id:           number;
    name:         string;
    description:  string;
    status:       'ACTIVE' | 'INACTIVE';
    createdAt:    Date;
    updatedAt:    Date;
    currentAdmin: CurrentAdmin;
}

export interface CurrentAdmin {
    assignmentId: number;
    employeeId:   number;
    firstName:    string;
    lastName:     string;
}

export interface CreateProjectRequest {
    name:        string;
    description: string;
}

export interface UpdateProjectRequest {
    name?:        string;
    description?: string;
}

export interface FilterProjectsOptions extends PaginationApiOptions {
    search?:  string;
    status?:  string;
}

export const projectsApi = {
  list: (queryOptions?: FilterProjectsOptions) => {
    return $api<PagedResponse<ProjectItemResponse>>("/projects", {
      method: "GET",
      query: queryOptions,
    });
  },
  create: (projectData: CreateProjectRequest) => {
    return $api<ProjectItemResponse>("/projects", {
      method: "POST",
      body: projectData,
    });
  },
  toggleProjectStatus: (projectId: number) => {
    return $api(`/projects/${projectId}/toggle-status`, {
      method: "PATCH",
    });
  },
  getById: (projectId: number) => {
    return $api<ProjectItemResponse>(`/projects/${projectId}`, {
      method: "GET",
    });
  },
  update: (projectId: number, projectData: UpdateProjectRequest) => {
    return $api<ProjectItemResponse>(`/projects/${projectId}`, {
      method: "PATCH",
      body: projectData,
    });
  },
  assignAdmin: (projectId: number, userId: number) => {
    return $api(`/projects/${projectId}/admins`, {
      method: "POST",
      body: { userId },
    });
  },
}