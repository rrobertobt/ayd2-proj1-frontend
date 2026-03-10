<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold uppercase tracking-tight">Mi Perfil</h1>
      <Button as-child variant="outline">
        <NuxtLink to="/main/my/change-password">
          <Icon name="lucide:lock-keyhole" class="mr-1 h-4 w-4" />
          Cambiar contraseña
        </NuxtLink>
      </Button>
    </div>

    <template v-if="session">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Identity card -->
        <Card class="md:col-span-2">
          <CardHeader class="pb-3">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-4">
                <div class="h-14 w-14 rounded-full bg-muted flex items-center justify-center text-xl font-bold text-muted-foreground select-none">
                  {{ session.employee.firstName[0] }}{{ session.employee.lastName[0] }}
                </div>
                <div>
                  <CardTitle class="text-xl">
                    {{ session.employee.firstName }} {{ session.employee.lastName }}
                  </CardTitle>
                  <CardDescription class="mt-0.5">@{{ session.username }}</CardDescription>
                </div>
              </div>
              <Badge :variant="session.active ? 'default' : 'secondary'">
                <Icon :name="session.active ? 'lucide:circle-check' : 'lucide:circle-x'" class="mr-1 h-3 w-3" />
                {{ session.active ? 'Activo' : 'Inactivo' }}
              </Badge>
            </div>
          </CardHeader>
          <Separator />
          <CardContent class="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-0.5">
              <p class="text-xs uppercase tracking-widest text-muted-foreground font-medium">Correo electrónico</p>
              <p class="text-sm font-medium flex items-center gap-1.5">
                <Icon name="lucide:mail" class="h-4 w-4 text-muted-foreground" />
                {{ session.email }}
              </p>
            </div>
            <div class="space-y-0.5">
              <p class="text-xs uppercase tracking-widest text-muted-foreground font-medium">Nombre de usuario</p>
              <p class="text-sm font-medium flex items-center gap-1.5">
                <Icon name="lucide:user" class="h-4 w-4 text-muted-foreground" />
                {{ session.username }}
              </p>
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
                <p class="text-sm font-semibold leading-tight">{{ session.role.name }}</p>
                <p class="text-xs text-muted-foreground font-mono mt-0.5">{{ session.role.code }}</p>
              </div>
            </div>
            <div class="space-y-0.5">
              <p class="text-xs uppercase tracking-widest text-muted-foreground font-medium">Descripción</p>
              <p class="text-sm text-muted-foreground">{{ session.role.description }}</p>
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
              <p class="text-sm font-medium">{{ session.employee.firstName }}</p>
            </div>
            <div class="space-y-0.5">
              <p class="text-xs uppercase tracking-widest text-muted-foreground font-medium">Apellido</p>
              <p class="text-sm font-medium">{{ session.employee.lastName }}</p>
            </div>
            <div class="space-y-0.5">
              <p class="text-xs uppercase tracking-widest text-muted-foreground font-medium">Tarifa por hora</p>
              <p class="text-sm font-semibold text-primary">
                ${{ session.employee.hourlyRate.toFixed(2) }} / hr
              </p>
            </div>
            <div class="space-y-0.5">
              <p class="text-xs uppercase tracking-widest text-muted-foreground font-medium">ID empleado</p>
              <p class="text-sm text-muted-foreground"># {{ session.employee.id }}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";

definePageMeta({
  layout: 'app',
});

const { session } = storeToRefs(useSessionStore());
</script>
