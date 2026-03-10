<template>
  <div>
    <h1 class="text-2xl font-bold mb-1 uppercase">Dashboard</h1>
    <p class="text-muted-foreground mb-6">Resumen de alertas y actividad reciente.</p>

    <!-- Alerts section -->
    <div class="mb-2 flex items-center justify-between">
      <h2 class="text-lg font-semibold flex items-center gap-2">
        <Icon name="lucide:bell" class="text-yellow-500" />
        Alertas de casos
      </h2>
      <Button variant="ghost" size="sm" @click="refreshAlerts" :disabled="alertsStatus === 'pending'">
        <Icon name="lucide:refresh-cw" :class="{ 'animate-spin': alertsStatus === 'pending' }" />
      </Button>
    </div>

    <div v-if="alertsStatus === 'pending'" class="flex items-center gap-2 text-muted-foreground py-6">
      <Icon name="lucide:loader-circle" class="animate-spin" />
      Cargando alertas...
    </div>

    <div
      v-else-if="!alerts?.length"
      class="text-muted-foreground text-sm py-6 border rounded-lg text-center"
    >
      <Icon name="lucide:check-circle-2" class="inline mr-1 text-green-500" />
      No hay casos próximos a vencer ni vencidos.
    </div>

    <div v-else class="space-y-3">
      <Card
        v-for="item in alerts"
        :key="item.id"
        class="hover:bg-secondary/50 transition-colors"
        :class="item.overdue ? 'border-red-300 bg-red-50/30' : 'border-yellow-300 bg-yellow-50/30'"
      >
        <CardHeader class="pb-2">
          <div class="flex items-start justify-between gap-2 flex-wrap">
            <CardTitle class="text-base">{{ item.title }}</CardTitle>
            <div class="flex gap-1 flex-wrap">
              <Badge v-if="item.overdue" class="bg-red-100 text-red-700 text-xs">
                <Icon name="lucide:alert-circle" class="inline mr-1" />
                Vencido
              </Badge>
              <Badge v-else class="bg-yellow-100 text-yellow-700 text-xs">
                <Icon name="lucide:clock" class="inline mr-1" />
                Próximo a vencer
              </Badge>
              <Badge
                :class="{
                  'bg-blue-100 text-blue-700': item.status === 'OPEN',
                  'bg-yellow-100 text-yellow-700': item.status === 'IN_PROGRESS',
                }"
              >
                {{ caseStatusLabel[item.status] }}
              </Badge>
              <Badge variant="secondary">{{ item.caseTypeName }}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent class="text-sm space-y-2">
          <div class="flex flex-wrap gap-4 text-muted-foreground">
            <span>
              <Icon name="lucide:folder" class="inline mr-1" />
              {{ item.projectName }}
            </span>
            <span :class="item.overdue ? 'text-red-600 font-medium' : 'text-yellow-600 font-medium'">
              <Icon name="lucide:calendar" class="inline mr-1" />
              Vence: {{ new Date(item.dueDate).toLocaleDateString("es-GT") }}
            </span>
            <span>
              <Icon name="lucide:bar-chart-2" class="inline mr-1" />
              {{ item.progressPercent }}% completado
            </span>
          </div>
          <div class="w-full bg-secondary rounded-full h-1.5">
            <div
              class="h-1.5 rounded-full transition-all"
              :class="item.overdue ? 'bg-red-500' : 'bg-yellow-400'"
              :style="{ width: `${item.progressPercent}%` }"
            />
          </div>
        </CardContent>
        <CardFooter class="pt-2">
          <Button variant="outline" size="sm" as-child>
            <NuxtLink :to="`/main/projects/${item.projectId}/cases/${item.id}`">
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

const { data: alerts, status: alertsStatus, refresh: refreshAlerts } = await useAsyncData(
  "case-alerts",
  () => casesApi.listAlerts(),
);

const caseStatusLabel: Record<string, string> = {
  OPEN: "Abierto",
  IN_PROGRESS: "En progreso",
};

definePageMeta({
  layout: "app",
});
</script>
