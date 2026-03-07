import { toast } from "vue-sonner";
import { usersApi } from "../api/users";
import { fetchErrorHandler } from "../utils";

export const usersMutations = {
  useResendOnboardingEmail: ({ onComplete }: { onComplete?: () => void }) => {
    const { mutate, ...mutation } = useMutation({
      mutation: (userId: number) => usersApi.resendOnboardingEmail(userId),
      onSuccess: () => {
        toast.success("Correo de onboarding reenviado exitosamente");
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
  useToggleUserStatus: ({ onComplete }: { onComplete?: () => void }) =>
    {
      const { mutate, ...mutation } = useMutation({
        mutation: (userId: number) => usersApi.toggleUserStatus(userId),
        onSuccess: () => {
          toast.success("Estado del usuario actualizado exitosamente");
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
