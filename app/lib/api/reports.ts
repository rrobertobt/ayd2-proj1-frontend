import type { CaseStatus } from "./cases";

// ---- Response Types ----

export interface ProjectCaseCountDTO {
  projectId: number;
  projectName: string;
  projectStatus: "ACTIVE" | "INACTIVE";
  caseCount: number;
}

export interface HoursAndMoneyDTO {
  totalCases: number;
  totalHours: number;
  totalMoney: number;
}

export interface DeveloperReportDTO {
  employeeId: number;
  firstName: string;
  lastName: string;
  username: string;
  hourlyRate: number;
  totalCasesParticipated: number;
  totalHoursLogged: number;
  totalMoneyPaid: number;
}

export interface ProjectReportDTO {
  projectId: number;
  projectName: string;
  projectStatus: "ACTIVE" | "INACTIVE";
  totalCases: number;
  openCases: number;
  inProgressCases: number;
  completedCases: number;
  canceledCases: number;
  totalHours: number;
  totalMoney: number;
}

export interface TopDeveloperDTO {
  employeeId: number;
  firstName: string;
  lastName: string;
  username: string;
  count: number;
  totalMoney: number;
}

export interface TopProjectDTO {
  projectId: number;
  projectName: string;
  caseCount: number;
}

export interface CaseReportDTO {
  caseId: number;
  title: string;
  status: CaseStatus;
  projectName: string;
  caseTypeName: string;
  createdByEmployee: string;
  dueDate: string;
  createdAt: string;
  totalHours: number;
  totalMoney: number;
}

// ---- Query Options ----

export interface ProjectCaseCountOptions {
  status?: "ACTIVE" | "INACTIVE";
}

export interface ProjectReportOptions {
  status?: "ACTIVE" | "INACTIVE";
  search?: string;
}

export interface DeveloperReportOptions {
  search?: string;
}

export interface InvestmentByDateOptions {
  from: string;
  to: string;
}

// ---- API ----

export const reportsApi = {
  // 1. Cantidad de casos por proyecto
  projectCaseCount: (options?: ProjectCaseCountOptions) => {
    return $api<ProjectCaseCountDTO[]>("/reports/projects/case-count", {
      method: "GET",
      query: options,
    });
  },

  // 2. Horas y dinero por proyecto
  projectInvestment: (projectId: number) => {
    return $api<HoursAndMoneyDTO>(`/reports/projects/${projectId}/investment`, {
      method: "GET",
    });
  },

  // 3. Horas y dinero por desarrollador
  developerInvestment: (employeeId: number) => {
    return $api<HoursAndMoneyDTO>(`/reports/developers/${employeeId}/investment`, {
      method: "GET",
    });
  },

  // 4. Horas y dinero por tipo de caso
  caseTypeInvestment: (caseTypeId: number) => {
    return $api<HoursAndMoneyDTO>(`/reports/case-types/${caseTypeId}/investment`, {
      method: "GET",
    });
  },

  // 5. Horas y dinero en un intervalo de tiempo
  investmentByDate: (options: InvestmentByDateOptions) => {
    return $api<HoursAndMoneyDTO>("/reports/investment/by-date", {
      method: "GET",
      query: options,
    });
  },

  // 6. Reporte de desarrolladores
  developers: (options?: DeveloperReportOptions) => {
    return $api<DeveloperReportDTO[]>("/reports/developers", {
      method: "GET",
      query: options,
    });
  },

  // 7. Reporte de proyectos
  projects: (options?: ProjectReportOptions) => {
    return $api<ProjectReportDTO[]>("/reports/projects", {
      method: "GET",
      query: options,
    });
  },

  // 8. Desarrollador con más casos
  topDeveloperMostCases: () => {
    return $api<TopDeveloperDTO | null>("/reports/developers/top/most-cases", {
      method: "GET",
    });
  },

  // 9. Desarrollador al que se le ha pagado más
  topDeveloperHighestPaid: () => {
    return $api<TopDeveloperDTO | null>("/reports/developers/top/highest-paid", {
      method: "GET",
    });
  },

  // 10. Proyecto con más casos finalizados
  topProjectMostCompleted: () => {
    return $api<TopProjectDTO | null>("/reports/projects/top/most-completed", {
      method: "GET",
    });
  },

  // 11. Proyecto con más casos cancelados
  topProjectMostCanceled: () => {
    return $api<TopProjectDTO | null>("/reports/projects/top/most-canceled", {
      method: "GET",
    });
  },

  // 12. Casos de un proyecto
  casesByProject: (projectId: number) => {
    return $api<CaseReportDTO[]>(`/reports/projects/${projectId}/cases`, {
      method: "GET",
    });
  },

  // 13. Casos de un desarrollador
  casesByDeveloper: (employeeId: number) => {
    return $api<CaseReportDTO[]>(`/reports/developers/${employeeId}/cases`, {
      method: "GET",
    });
  },

  // 14. Casos de un tipo de caso
  casesByCaseType: (caseTypeId: number) => {
    return $api<CaseReportDTO[]>(`/reports/case-types/${caseTypeId}/cases`, {
      method: "GET",
    });
  },
};
