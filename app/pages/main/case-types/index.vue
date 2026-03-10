<template>
  <div>
    <h1 class="text-2xl font-bold mb-4 uppercase">Tipos de caso</h1>
    <div class="space-y-2">
      <h2 class="uppercase text-xs tracking-widest font-light">Acciones:</h2>
      <Button @click="openCreateDialog">
        <Icon name="lucide:plus" class="inline mr-1" />
        Crear
      </Button>
    </div>
    <div class="pt-4 rounded-lg">
      <CaseTypeFilters :loading="status === 'pending'" />
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
          <Card class="hover:bg-secondary/50 transition-colors flex flex-col">
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                {{ item.name }}
                <Badge
                  :class="{
                    'bg-green-100 text-green-700': item.active,
                    'bg-red-100 text-red-700': !item.active,
                  }"
                >
                  {{ item.active ? "Activo" : "Inactivo" }}
                </Badge>
              </CardTitle>
              <CardDescription>{{
                item.description || "Sin descripción"
              }}</CardDescription>
            </CardHeader>
            <CardContent class="text-sm flex-1">
              <p class="text-muted-foreground">
                <span class="font-medium text-foreground pr-1">Etapas:</span>
                {{ item.stages.length }}
              </p>
              <div v-if="item.stages.length" class="mt-2 flex flex-wrap gap-1">
                <Badge
                  v-for="stage in item.stages"
                  :key="stage.id"
                  variant="secondary"
                  class="text-xs"
                >
                  {{ stage.stageOrder }}. {{ stage.name }}
                </Badge>
              </div>
              <p v-else class="text-muted-foreground mt-1 text-xs">
                Sin etapas configuradas
              </p>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="outline" as-child>
                <NuxtLink :to="`/main/case-types/${item.id}`">
                  <Icon name="lucide:list-check" />
                  Ver / Gestionar etapas
                </NuxtLink>
              </Button>
              <Button
                icon="lucide:pencil"
                variant="outline"
                size="sm"
                @click="openEditDialog(item)"
              >
                Editar
              </Button>
            </CardFooter>
          </Card>
        </template>
      </ItemsIterator>
    </div>

    <CaseTypeFormDialog
      v-model:open="dialogOpen"
      :case-type="selectedCaseType"
      @success="refresh"
    />
  </div>
</template>

<script setup lang="ts">
  import ItemsIterator from "~/components/partials/iterator/ItemsIterator.vue";
  import { Button } from "~/components/ui/button";
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import Badge from "~/components/ui/badge/Badge.vue";
  import CaseTypeFilters from "~/components/case-types/CaseTypeFilters.vue";
  import CaseTypeFormDialog from "~/components/case-types/CaseTypeFormDialog.vue";
  import { caseTypesApi } from "~/lib/api/case-types";
  import type { CaseTypeItemResponse } from "~/lib/api/case-types";

  const route = useRoute();

  const { data, status, refresh } = await useAsyncData(
    "case-types",
    () =>
      caseTypesApi.list({
        page: route.query.page ? Number(route.query.page) : undefined,
        ...route.query,
      }),
    { watch: [() => route.query] },
  );

  const dialogOpen = ref(false);
  const selectedCaseType = ref<CaseTypeItemResponse | undefined>(undefined);

  function openCreateDialog() {
    selectedCaseType.value = undefined;
    dialogOpen.value = true;
  }

  function openEditDialog(caseType: CaseTypeItemResponse) {
    selectedCaseType.value = caseType;
    dialogOpen.value = true;
  }

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
