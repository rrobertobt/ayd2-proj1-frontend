import type { PagedResponse, PaginationApiOptions } from './base';

export type CaseStepStatus = 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
export type CaseStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';

export interface CaseStepItemResponse {
  id: number;
  caseTypeStageId: number;
  stageName: string;
  stepOrder: number;
  status: CaseStepStatus;
  assignedEmployeeId: number | null;
  assignedEmployeeName: string | null;
  assignedAt: string | null;
  startedAt: string | null;
  submittedAt: string | null;
  approvedAt: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CaseItemResponse {
  id: number;
  projectId: number;
  projectName: string;
  caseTypeId: number;
  caseTypeName: string;
  createdByEmployeeId: number;
  createdByEmployeeName: string;
  title: string;
  description: string | null;
  status: CaseStatus;
  dueDate: string;
  overdue: boolean;
  progressPercent: number;
  canceledAt: string | null;
  cancelReason: string | null;
  createdAt: string;
  updatedAt: string;
  steps: CaseStepItemResponse[];
}

export interface CaseSummaryItemResponse {
  id: number;
  projectId: number;
  projectName: string;
  caseTypeId: number;
  caseTypeName: string;
  title: string;
  status: CaseStatus;
  dueDate: string;
  overdue: boolean;
  progressPercent: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCaseRequest {
  projectId: number;
  caseTypeId: number;
  title: string;
  description?: string;
  dueDate: string;
}

export interface UpdateDueDateRequest {
  dueDate: string;
}

export interface CancelCaseRequest {
  reason: string;
}

export interface WorklogItemResponse {
  id: number;
  caseStepId: number;
  employeeId: number;
  employeeName: string;
  comment: string;
  hoursSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorklogRequest {
  comment: string;
  hoursSpent: number;
}

export interface FilterCasesOptions extends PaginationApiOptions {
  projectId?: number;
  caseTypeId?: number;
  status?: string;
  sortBy?: string;
  sortDir?: string;
}

export const casesApi = {
  list: (queryOptions?: FilterCasesOptions) => {
    return $api<PagedResponse<CaseSummaryItemResponse>>('/cases', {
      method: 'GET',
      query: queryOptions,
    });
  },
  listMy: () => {
    return $api<CaseSummaryItemResponse[]>('/cases/my-assigned', {
      method: 'GET',
    });
  },
  listByProject: (projectId: number, queryOptions?: FilterCasesOptions) => {
    return $api<PagedResponse<CaseSummaryItemResponse>>(`/projects/${projectId}/cases`, {
      method: 'GET',
      query: queryOptions,
    });
  },
  getById: (caseId: number) => {
    return $api<CaseItemResponse>(`/cases/${caseId}`, {
      method: 'GET',
    });
  },
  create: (data: CreateCaseRequest) => {
    return $api<CaseItemResponse>('/cases', {
      method: 'POST',
      body: data,
    });
  },
  updateDueDate: (caseId: number, data: UpdateDueDateRequest) => {
    return $api<CaseItemResponse>(`/cases/${caseId}/due-date`, {
      method: 'PATCH',
      body: data,
    });
  },
  cancelCase: (caseId: number, data: CancelCaseRequest) => {
    return $api<CaseItemResponse>(`/cases/${caseId}/cancel`, {
      method: 'PATCH',
      body: data,
    });
  },
  assignDeveloper: (caseId: number, stepId: number, userId: number) => {
    return $api<CaseStepItemResponse>(`/cases/${caseId}/steps/${stepId}/assign`, {
      method: 'PATCH',
      body: { userId },
    });
  },
  approveStep: (caseId: number, stepId: number, nextAssigneeUserId?: number) => {
    return $api<CaseStepItemResponse>(`/cases/${caseId}/steps/${stepId}/approve`, {
      method: 'PATCH',
      body: { nextAssigneeUserId },
    });
  },
  rejectStep: (caseId: number, stepId: number, reason: string) => {
    return $api<CaseStepItemResponse>(`/cases/${caseId}/steps/${stepId}/reject`, {
      method: 'PATCH',
      body: { reason },
    });
  },
  listWorklogs: (caseId: number, stepId: number) => {
    return $api<WorklogItemResponse[]>(`/cases/${caseId}/steps/${stepId}/worklogs`, {
      method: 'GET',
    });
  },
  createWorklog: (caseId: number, stepId: number, data: CreateWorklogRequest) => {
    return $api<WorklogItemResponse>(`/cases/${caseId}/steps/${stepId}/worklogs`, {
      method: 'POST',
      body: data,
    });
  },
};
