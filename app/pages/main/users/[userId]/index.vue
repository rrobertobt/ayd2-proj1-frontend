<template>
  <div>
    <h1 class="text-2xl font-bold mb-4 uppercase">Detalles del Usuario</h1>
    <div
      class="space-x-2 space-y-2"
      :class="{
        'pointer-events-none opacity-50': status === 'pending',
      }"
    >
      <h2 class="uppercase text-xs tracking-widest font-light">Acciones:</h2>
      <Button as-child variant="secondary">
        <NuxtLink :to="`/main/users/`">
          <Icon name="lucide:arrow-left" />
        </NuxtLink>
      </Button>
      <Button as-child>
        <NuxtLink :to="`/main/users/${userId}/edit`">
          <Icon name="lucide:edit" class="inline mr-1" />
          Editar
        </NuxtLink>
      </Button>
      <Button @click="handleToggleUserStatus(userId)">
        <Icon name="lucide:power-off" class="inline mr-1" />
        Activar/Desactivar
      </Button>
      <Button
        @click="handleResendOnboardingEmail(userId)"
        :disabled="userData?.active"
      >
        <Icon name="lucide:mail" class="inline mr-1" />
        Reenviar Correo de Activación
      </Button>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { Button } from "~/components/ui/button";
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
