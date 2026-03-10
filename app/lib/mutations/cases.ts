import { toast } from "vue-sonner";
import { casesApi } from "../api/cases";
import type { CreateCaseRequest, UpdateDueDateRequest, CancelCaseRequest } from "../api/cases";
import { fetchErrorHandler } from "../utils";

export const casesMutations = {
  useCreateCase: ({ onComplete }: { onComplete?: () => void }) => {
    const { mutate, ...mutation } = useMutation({
      mutation: (data: CreateCaseRequest) => casesApi.create(data),
      onSuccess: () => {
        toast.success("Caso creado exitosamente");
        onComplete?.();
      },
      onError: (error) => {
        fetchErrorHandler(error);
      },
    });
    return { mutate, ...mutation };
  },

  useUpdateDueDate: ({ onComplete }: { onComplete?: () => void }) => {
    const { mutate, ...mutation } = useMutation({
      mutation: ({ caseId, data }: { caseId: number; data: UpdateDueDateRequest }) =>
        casesApi.updateDueDate(caseId, data),
      onSuccess: () => {
        toast.success("Fecha límite actualizada exitosamente");
        onComplete?.();
      },
      onError: (error) => {
        fetchErrorHandler(error);
      },
    });
    return { mutate, ...mutation };
  },

  useCancelCase: ({ onComplete }: { onComplete?: () => void }) => {
    const { mutate, ...mutation } = useMutation({
      mutation: ({ caseId, data }: { caseId: number; data: CancelCaseRequest }) =>
        casesApi.cancelCase(caseId, data),
      onSuccess: () => {
        toast.success("Caso cancelado");
        onComplete?.();
      },
      onError: (error) => {
        fetchErrorHandler(error);
      },
    });
    return { mutate, ...mutation };
  },

  useAssignDeveloper: ({ onComplete }: { onComplete?: () => void }) => {
    const { mutate, ...mutation } = useMutation({
      mutation: ({ caseId, stepId, userId }: { caseId: number; stepId: number; userId: number }) =>
        casesApi.assignDeveloper(caseId, stepId, userId),
      onSuccess: () => {
        toast.success("Desarrollador asignado exitosamente");
        onComplete?.();
      },
      onError: (error) => {
        fetchErrorHandler(error);
      },
    });
    return { mutate, ...mutation };
  },

  useApproveStep: ({ onComplete }: { onComplete?: () => void }) => {
    const { mutate, ...mutation } = useMutation({
      mutation: ({
        caseId,
        stepId,
        nextAssigneeUserId,
      }: {
        caseId: number;
        stepId: number;
        nextAssigneeUserId?: number;
      }) => casesApi.approveStep(caseId, stepId, nextAssigneeUserId),
      onSuccess: () => {
        toast.success("Paso aprobado exitosamente");
        onComplete?.();
      },
      onError: (error) => {
        fetchErrorHandler(error);
      },
    });
    return { mutate, ...mutation };
  },

  useRejectStep: ({ onComplete }: { onComplete?: () => void }) => {
    const { mutate, ...mutation } = useMutation({
      mutation: ({
        caseId,
        stepId,
        reason,
      }: {
        caseId: number;
        stepId: number;
        reason: string;
      }) => casesApi.rejectStep(caseId, stepId, reason),
      onSuccess: () => {
        toast.success("Paso rechazado");
        onComplete?.();
      },
      onError: (error) => {
        fetchErrorHandler(error);
      },
    });
    return { mutate, ...mutation };
  },
};

