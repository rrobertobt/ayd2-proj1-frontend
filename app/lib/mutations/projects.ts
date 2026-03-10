import { toast } from "vue-sonner";
import { projectsApi } from "../api/projects";
import type { CreateProjectRequest, UpdateProjectRequest } from "../api/projects";
import { fetchErrorHandler } from "../utils";

export const projectsMutations = {
  useToggleProjectStatus: ({ onComplete }: { onComplete?: () => void }) =>
    {
      const { mutate, ...mutation } = useMutation({
        mutation: (projectId: number) => projectsApi.toggleProjectStatus(projectId),
        onSuccess: () => {
          toast.success("Estado del proyecto actualizado exitosamente");
          onComplete?.();
        },
        onError: (error) => {
          fetchErrorHandler(error);
        },
      });

      return {
        mutate,
        ...mutation,
      };
    },

  useCreateProject: ({ onComplete }: { onComplete?: () => void }) => {
    const { mutate, ...mutation } = useMutation({
      mutation: (data: CreateProjectRequest) => projectsApi.create(data),
      onSuccess: () => {
        toast.success("Proyecto creado exitosamente");
        onComplete?.();
      },
      onError: (error) => {
        fetchErrorHandler(error);
      },
    });
    return { mutate, ...mutation };
  },

  useUpdateProject: ({ onComplete }: { onComplete?: () => void }) => {
    const { mutate, ...mutation } = useMutation({
      mutation: ({ projectId, data }: { projectId: number; data: UpdateProjectRequest }) =>
        projectsApi.update(projectId, data),
      onSuccess: () => {
        toast.success("Proyecto actualizado exitosamente");
        onComplete?.();
      },
      onError: (error) => {
        fetchErrorHandler(error);
      },
    });
    return { mutate, ...mutation };
  },

  useAssignProjectAdmin: ({ onComplete }: { onComplete?: () => void }) => {
    const { mutate, ...mutation } = useMutation({
      mutation: ({ projectId, userId }: { projectId: number; userId: number }) =>
        projectsApi.assignAdmin(projectId, userId),
      onSuccess: () => {
        toast.success("Administrador asignado exitosamente");
        onComplete?.();
      },
      onError: (error) => {
        fetchErrorHandler(error);
      },
    });
    return { mutate, ...mutation };
  },
};
