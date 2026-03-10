<template>
  <div>
    <div class="flex items-center gap-3 mb-1">
      <Button variant="ghost" size="sm" as-child>
        <NuxtLink to="/main/case-types">
          <Icon name="lucide:arrow-left" class="mr-1" />
          Volver
        </NuxtLink>
      </Button>
    </div>

    <div
      v-if="pending"
      class="flex items-center gap-2 text-muted-foreground py-8"
    >
      <Icon name="lucide:loader-circle" class="animate-spin" />
      Cargando...
    </div>

    <template v-else-if="caseType">
      <!-- Header -->
      <div
        class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6"
      >
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-2xl font-bold uppercase">{{ caseType.name }}</h1>
            <Badge
              :class="{
                'bg-green-100 text-green-700': caseType.active,
                'bg-red-100 text-red-700': !caseType.active,
              }"
            >
              {{ caseType.active ? "Activo" : "Inactivo" }}
            </Badge>
          </div>
          <p class="text-muted-foreground mt-1">
            {{ caseType.description || "Sin descripción" }}
          </p>
          <p class="text-xs text-muted-foreground mt-1">
            Creado el
            {{ new Date(caseType.createdAt).toLocaleDateString("es-GT") }}
          </p>
        </div>
        <Button
          icon="lucide:pencil"
          variant="outline"
          @click="openEditCaseTypeDialog"
        >
          Editar tipo de caso
        </Button>
      </div>

      <!-- Stages section -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">
            Flujo de etapas
            <span class="text-muted-foreground font-normal text-sm ml-1">
              ({{ caseType.stages.length }} etapas)
            </span>
          </h2>
          <Button size="sm" @click="openCreateStageDialog()">
            <Icon name="lucide:plus" class="mr-1" />
            Agregar etapa
          </Button>
        </div>

        <div
          v-if="!caseType.stages.length"
          class="text-muted-foreground text-sm py-4 border rounded-lg text-center"
        >
          No hay etapas configuradas. Agrega la primera etapa para definir el
          flujo.
        </div>

        <div v-else class="flex flex-col flex-wrap">
          <template v-for="stage in sortedStages" :key="stage.id">
            <Card class="hover:shadow-md transition-shadow">
              <CardContent class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div
                    class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold"
                  >
                    {{ stage.stageOrder }}
                  </div>
                  <div>
                    <p class="font-medium">{{ stage.name }}</p>
                    <p class="text-sm text-muted-foreground">
                      {{ stage.description || "-" }}
                    </p>
                  </div>
                </div>
                <div>
                  <Button
                    icon="lucide:pencil"
                    variant="ghost"
                    size="sm"
                    @click="openEditStageDialog(stage)"
                  >
                    Editar
                  </Button>
                  <Button
                    icon="lucide:trash"
                    variant="ghost"
                    size="sm"
                    class="text-destructive hover:text-destructive"
                    @click="confirmDeleteStage(stage)"
                  >
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
            <template v-if="stage.stageOrder < caseType.stages.length">
              <div
                class="w-0.5 h-10 rounded my-1 ml-14 bg-muted-foreground/50 flex items-center justify-center"
                aria-hidden="true"
              ></div>
            </template>
          </template>
        </div>
      </div>
    </template>

    <!-- Edit case type dialog -->
    <CaseTypeFormDialog
      v-model:open="caseTypeDialogOpen"
      :case-type="caseType ?? undefined"
      @success="refresh"
    />

    <!-- Stage form dialog -->
    <StageFormDialog
      v-if="caseType"
      v-model:open="stageDialogOpen"
      :case-type-id="caseType.id"
      :stage="selectedStage"
      :initial-stage-order="nextStageOrder"
      @success="refresh"
    />

    <!-- Delete confirmation dialog -->
    <Dialog v-model:open="deleteDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar etapa</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar la etapa
            <span class="font-medium text-foreground">{{
              stageToDelete?.name
            }}</span
            >? Esta acción no se puede deshacer. Solo es posible si el tipo de
            caso no tiene casos activos.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose as-child>
            <Button variant="outline" :disabled="deleteStatus === 'loading'"
              >Cancelar</Button
            >
          </DialogClose>
          <Button
            variant="destructive"
            :disabled="deleteStatus === 'loading'"
            @click="handleDeleteStage"
          >
            <Icon
              v-if="deleteStatus === 'loading'"
              name="lucide:loader-circle"
              class="inline mr-1 animate-spin"
            />
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
  } from "@/components/ui/card";
  import Badge from "~/components/ui/badge/Badge.vue";
  import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import CaseTypeFormDialog from "~/components/case-types/CaseTypeFormDialog.vue";
  import StageFormDialog from "~/components/case-types/StageFormDialog.vue";
  import { caseTypesApi } from "~/lib/api/case-types";
  import type { StageItemResponse } from "~/lib/api/case-types";
  import { caseTypesMutations } from "~/lib/mutations/case-types";

  const route = useRoute();
  const typeId = computed(() => Number(route.params.typeId));

  const {
    data: caseType,
    pending,
    refresh,
  } = await useAsyncData(`case-type-${typeId.value}`, () =>
    caseTypesApi.getById(typeId.value),
  );

  const sortedStages = computed(() =>
    [...(caseType.value?.stages ?? [])].sort(
      (a, b) => a.stageOrder - b.stageOrder,
    ),
  );

  // Case type edit dialog
  const caseTypeDialogOpen = ref(false);

  function openEditCaseTypeDialog() {
    caseTypeDialogOpen.value = true;
  }

  // Stage form dialog
  const stageDialogOpen = ref(false);
  const selectedStage = ref<StageItemResponse | undefined>(undefined);
  const nextStageOrder = ref(1);

  function openCreateStageDialog() {
    const maxOrder = sortedStages.value.length
      ? Math.max(...sortedStages.value.map((s) => s.stageOrder))
      : 0;
    nextStageOrder.value = maxOrder + 1;
    selectedStage.value = undefined;
    stageDialogOpen.value = true;
  }

  function openEditStageDialog(stage: StageItemResponse) {
    selectedStage.value = stage;
    stageDialogOpen.value = true;
  }

  // Delete stage dialog
  const deleteDialogOpen = ref(false);
  const stageToDelete = ref<StageItemResponse | undefined>(undefined);

  const { mutate: deleteStage, asyncStatus: deleteStatus } =
    caseTypesMutations.useDeleteStage({
      onComplete: () => {
        deleteDialogOpen.value = false;
        stageToDelete.value = undefined;
        refresh();
      },
    });

  function confirmDeleteStage(stage: StageItemResponse) {
    stageToDelete.value = stage;
    deleteDialogOpen.value = true;
  }

  function handleDeleteStage() {
    if (stageToDelete.value && caseType.value) {
      deleteStage({
        caseTypeId: caseType.value.id,
        stageId: stageToDelete.value.id,
      });
    }
  }

  definePageMeta({
    layout: "app",
  });
</script>
<style scoped></style>
