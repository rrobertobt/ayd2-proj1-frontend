<template>
  <div>
    <!-- Back -->
    <div class="flex items-center gap-3 mb-1">
      <Button variant="ghost" size="sm" as-child>
        <NuxtLink :to="`/main/projects/`">
          <Icon name="lucide:arrow-left" class="mr-1" />
          Volver a proyectos
        </NuxtLink>
      </Button>
    </div>

    <div v-if="pending" class="flex items-center gap-2 text-muted-foreground py-8">
      <Icon name="lucide:loader-circle" class="animate-spin" />
      Cargando...
    </div>

    <template v-else-if="project">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <h1 class="text-2xl font-bold uppercase">{{ project.name }}</h1>
            <Badge
              :class="{
                'bg-green-100 text-green-700': project.status === 'ACTIVE',
                'bg-red-100 text-red-700': project.status === 'INACTIVE',
              }"
            >
              {{ project.status === 'ACTIVE' ? 'Activo' : 'Inactivo' }}
            </Badge>
          </div>
          <p class="text-muted-foreground mt-1">
            {{ project.description || 'Sin descripción' }}
          </p>
          <p class="text-xs text-muted-foreground mt-1">
            Creado el {{ new Date(project.createdAt).toLocaleDateString('es-GT') }}
          </p>
        </div>

        <div v-if="roleChecker.isSystemAdmin" class="flex gap-2 flex-wrap">
          <Button icon="lucide:pencil" variant="outline" @click="openEditDialog">
            Editar
          </Button>
          <Button icon="lucide:user-check" variant="outline" @click="openAssignAdminDialog">
            Asignar admin
          </Button>
          <Button icon="lucide:power-off" variant="outline" @click="handleToggleStatus">
            {{ project.status === 'ACTIVE' ? 'Desactivar' : 'Activar' }}
          </Button>
        </div>
      </div>

      <!-- Info cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium text-muted-foreground uppercase tracking-widest">
              Administrador actual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="project.currentAdmin" class="flex items-center gap-2">
              <Icon name="lucide:user" class="text-muted-foreground" />
              <span class="font-medium">
                {{ project.currentAdmin.firstName }} {{ project.currentAdmin.lastName }}
              </span>
            </div>
            <span v-else class="text-red-600 font-semibold text-sm">Sin asignar</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium text-muted-foreground uppercase tracking-widest">
              Última actualización
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex items-center gap-2">
              <Icon name="lucide:calendar" class="text-muted-foreground" />
              <span>{{ new Date(project.updatedAt).toLocaleDateString('es-GT') }}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Cases shortcut -->
      <div class="space-y-3">
        <h2 class="text-lg font-semibold">Acciones rápidas</h2>
        <Button as-child>
          <NuxtLink :to="`/main/projects/${projectId}/cases`">
            <Icon name="lucide:folder-open" class="mr-1" />
            Ver casos del proyecto
          </NuxtLink>
        </Button>
      </div>
    </template>

    <ProjectFormDialog
      v-model:open="editDialogOpen"
      :project="project ?? undefined"
      @success="refresh"
    />
    <AssignAdminDialog
      v-model:open="assignAdminDialogOpen"
      :project="project ?? undefined"
      @success="refresh"
    />
  </div>
</template>

<script setup lang="ts">
  import { NuxtLink } from '#components';
  import { Button } from '~/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import Badge from '~/components/ui/badge/Badge.vue';
  import ProjectFormDialog from '~/components/projects/ProjectFormDialog.vue';
  import AssignAdminDialog from '~/components/projects/AssignAdminDialog.vue';
  import { projectsApi } from '~/lib/api/projects';
  import { projectsMutations } from '~/lib/mutations/projects';

  const route = useRoute();
  const projectId = computed(() => Number(route.params.projectId));

  const sessionStore = useSessionStore();
  const { roleChecker } = storeToRefs(sessionStore);

  const { data: project, pending, refresh } = await useAsyncData(
    `project-${projectId.value}`,
    () => projectsApi.getById(projectId.value),
  );

  const { mutate: toggleProjectStatus } = projectsMutations.useToggleProjectStatus({
    onComplete: () => refresh(),
  });

  function handleToggleStatus() {
    if (project.value) toggleProjectStatus(project.value.id);
  }

  const editDialogOpen = ref(false);
  function openEditDialog() {
    editDialogOpen.value = true;
  }

  const assignAdminDialogOpen = ref(false);
  function openAssignAdminDialog() {
    assignAdminDialogOpen.value = true;
  }

  definePageMeta({
    layout: 'app',
  });
</script>
<style scoped></style>
