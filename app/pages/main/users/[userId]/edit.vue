<template>
  <div>
    <h1 class="text-2xl font-bold mb-4 uppercase">Editar Usuario</h1>
    <div class="space-y-2">
      <Button as-child variant="secondary">
        <NuxtLink to="/main/users">
          <Icon name="lucide:arrow-left" class="inline mr-1" />
          Volver a la lista
        </NuxtLink>
      </Button>
    </div>
    <div v-if="status === 'pending'" class="mt-4 text-muted-foreground">Cargando...</div>
    <div v-else-if="status === 'error'" class="mt-4 text-destructive">Error al cargar el usuario.</div>
    <UserForm
      v-else
      hide-role
      hide-password
      :initial-values="initialValues"
      :loading="asyncStatus === 'loading'"
      @submit="onSubmit"
    />
  </div>
</template>
<script setup lang="ts">
  import { Button } from "~/components/ui/button";
  import UserForm from "~/components/users/forms/UserForm.vue";
  import { usersApi, type UpdateUserRequest } from "~/lib/api/users";
  import { toast } from "vue-sonner";

  definePageMeta({
    layout: "app",
  });

  const route = useRoute();
  const userId = Number(route.params.userId);

  const { data: user, status } = useAsyncData(() => usersApi.getById(userId));

  const initialValues = computed(() =>
    user.value
      ? {
          username: user.value.username,
          email: user.value.email,
          roleId: user.value.role.id,
          employee: {
            firstName: user.value.employee.firstName,
            lastName: user.value.employee.lastName,
            hourlyRate: user.value.employee.hourlyRate,
          },
        }
      : undefined
  );

  const { mutate, asyncStatus } = useMutation({
    mutation: (values: UpdateUserRequest) => usersApi.update(userId, values),
    onSuccess: () => {
      toast.success("Usuario actualizado exitosamente");
      navigateTo("/main/users");
    },
    onError: (error) => {
      toast.error("Error al actualizar el usuario", {
        description: error?.data?.message || "Ocurrió un error inesperado",
      });
    },
  });

  function onSubmit(values: { username: string; email: string; roleId?: number; password?: string; employee: { firstName: string; lastName: string; hourlyRate: number } }) {
    mutate({
      username: values.username,
      email: values.email,
      employee: values.employee,
    });
  }
</script>
<style scoped></style>
