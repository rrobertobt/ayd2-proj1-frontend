<template>
  <div>
    <h1 class="text-2xl font-bold mb-4 uppercase">Crear Usuario</h1>
    <div class="space-y-2">
      <Button as-child variant="secondary">
        <NuxtLink to="/main/users">
          <Icon name="lucide:arrow-left" class="inline mr-1" />
          Volver a la lista
        </NuxtLink>
      </Button>
    </div>
    <UserForm @submit="mutate" :loading="asyncStatus === 'loading'" />
  </div>
</template>
<script setup lang="ts">
  import { Button } from "~/components/ui/button";
  import UserForm from "~/components/users/forms/UserForm.vue";
  import { usersApi, type CreateUserRequest } from "~/lib/api/users";
  import { toast } from "vue-sonner";

  const { mutate, asyncStatus } = useMutation({
    mutation: (values: CreateUserRequest) => usersApi.create(values),
    onSuccess: () => {
      toast.success("Usuario creado exitosamente");
      navigateTo("/main/users");
    },
    onError: (error) => {
      toast.error("Error al crear el usuario", {
        description: error?.data?.message || "Ocurrió un error inesperado",
      });
    },
  });
  definePageMeta({
    layout: "app",
  });
</script>
<style scoped></style>
