import { toast } from "vue-sonner";
import { usersApi } from "../api/users";
import type { ChangePasswordRequest } from "../api/users";
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

  useChangePassword: ({ onComplete }: { onComplete?: () => void } = {}) => {
    const { mutate, ...mutation } = useMutation({
      mutation: (data: ChangePasswordRequest) => usersApi.changePassword(data),
      onSuccess: () => {
        toast.success("Contraseña actualizada correctamente");
        onComplete?.();
      },
      onError: (error) => {
        fetchErrorHandler(error);
      },
    });
    return { mutate, ...mutation };
  },
};
