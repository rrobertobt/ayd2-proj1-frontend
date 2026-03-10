import { toast } from "vue-sonner";
import { authApi } from "../api/auth";
import type { ForgotPasswordRequest, ResetPasswordRequest } from "../api/auth";
import { fetchErrorHandler } from "../utils";

export const authMutations = {
  useForgotPassword: ({ onComplete }: { onComplete?: () => void } = {}) => {
    const { mutate, ...mutation } = useMutation({
      mutation: (data: ForgotPasswordRequest) => authApi.forgotPassword(data),
      onSuccess: () => {
        toast.success("Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.");
        onComplete?.();
      },
      onError: (error) => {
        fetchErrorHandler(error);
      },
    });
    return { mutate, ...mutation };
  },

  useResetPassword: ({ onComplete }: { onComplete?: () => void } = {}) => {
    const { mutate, ...mutation } = useMutation({
      mutation: (data: ResetPasswordRequest) => authApi.resetPassword(data),
      onSuccess: () => {
        toast.success("Contraseña restablecida correctamente. Ya puedes iniciar sesión con tu nueva contraseña.");
        onComplete?.();
      },
      onError: (error) => {
        fetchErrorHandler(error);
      },
    });
    return { mutate, ...mutation };
  },
};
