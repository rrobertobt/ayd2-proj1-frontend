import { defineStore } from "pinia";
import { toast } from "vue-sonner";
import { $api } from "~/utils/plain-fetch";

export interface LoginResponse {
  username: string;
  email: string;
  active: boolean;
  token: string;
  role: Role;
  employee: Employee;
  onboardingCompleted: boolean;
}

export interface Employee {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  firstName: string;
  lastName: string;
  hourlyRate: number;
}

export type RoleCode = "SYSTEM_ADMIN" | "PROJECT_ADMIN" | "DEVELOPER";

export interface Role {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  code: RoleCode;
  name: string;
  description: string;
}

export const useSessionStore = defineStore("session", () => {
  const session = ref<LoginResponse>();
  const loading = ref(false);

  const login = async (credentials: { username: string; password: string }) => {
    const { username, password } = credentials;
    loading.value = true;
    let token = "";
    try {
      const { setToken } = useNuxtApp().$authCookie;
      const requestBody = { username, password };
      const response = await $api<LoginResponse>("/login", {
        method: "POST",
        body: requestBody,
        onResponse: ({ response }) => {
          // if (response.headers.get('Authorization')) {
          //   token = response.headers.get('Authorization')?.replace('Bearer ', '')
          //   setToken(token)
          // }
          if (response._data?.token) {
            token = response._data.token;
            setToken(token);
          }
        },
      });
      session.value = response;
      toast.success("Sesión iniciada correctamente");

      navigateTo("/main/dashboard");

      return response;
    } catch (error) {
      console.log("Error al iniciar sesión:", error?.data);
      toast.error(error.data?.message ?? error.name, {});
      // console.log('Error al iniciar sesión:', error)
      return {
        error: error.data.message ?? error.name,
      };
    } finally {
      loading.value = false;
    }
  };

  const onboarding = async (
    {token, password, confirmPassword}: { token: string; password: string; confirmPassword: string }
  ) => {
    loading.value = true;
    try {
      const response = await $api("/users/onboarding/set-password", {
        method: "POST",
        body: { token, password, confirmPassword },
      });
      toast.success("Cuenta activada correctamente. Ya puedes iniciar sesión con tu nueva contraseña.");
      navigateTo("/login");
      return response;
    } catch (error) {
      console.log("Error al actualizar la contraseña:", error?.data);
      toast.error(error.data?.message ?? error.name, {});
      return {
        error: error.data.message ?? error.name,
      };
    } finally {
      loading.value = false;
    }
  };

  const updatePassword = async (newPassword) => {
    loading.value = true;
    try {
      const response = await $api("/auth/password", {
        method: "PATCH",
        body: { password: newPassword },
      });
      // toast.add({
      //   severity: 'success',
      //   summary: 'Contraseña',
      //   detail: 'Contraseña actualizada correctamente',
      //   life: 3000
      // })
      return response;
    } catch (error) {
      // toast.add({
      //   severity: 'error',
      //   summary: 'Contraseña',
      //   detail: error.data.message ?? error.name,
      //   life: 3000
      // })
      return {
        error: error.data.message ?? error.name,
      };
    } finally {
      loading.value = false;
    }
  };

  const recoverSession = async () => {
    loading.value = true;
    try {
      const { getToken } = useNuxtApp().$authCookie;
      if (!getToken()) return;

      const response = await $api("/users/me");
      session.value = response;
      return response;
    } catch (error) {
      // toast.add({
      //   severity: 'error',
      //   summary: 'Sesión',
      //   detail: 'No se pudo recuperar la sesión. Intenta iniciar sesión nuevamente',
      //   life: 3000
      // })
      return {
        error: error.data?.message ?? error.name,
      };
    } finally {
      loading.value = false;
    }

    // const userData = localStorage.getItem('userData')
    // if (userData) {
    //   session.value = JSON.parse(userData)
    // }
  };

  const fetchUserData = async () => {
    loading.value = true;
    try {
      const response = await $api("/me");
      session.value = response;
      return response;
    } catch (error) {
      return {
        error: error.data.message,
      };
    } finally {
      loading.value = false;
    }
  };

  const role = computed(() => {
    return session.value?.role;
  });

  const isAuthenticated = computed(() => !!session.value);

  const roleChecker = computed(()=>{
    return {
      isSystemAdmin: role.value?.code === "SYSTEM_ADMIN",
      isProjectAdmin: role.value?.code === "PROJECT_ADMIN",
      isDeveloper: role.value?.code === "DEVELOPER",
    }
  })

  const logout = () => {
    navigateTo("/login");
    session.value = undefined;
    const { removeToken } = useNuxtApp().$authCookie;
    removeToken();
    toast.success("Sesión cerrada correctamente");
  };

  return {
    session,
    loading,
    login,
    logout,
    recoverSession,
    updatePassword,
    onboarding,
    fetchUserData,
    role,
    isAuthenticated,
    roleChecker,
  };
});
