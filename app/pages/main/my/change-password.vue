<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="space-y-2">
      <h1 class="text-2xl font-bold uppercase tracking-tight">Cambiar contraseña</h1>
      <Button as-child variant="secondary">
        <NuxtLink to="/main/my/profile">
          <Icon name="lucide:arrow-left" />
            Volver a mi perfil
        </NuxtLink>
      </Button>
    </div>

    <div class="max-w-md">
      <Card class="border-none shadow-none">
        <CardHeader class="pb-3">
          <CardTitle class="text-base flex items-center gap-2">
            <Icon name="lucide:lock-keyhole" class="h-4 w-4" />
            Nueva contraseña
          </CardTitle>
          <CardDescription>
            Debes ingresar tu contraseña actual para confirmar el cambio.
          </CardDescription>
        </CardHeader>
        <form @submit.prevent="handleSubmit">
          <CardContent class="pt-4">
            <fieldset class="grid w-full items-center gap-4" :disabled="asyncStatus === 'loading'">
              <div class="flex flex-col space-y-1.5">
                <Label for="currentPassword">Contraseña actual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="********"
                  v-model="form.currentPassword"
                  required
                />
              </div>
              <div class="flex flex-col space-y-1.5">
                <Label for="newPassword">Nueva contraseña</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="********"
                  v-model="form.newPassword"
                  required
                />
              </div>
              <div class="flex flex-col space-y-1.5">
                <Label for="confirmNewPassword">Confirmar nueva contraseña</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  placeholder="********"
                  v-model="form.confirmNewPassword"
                  required
                />
              </div>
            </fieldset>
          </CardContent>
          <CardFooter class="pt-2">
            <Button type="submit" :disabled="asyncStatus === 'loading'" class="w-full">
              Actualizar contraseña
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { usersMutations } from "~/lib/mutations/users";

definePageMeta({
  layout: "app",
});

const form = reactive({
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
});

const { mutate: changePassword, asyncStatus } = usersMutations.useChangePassword({
  onComplete: () => {
    form.currentPassword = "";
    form.newPassword = "";
    form.confirmNewPassword = "";
  },
});

const handleSubmit = () => {
  changePassword({ ...form });
};
</script>
