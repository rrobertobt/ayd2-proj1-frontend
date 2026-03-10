<template>
  <div class="min-h-screen grid place-content-center bg-muted">
    <Card class="w-sm">
      <CardHeader>
        <Icon name="lucide:lock-keyhole" size="20" />
        <CardTitle>Restablecer contraseña</CardTitle>
        <CardDescription>
          Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta.
        </CardDescription>
      </CardHeader>

      <template v-if="!resetToken">
        <CardContent>
          <div class="flex flex-col items-center gap-3 py-4 text-center text-muted-foreground">
            <Icon name="lucide:circle-alert" class="h-8 w-8" />
            <p class="text-sm">
              El enlace de recuperación es inválido o ha expirado. Por favor, solicita uno nuevo.
            </p>
          </div>
        </CardContent>
        <CardFooter class="pt-2">
          <Button class="w-full" as-child>
            <NuxtLink to="/forgot-password">Solicitar nuevo enlace</NuxtLink>
          </Button>
        </CardFooter>
      </template>

      <form v-else @submit.prevent="handleSubmit">
        <CardContent>
          <fieldset class="grid w-full items-center gap-4" :disabled="asyncStatus === 'loading'">
            <div class="flex flex-col space-y-1.5">
              <Label for="password">Nueva contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                v-model="form.password"
                required
              />
            </div>
            <div class="flex flex-col space-y-1.5">
              <Label for="confirmPassword">Confirmar nueva contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="********"
                v-model="form.confirmPassword"
                required
              />
            </div>
          </fieldset>
        </CardContent>
        <CardFooter class="flex flex-col gap-2 pt-4">
          <Button class="w-full" type="submit" :disabled="asyncStatus === 'loading'">
            Restablecer contraseña
          </Button>
          <Button class="w-full" variant="ghost" as-child>
            <NuxtLink to="/login">Volver al inicio de sesión</NuxtLink>
          </Button>
        </CardFooter>
      </form>
    </Card>
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
import { authMutations } from "~/lib/mutations/auth";

definePageMeta({
  layout: "auth",
});

const route = useRoute();
const resetToken = route.query.token as string | undefined;

const form = reactive({
  password: "",
  confirmPassword: "",
});

const { mutate: resetPassword, asyncStatus } = authMutations.useResetPassword({
  onComplete: () => {
    navigateTo("/login");
  },
});

const handleSubmit = () => {
  if (!resetToken) return;
  resetPassword({ token: resetToken, ...form });
};
</script>
