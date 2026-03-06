<template>
  <div class="min-h-screen grid place-content-center bg-muted">
    <Card class="w-sm">
      <CardHeader>
        <Icon name="lucide:circle-user-round" size="20" />
        <CardTitle>Iniciar Sesión</CardTitle>
        <CardDescription>
          Ingresa tus credenciales para acceder a la plataforma.
        </CardDescription>
      </CardHeader>
      <form @submit.prevent="handleLogin">
        <CardContent>
          <fieldset class="grid w-full items-center gap-4" :disabled="loading">
            <div class="flex flex-col space-y-1.5">
              <Label for="username">Nombre de usuario</Label>
              <Input id="username" type="text" v-model="credentials.username" />
            </div>
            <div class="flex flex-col space-y-1.5">
              <div class="flex items-center">
                <Label for="password">Contraseña</Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="********"
                v-model="credentials.password"
              />
            </div>
          </fieldset>
        </CardContent>
        <CardFooter class="flex flex-col gap-2 pt-4">
          <Button
            class="w-full"
            icon="lucide:arrow-big-right"
            type="submit"
            :disabled="loading"
          >
            Continuar
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
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";

  import { useSessionStore } from "~/stores/session";

  const sessionStore = useSessionStore();
  const { login } = sessionStore;
  const { loading } = storeToRefs(sessionStore);

  const credentials = reactive({
    username: "",
    password: "",
  });

  const handleLogin = async () => {
    await login(credentials);
  };
  definePageMeta({
    layout: "auth",
  });
</script>
<style scoped></style>
