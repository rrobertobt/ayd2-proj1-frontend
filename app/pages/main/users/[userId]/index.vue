<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold uppercase tracking-tight">Detalles del Usuario</h1>
      <div
        class="flex items-center gap-2"
        :class="{ 'pointer-events-none opacity-50': status === 'pending' }"
      >
        <Button as-child variant="secondary" size="icon">
          <NuxtLink :to="`/main/users/`">
            <Icon name="lucide:arrow-left" />
          </NuxtLink>
        </Button>
        <Button as-child>
          <NuxtLink :to="`/main/users/${userId}/edit`">
            <Icon name="lucide:pencil" class="inline mr-1" />
            Editar
          </NuxtLink>
        </Button>
        <Button
          variant="outline"
          @click="handleToggleUserStatus(userId)"
        >
          <Icon name="lucide:power" class="inline mr-1" />
          {{ userData?.active ? 'Desactivar' : 'Activar' }}
        </Button>
        <Button
          variant="outline"
          @click="handleResendOnboardingEmail(userId)"
          :disabled="userData?.onboardingCompleted"
        >
          <Icon name="lucide:mail" class="inline mr-1" />
          Reenviar Correo de Activación
        </Button>
      </div>
    </div>

    <!-- Skeleton -->
    <div v-if="status === 'pending'" class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Skeleton class="h-40 rounded-xl" />
      <Skeleton class="h-40 rounded-xl" />
      <Skeleton class="h-40 rounded-xl" />
    </div>

    <!-- Content -->
    <template v-else-if="userData">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Identity card -->
        <Card class="md:col-span-2">
          <CardHeader class="pb-3">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-4">
                <div class="h-14 w-14 rounded-full bg-muted flex items-center justify-center text-xl font-bold text-muted-foreground select-none">
                  {{ userData.employee.firstName[0] }}{{ userData.employee.lastName[0] }}
                </div>
                <div>
                  <CardTitle class="text-xl">
                    {{ userData.employee.firstName }} {{ userData.employee.lastName }}
                  </CardTitle>
                  <CardDescription class="mt-0.5">@{{ userData.username }}</CardDescription>
                </div>
              </div>
              <div class="flex flex-col items-end gap-1.5">
                <Badge :variant="userData.active ? 'default' : 'secondary'">
                  <Icon :name="userData.active ? 'lucide:circle-check' : 'lucide:circle-x'" class="mr-1 h-3 w-3" />
                  {{ userData.active ? 'Activo' : 'Inactivo' }}
                </Badge>
                <Badge :variant="userData.onboardingCompleted ? 'outline' : 'destructive'">
                  <Icon :name="userData.onboardingCompleted ? 'lucide:shield-check' : 'lucide:shield-alert'" class="mr-1 h-3 w-3" />
                  {{ userData.onboardingCompleted ? 'Onboarding completado' : 'Pendiente de activación' }}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent class="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-0.5">
              <p class="text-xs uppercase tracking-widest text-muted-foreground font-medium">Correo electrónico</p>
              <p class="text-sm font-medium flex items-center gap-1.5">
                <Icon name="lucide:mail" class="h-4 w-4 text-muted-foreground" />
                {{ userData.email }}
              </p>
            </div>
            <div class="space-y-0.5">
              <p class="text-xs uppercase tracking-widest text-muted-foreground font-medium">ID de usuario</p>
              <p class="text-sm font-medium text-muted-foreground"># {{ userData.id }}</p>
            </div>
          </CardContent>
        </Card>

        <!-- Role card -->
        <Card>
          <CardHeader class="pb-3">
            <CardTitle class="text-sm uppercase tracking-widest font-medium text-muted-foreground">Rol asignado</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent class="pt-4 space-y-3">
            <div class="flex items-center gap-3">
              <div class="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon name="lucide:shield" class="h-5 w-5 text-primary" />
              </div>
              <div>
                <p class="text-sm font-semibold leading-tight">{{ userData.role.name }}</p>
                <p class="text-xs text-muted-foreground font-mono mt-0.5">{{ userData.role.code }}</p>
              </div>
            </div>
            <div class="space-y-0.5">
              <p class="text-xs uppercase tracking-widest text-muted-foreground font-medium">ID de rol</p>
              <p class="text-sm text-muted-foreground"># {{ userData.role.id }}</p>
            </div>
          </CardContent>
        </Card>

        <!-- Employee card -->
        <Card class="md:col-span-3">
          <CardHeader class="pb-3">
            <CardTitle class="text-sm uppercase tracking-widest font-medium text-muted-foreground">Datos del empleado</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent class="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div class="space-y-0.5">
              <p class="text-xs uppercase tracking-widest text-muted-foreground font-medium">Nombre</p>
              <p class="text-sm font-medium">{{ userData.employee.firstName }}</p>
            </div>
            <div class="space-y-0.5">
              <p class="text-xs uppercase tracking-widest text-muted-foreground font-medium">Apellido</p>
              <p class="text-sm font-medium">{{ userData.employee.lastName }}</p>
            </div>
            <div class="space-y-0.5">
              <p class="text-xs uppercase tracking-widest text-muted-foreground font-medium">Tarifa por hora</p>
              <p class="text-sm font-semibold text-primary">
                ${{ userData.employee.hourlyRate.toFixed(2) }} / hr
              </p>
            </div>
            <div class="space-y-0.5">
              <p class="text-xs uppercase tracking-widest text-muted-foreground font-medium">ID empleado</p>
              <p class="text-sm text-muted-foreground"># {{ userData.employee.id }}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </template>

    <!-- Error -->
    <div v-else class="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
      <Icon name="lucide:user-x" class="h-10 w-10" />
      <p class="text-sm">No se encontró el usuario.</p>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { Button } from "~/components/ui/button";
  import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
  import { Badge } from "~/components/ui/badge";
  import { Separator } from "~/components/ui/separator";
  import { Skeleton } from "~/components/ui/skeleton";
  import { usersApi } from "~/lib/api/users";
  import { usersMutations } from "~/lib/mutations/users";

  const route = useRoute();
  const userId = Number(route.params.userId);

  const {
    data: userData,
    status,
    refresh,
  } = useAsyncData(`user-${userId}`, () => usersApi.getById(Number(userId)));

  const { mutate: handleResendOnboardingEmail } =
    usersMutations.useResendOnboardingEmail({
      onComplete: () => {
        refresh();
      },
    });

  const { mutate: handleToggleUserStatus } = usersMutations.useToggleUserStatus(
    {
      onComplete: () => {
        refresh();
      },
    },
  );

  definePageMeta({
    layout: "app",
  });
</script>
<style scoped></style>
