import { toast } from "vue-sonner";
import { projectsApi } from "../api/projects";
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
};
