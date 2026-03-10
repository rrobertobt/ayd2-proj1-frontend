<template>
  <div class="min-h-screen grid place-content-center bg-muted">
    <Card class="w-sm">
      <CardHeader>
        <Icon name="lucide:star" size="20" />
        <CardTitle>Bienvenid@ a Code n'Bugs Tracking</CardTitle>
        <CardDescription>
          Ingresa una contraseña para asegurar tu cuenta y comenzar a usar la
          plataforma.
        </CardDescription>
      </CardHeader>
      <form @submit.prevent="handleOnboarding">
        <CardContent>
          <fieldset class="grid w-full items-center gap-4" :disabled="loading">
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
            <div class="flex flex-col space-y-1.5">
              <div class="flex items-center">
                <Label for="confirmPassword">Confirmar contraseña</Label>
              </div>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="********"
                v-model="credentials.confirmPassword"
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
  import { toast } from "vue-sonner";

  const route = useRoute();
  const onboardingToken = route.query.token as string | undefined;

  const credentials = reactive({
    password: "",
    confirmPassword: "",
  });

  const sessionStore = useSessionStore();
  const { onboarding } = sessionStore;
  const { loading } = storeToRefs(sessionStore);

  const handleOnboarding = async () => {
    if (!onboardingToken) {
      toast.error(
        "Parece que tu enlace de onboarding es inválido o ha expirado. Por favor, contacta al administrador para obtener un nuevo enlace."
      );
      return;
    }
    await onboarding({ ...credentials, token: onboardingToken });
  };

  definePageMeta({
    layout: "auth",
  });
</script>
<style scoped></style>
