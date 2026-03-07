<template>
  <DropdownMenu @select.prevent>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" class="w-8 h-8 p-0">
        <span class="sr-only">Open menu</span>
        <Icon name="lucide:ellipsis" class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel class="uppercase font-light tracking-widest"
        >Acciones</DropdownMenuLabel
      >
      <DropdownMenuItem as-child>
        <NuxtLink :to="`/main/users/${userId}`">
          <Icon name="lucide:eye" class="inline mr-1" />
          Ver
        </NuxtLink>
      </DropdownMenuItem>
      <DropdownMenuItem @click="handleToggleUserStatus(userId)">
        <Icon name="lucide:power-off" class="inline mr-1" />
        Activar/Desactivar
      </DropdownMenuItem>
      <DropdownMenuItem
        @click="handleResendOnboardingEmail(userId)"
        :disabled="props.active"
      >
        <Icon name="lucide:mail" class="inline mr-1" />
        Reenviar Correo de Activación
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
<script setup lang="ts">
    import { toast } from "vue-sonner";
    import { Button } from "~/components/ui/button";
    import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuLabel,
      DropdownMenuTrigger,
    } from "~/components/ui/dropdown-menu";
    import { usersApi } from "~/lib/api/users";
  import { usersMutations } from "~/lib/mutations/users";
    import { fetchErrorHandler } from "~/lib/utils";

    const props = defineProps({
      userId: {
        type: Number,
        required: true,
      },
      active: {
        type: Boolean,
        required: true,
      },
    });

    const emit = defineEmits(["action-complete"]);

    const {mutate: handleResendOnboardingEmail} = usersMutations.useResendOnboardingEmail({
      onComplete: () => {
        emit("action-complete");
      },
    })

    const {mutate: handleToggleUserStatus} = usersMutations.useToggleUserStatus({
      onComplete: () => {
        emit("action-complete");
      },
    })
</script>
<style scoped></style>
