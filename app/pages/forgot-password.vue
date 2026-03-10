<template>
  <div class="min-h-screen grid place-content-center bg-muted">
    <Card class="w-sm">
      <CardHeader>
        <Icon name="lucide:key-round" size="20" />
        <CardTitle>Recuperar contraseña</CardTitle>
        <CardDescription>
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </CardDescription>
      </CardHeader>
      <form @submit.prevent="handleSubmit">
        <CardContent>
          <fieldset class="grid w-full items-center gap-4" :disabled="asyncStatus === 'loading'">
            <div class="flex flex-col space-y-1.5">
              <Label for="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@ejemplo.com"
                v-model="form.email"
                required
              />
            </div>
          </fieldset>
        </CardContent>
        <CardFooter class="flex flex-col gap-2 pt-4">
          <Button class="w-full" type="submit" :disabled="asyncStatus === 'loading'">
            Enviar enlace de recuperación
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

const form = reactive({ email: "" });

const { mutate: forgotPassword, asyncStatus } = authMutations.useForgotPassword({
  onComplete: () => {
    form.email = "";
  },
});

const handleSubmit = () => {
  forgotPassword({ email: form.email });
};
</script>
