<template>
  <div>
    <h1 class="text-2xl font-bold mb-4 uppercase">Proyectos</h1>
    <div class="space-y-2">
      <h2 class="uppercase text-xs tracking-widest font-light">Acciones:</h2>
      <Button as-child>
        <NuxtLink to="/main/projects/new">
          <Icon name="lucide:plus" class="inline mr-1" />
          Crear
        </NuxtLink>
      </Button>
    </div>
    <div class="pt-4 rounded-lg">
      <ProjectFilters :loading="status === 'pending'" />
    </div>
    <div v-if="data">
      <ItemsIterator
        :items="data?.content"
        :totalElements="data.totalElements"
        :totalPages="data.totalPages"
        :paginationState="paginationOptions"
        @pagination-change="($event) => (paginationOptions = $event)"
        class="py-4"
      >
        <template #default="{ item }">
          <Card class="hover:bg-secondary/50 transition-colors">
            <CardHeader>
              <CardTitle>{{ item.name }}</CardTitle>
              <CardDescription>{{ item.description }}</CardDescription>
            </CardHeader>
            <CardContent class="text-sm">
              <div class="space-y-2">
                <p>
                  <span class="font-medium pr-1">Estado:</span>
                  <Badge
                    :class="{
                      'bg-green-100 text-green-700': item.status === 'ACTIVE',
                      'bg-red-100 text-red-700': item.status === 'INACTIVE',
                    }"
                    >{{ item.status }}</Badge
                  >
                </p>
                <p>
                  <span class="font-medium pr-1">Registrado el:</span>
                  <span class="text-muted-foreground">
                    {{ new Date(item.createdAt).toLocaleDateString() }}
                  </span>
                </p>
                <p>
                  <span class="font-medium pr-1">Administrador actual:</span>
                  <span
                    v-if="!item.currentAdmin"
                    class="text-red-700 font-semibold"
                  >
                    Sin asignar
                  </span>
                  <span v-else
                    >{{ item.currentAdmin.firstName }}
                    {{ item.currentAdmin.lastName }}</span
                  >
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button icon="lucide:arrow-right" variant="outline" size="sm">
                Ver detalles
              </Button>
              <Button icon="lucide:power-off" variant="outline" size="sm" @click="toggleProjectStatus(item.id)">
                {{ item.status === "ACTIVE" ? "Desactivar" : "Activar" }}
              </Button>
            </CardFooter>
          </Card>
        </template>
      </ItemsIterator>
    </div>
  </div>
</template>
<script setup lang="ts">
  import ItemsIterator from "~/components/partials/iterator/ItemsIterator.vue";
  import { Button } from "~/components/ui/button";
  import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { projectsApi } from "~/lib/api/projects";
  import Badge from "~/components/ui/badge/Badge.vue";
  import ProjectFilters from "~/components/projects/ProjectFilters.vue";
import { projectsMutations } from "~/lib/mutations/projects";

  const route = useRoute();

  const { data, status, refresh } = await useAsyncData(
    "projects",
    () =>
      projectsApi.list({
        page: route.query.page ? Number(route.query.page) : undefined,
        ...route.query,
      }),
    { watch: [() => route.query] },
  );

  const { mutate: toggleProjectStatus } = projectsMutations.useToggleProjectStatus({
    onComplete: () => {
      refresh();
    },
  });

  const paginationOptions = computed({
    get: () => ({
      pageIndex: route.query.page ? Number(route.query.page) : 0,
      pageSize: route.query.limit ? Number(route.query.limit) : 10,
    }),
    set: (value) => {
      navigateTo({
        query: {
          ...route.query,
          page: value.pageIndex,
          limit: value.pageSize,
        },
      });
    },
  });

  definePageMeta({
    layout: "app",
  });
</script>
<style scoped></style>
