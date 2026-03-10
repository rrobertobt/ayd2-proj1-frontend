<template>
  <div>
    <h1 class="text-2xl font-bold mb-4 uppercase">Proyectos</h1>
    <div class="space-y-2">
      <h2 class="uppercase text-xs tracking-widest font-light">Acciones:</h2>
      <Button @click="openCreateDialog">
        <Icon name="lucide:plus" class="inline mr-1" />
        Crear
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
                <span>
                  <span class="font-medium pr-1">Estado:</span>
                  <Badge
                    :class="{
                      'bg-green-100 text-green-700': item.status === 'ACTIVE',
                      'bg-red-100 text-red-700': item.status === 'INACTIVE',
                    }"
                    >{{ item.status }}</Badge
                  >
                </span>
                <p>
                  <span class="font-medium pr-1">Registrado el:</span>
                  <span class="text-muted-foreground">
                    {{ new Date(item.createdAt).toLocaleDateString("es-GT") }}
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
            <CardFooter class="flex flex-col items-start gap-3">
              <Button variant="outline" size="sm" as-child>
                <NuxtLink :to="`/main/projects/${item.id}`">
                  <Icon name="lucide:arrow-right" />
                  Ver detalles
                </NuxtLink>
              </Button>
              <div>
              <p class="text-muted-foreground text-xs uppercase tracking-widest pb-1.5">
                Otras acciones:
              </p>
                <Button
                  icon="lucide:pencil"
                  variant="outline"
                  size="sm"
                  @click="openEditDialog(item)"
                >
                </Button>
                <Button
                  icon="lucide:user-check"
                  variant="outline"
                  size="sm"
                  @click="openAssignAdminDialog(item)"
                >
                  Asignar admin
                </Button>
                <Button
                  icon="lucide:power-off"
                  variant="outline"
                  size="sm"
                  @click="toggleProjectStatus(item.id)"
                >
                  {{ item.status === "ACTIVE" ? "Desactivar" : "Activar" }}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </template>
      </ItemsIterator>
    </div>

    <ProjectFormDialog
      v-model:open="dialogOpen"
      :project="selectedProject"
      @success="refresh"
    />
    <AssignAdminDialog
      v-model:open="assignAdminDialogOpen"
      :project="selectedProject"
      @success="refresh"
    />
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
  import type { ProjectItemResponse } from "~/lib/api/projects";
  import Badge from "~/components/ui/badge/Badge.vue";
  import ProjectFilters from "~/components/projects/ProjectFilters.vue";
  import ProjectFormDialog from "~/components/projects/ProjectFormDialog.vue";
  import AssignAdminDialog from "~/components/projects/AssignAdminDialog.vue";
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

  const { mutate: toggleProjectStatus } =
    projectsMutations.useToggleProjectStatus({
      onComplete: () => {
        refresh();
      },
    });

  const dialogOpen = ref(false);
  const selectedProject = ref<ProjectItemResponse | undefined>(undefined);

  function openCreateDialog() {
    selectedProject.value = undefined;
    dialogOpen.value = true;
  }

  function openEditDialog(project: ProjectItemResponse) {
    selectedProject.value = project;
    dialogOpen.value = true;
  }

  const assignAdminDialogOpen = ref(false);

  function openAssignAdminDialog(project: ProjectItemResponse) {
    selectedProject.value = project;
    assignAdminDialogOpen.value = true;
  }

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
