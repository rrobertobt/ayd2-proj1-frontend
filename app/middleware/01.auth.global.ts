export default defineNuxtRouteMiddleware((to, from) => {
  const sessionStore = useSessionStore();

  // Si el usuario esta intetando acceder al login y no ha una sesión activa, dejarlo pasar
  const publicPaths = ["/login", "/onboarding", "/reset-password", "/forgot-password"];
  if (publicPaths.includes(to.path) && !sessionStore.isAuthenticated) {
    return;
  }

  // Si el usuario esta intentando acceder a cualquier otra ruta y no hay una sesión activa, redirigir al login
  if (!sessionStore.isAuthenticated) {
    return navigateTo("/login");
  }


});