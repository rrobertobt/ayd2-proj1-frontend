<template>
  <div>
    <!-- Back -->
    <div class="flex items-center gap-3 mb-2">
      <Button variant="ghost" size="sm" as-child>
        <NuxtLink :to="`/main/projects/${projectId}`">
          <Icon name="lucide:arrow-left" class="mr-1" />
          Volver a proyecto
        </NuxtLink>
      </Button>
    </div>

    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold uppercase">Casos</h1>
      <Button v-if="session?.role?.code === 'PROJECT_ADMIN'" as-child>
        <NuxtLink :to="`/main/projects/${projectId}/cases/new`">
          <Icon name="lucide:plus" class="inline mr-1" />
          Nuevo caso
        </NuxtLink>
      </Button>
    </div>

    <div v-if="pending" class="flex items-center gap-2 text-muted-foreground py-8">
      <Icon name="lucide:loader-circle" class="animate-spin" />
      Cargando...
    </div>

    <div v-else-if="!cases?.length" class="text-muted-foreground text-sm py-8 border rounded-lg text-center">
      No hay casos registrados para este proyecto.
    </div>

    <div v-else class="grid grid-cols-1 gap-3 pt-2">
      <Card
        v-for="item in cases"
        :key="item.id"
        class="hover:bg-secondary/50 transition-colors"
        :class="{ 'border-red-200': item.overdue }"
      >
        <CardHeader class="pb-2">
          <div class="flex items-start justify-between gap-2 flex-wrap">
            <CardTitle class="text-base">{{ item.title }}</CardTitle>
            <div class="flex gap-1 flex-wrap">
              <Badge
                v-if="item.overdue"
                class="bg-red-100 text-red-700 text-xs"
              >
                Vencido
              </Badge>
              <Badge
                :class="{
                  'bg-blue-100 text-blue-700': item.status === 'OPEN',
                  'bg-yellow-100 text-yellow-700': item.status === 'IN_PROGRESS',
                  'bg-green-100 text-green-700': item.status === 'COMPLETED',
                  'bg-gray-100 text-gray-600': item.status === 'CANCELED',
                }"
              >
                {{ caseStatusLabel[item.status] }}
              </Badge>
              <Badge variant="secondary">{{ item.caseTypeName }}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent class="text-sm space-y-1">
          <div class="flex items-center gap-4 text-muted-foreground">
            <span>
              <Icon name="lucide:calendar" class="inline mr-1" />
              Vence: {{ new Date(item.dueDate).toLocaleDateString("es-GT") }}
            </span>
            <span>
              <Icon name="lucide:bar-chart-2" class="inline mr-1" />
              {{ item.progressPercent }}% completado
            </span>
          </div>
          <!-- Progress bar -->
          <div class="w-full bg-secondary rounded-full h-1.5 mt-1">
            <div
              class="h-1.5 rounded-full transition-all"
              :class="item.progressPercent === 100 ? 'bg-green-500' : 'bg-primary'"
              :style="{ width: `${item.progressPercent}%` }"
            />
          </div>
        </CardContent>
        <CardFooter class="flex gap-2 flex-wrap pt-2">
          <Button variant="outline" size="sm" as-child>
            <NuxtLink :to="`/main/projects/${projectId}/cases/${item.id}`">
              <Icon name="lucide:arrow-right" class="mr-1" />
              Ver detalle
            </NuxtLink>
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { NuxtLink } from "#components";
  import { Button } from "~/components/ui/button";
  import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import Badge from "~/components/ui/badge/Badge.vue";
  import { casesApi } from "~/lib/api/cases";

  const route = useRoute();
  const projectId = computed(() => Number(route.params.projectId));

  const sessionStore = useSessionStore();
  const { session, roleChecker } = storeToRefs(sessionStore);

  const { data: cases, pending } = await useAsyncData(
    `project-cases-${projectId.value}`,
    () => casesApi.listByProject(projectId.value),
  );

  const caseStatusLabel: Record<string, string> = {
    OPEN: 'Abierto',
    IN_PROGRESS: 'En progreso',
    COMPLETED: 'Completado',
    CANCELED: 'Cancelado',
  };

  definePageMeta({
    layout: "app",
  });
</script>
<style scoped></style>