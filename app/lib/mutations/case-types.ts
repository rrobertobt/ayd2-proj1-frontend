import { toast } from "vue-sonner";
import { caseTypesApi } from "../api/case-types";
import type { CreateCaseTypeRequest, UpdateCaseTypeRequest, CreateStageRequest, UpdateStageRequest } from "../api/case-types";
import { fetchErrorHandler } from "../utils";

export const caseTypesMutations = {
  useCreateCaseType: ({ onComplete }: { onComplete?: () => void }) => {
    const { mutate, ...mutation } = useMutation({
      mutation: (data: CreateCaseTypeRequest) => caseTypesApi.create(data),
      onSuccess: () => {
        toast.success("Tipo de caso creado exitosamente");
        onComplete?.();
      },
      onError: (error) => {
        fetchErrorHandler(error);
      },
    });
    return { mutate, ...mutation };
  },

  useUpdateCaseType: ({ onComplete }: { onComplete?: () => void }) => {
    const { mutate, ...mutation } = useMutation({
      mutation: ({ caseTypeId, data }: { caseTypeId: number; data: UpdateCaseTypeRequest }) =>
        caseTypesApi.update(caseTypeId, data),
      onSuccess: () => {
        toast.success("Tipo de caso actualizado exitosamente");
        onComplete?.();
      },
      onError: (error) => {
        fetchErrorHandler(error);
      },
    });
    return { mutate, ...mutation };
  },

  useCreateStage: ({ onComplete }: { onComplete?: () => void }) => {
    const { mutate, ...mutation } = useMutation({
      mutation: ({ caseTypeId, data }: { caseTypeId: number; data: CreateStageRequest }) =>
        caseTypesApi.createStage(caseTypeId, data),
      onSuccess: () => {
        toast.success("Etapa creada exitosamente");
        onComplete?.();
      },
      onError: (error) => {
        fetchErrorHandler(error);
      },
    });
    return { mutate, ...mutation };
  },

  useUpdateStage: ({ onComplete }: { onComplete?: () => void }) => {
    const { mutate, ...mutation } = useMutation({
      mutation: ({
        caseTypeId,
        stageId,
        data,
      }: {
        caseTypeId: number;
        stageId: number;
        data: UpdateStageRequest;
      }) => caseTypesApi.updateStage(caseTypeId, stageId, data),
      onSuccess: () => {
        toast.success("Etapa actualizada exitosamente");
        onComplete?.();
      },
      onError: (error) => {
        fetchErrorHandler(error);
      },
    });
    return { mutate, ...mutation };
  },

  useDeleteStage: ({ onComplete }: { onComplete?: () => void }) => {
    const { mutate, ...mutation } = useMutation({
      mutation: ({ caseTypeId, stageId }: { caseTypeId: number; stageId: number }) =>
        caseTypesApi.deleteStage(caseTypeId, stageId),
      onSuccess: () => {
        toast.success("Etapa eliminada exitosamente");
        onComplete?.();
      },
      onError: (error) => {
        fetchErrorHandler(error);
      },
    });
    return { mutate, ...mutation };
  },
};
