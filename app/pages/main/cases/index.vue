<template>
  <div>
    <h1 class="text-2xl font-bold mb-4 uppercase">Casos</h1>

    <div class="pt-2 pb-4 rounded-lg">
      <CaseFilters :loading="status === 'pending'" />
    </div>

    <div v-if="data">
      <ItemsIterator
        :items="data.content"
        :totalElements="data.totalElements"
        :totalPages="data.totalPages"
        :paginationState="paginationOptions"
        @pagination-change="($event) => (paginationOptions = $event)"
        class="py-4"
      >
        <template #default="{ item }">
          <Card
            class="hover:bg-secondary/50 transition-colors"
            :class="{ 'border-red-200': item.overdue }"
          >
            <CardHeader class="pb-2">
              <div class="flex items-start justify-between gap-2 flex-wrap">
                <CardTitle class="text-base">{{ item.title }}</CardTitle>
                <div class="flex gap-1 flex-wrap">
                  <Badge v-if="item.overdue" class="bg-red-100 text-red-700 text-xs">Vencido</Badge>
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
            <CardContent class="text-sm space-y-2">
              <div class="flex flex-wrap gap-4 text-muted-foreground">
                <span>
                  <Icon name="lucide:folder" class="inline mr-1" />
                  {{ item.projectName }}
                </span>
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
              <div class="w-full bg-secondary rounded-full h-1.5">
                <div
                  class="h-1.5 rounded-full transition-all"
                  :class="item.progressPercent === 100 ? 'bg-green-500' : 'bg-primary'"
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
        </template>
      </ItemsIterator>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { NuxtLink } from "#components";
  import ItemsIterator from "~/components/partials/iterator/ItemsIterator.vue";
  import { Button } from "~/components/ui/button";
  import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import Badge from "~/components/ui/badge/Badge.vue";
  import CaseFilters from "~/components/cases/CaseFilters.vue";
  import { casesApi } from "~/lib/api/cases";

  const route = useRoute();

  const { data, status } = await useAsyncData(
    "cases",
    () =>
      casesApi.list({
        page: route.query.page ? Number(route.query.page) : undefined,
        status: route.query.status as string | undefined,
        sortBy: route.query.sortBy as string | undefined,
        sortDir: route.query.sortDir as string | undefined,
      }),
    { watch: [() => route.query] },
  );

  const caseStatusLabel: Record<string, string> = {
    OPEN: 'Abierto',
    IN_PROGRESS: 'En progreso',
    COMPLETED: 'Completado',
    CANCELED: 'Cancelado',
  };

  const paginationOptions = computed({
    get: () => ({
      pageIndex: route.query.page ? Number(route.query.page) : 0,
      pageSize: route.query.size ? Number(route.query.size) : 10,
    }),
    set: (value) => {
      navigateTo({
        query: {
          ...route.query,
          page: value.pageIndex,
          size: value.pageSize,
        },
      });
    },
  });

  definePageMeta({
    layout: "app",
  });
</script>
<style scoped></style>
