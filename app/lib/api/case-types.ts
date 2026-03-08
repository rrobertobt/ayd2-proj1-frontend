import type { PaginationApiOptions } from "./base";

export interface StageItemResponse {
  id: number;
  name: string;
  description: string | null;
  stageOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CaseTypeItemResponse {
  id: number;
  name: string;
  description: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  stages: StageItemResponse[];
}

export interface CreateCaseTypeRequest {
  name: string;
  description?: string;
}

export interface UpdateCaseTypeRequest {
  name?: string;
  description?: string;
}

export interface CreateStageRequest {
  name: string;
  description?: string;
  stageOrder: number;
}

export interface UpdateStageRequest {
  name?: string;
  description?: string;
  stageOrder?: number;
}

export interface FilterCaseTypesOptions extends PaginationApiOptions {
  search?: string;
  active?: boolean;
  sortBy?: string;
  sortDir?: string;
}

export const caseTypesApi = {
  list: (queryOptions?: FilterCaseTypesOptions) => {
    return $api<import("./base").PagedResponse<CaseTypeItemResponse>>("/case-types", {
      method: "GET",
      query: queryOptions,
    });
  },
  getById: (caseTypeId: number) => {
    return $api<CaseTypeItemResponse>(`/case-types/${caseTypeId}`, {
      method: "GET",
    });
  },
  create: (data: CreateCaseTypeRequest) => {
    return $api<CaseTypeItemResponse>("/case-types", {
      method: "POST",
      body: data,
    });
  },
  update: (caseTypeId: number, data: UpdateCaseTypeRequest) => {
    return $api<CaseTypeItemResponse>(`/case-types/${caseTypeId}`, {
      method: "PATCH",
      body: data,
    });
  },

  // Stages
  listStages: (caseTypeId: number) => {
    return $api<StageItemResponse[]>(`/case-types/${caseTypeId}/stages`, {
      method: "GET",
    });
  },
  createStage: (caseTypeId: number, data: CreateStageRequest) => {
    return $api<StageItemResponse>(`/case-types/${caseTypeId}/stages`, {
      method: "POST",
      body: data,
    });
  },
  updateStage: (caseTypeId: number, stageId: number, data: UpdateStageRequest) => {
    return $api<StageItemResponse>(`/case-types/${caseTypeId}/stages/${stageId}`, {
      method: "PATCH",
      body: data,
    });
  },
  deleteStage: (caseTypeId: number, stageId: number) => {
    return $api(`/case-types/${caseTypeId}/stages/${stageId}`, {
      method: "DELETE",
    });
  },
};
