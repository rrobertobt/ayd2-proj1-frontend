<template>
  <div>
    <!-- Back -->
    <div class="flex items-center gap-3 mb-4">
      <Button variant="ghost" size="sm" as-child>
        <NuxtLink :to="roleChecker.isDeveloper ? '/main/my/cases' : `/main/projects/${projectId}/cases`">
          <Icon name="lucide:arrow-left" class="mr-1" />
          {{ roleChecker.isDeveloper ? 'Volver a mis casos' : 'Volver a casos del proyecto' }}
        </NuxtLink>
      </Button>
    </div>

    <div
      v-if="casePending"
      class="flex items-center gap-2 text-muted-foreground py-8"
    >
      <Icon name="lucide:loader-circle" class="animate-spin" />
      Cargando...
    </div>

    <template v-else-if="caseData">
      <!-- Case header -->
      <div class="mb-6">
        <div class="flex  items-start justify-between gap-2 flex-wrap">
          <div class="w-full">
            <div class="text-sm pb-2">
              Proyecto: 
              <span class="font-medium  text-foreground">{{ caseData.projectName }}</span>
            </div>
            <Separator class="mb-2" />
            <div class="flex items-center gap-2 flex-wrap">
              <h1 class="text-2xl font-bold uppercase">{{ caseData.title }}</h1>
              <Badge v-if="caseData.overdue" class="bg-red-100 text-red-700"
                >Vencido</Badge
              >
              <Badge
                :class="{
                  'bg-blue-100 text-blue-700': caseData.status === 'OPEN',
                  'bg-yellow-100 text-yellow-700':
                    caseData.status === 'IN_PROGRESS',
                  'bg-green-100 text-green-700':
                    caseData.status === 'COMPLETED',
                  'bg-gray-100 text-gray-700': caseData.status === 'CANCELED',
                }"
              >
                {{ caseStatusLabel[caseData.status] }}
              </Badge>
              <Badge variant="secondary">{{ caseData.caseTypeName }}</Badge>
            </div>
            <p class="text-muted-foreground mt-1">
              {{ caseData.description || "Sin descripción" }}
            </p>
            <div
              class="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground"
            >
              <span>
                <Icon name="lucide:calendar" class="inline mr-1" />
                Vence:
                {{ new Date(caseData.dueDate).toLocaleDateString("es-GT") }}
              </span>
              <span>
                <Icon name="lucide:user" class="inline mr-1" />
                Creado por: {{ caseData.createdByEmployeeName }}
              </span>
              <span>
                <Icon name="lucide:bar-chart-2" class="inline mr-1" />
                Progreso: {{ caseData.progressPercent }}%
              </span>
            </div>
            <div v-if="caseData.cancelReason" class="mt-2 text-sm text-red-700">
              <Icon name="lucide:ban" class="inline mr-1" />
              Cancelado: {{ caseData.cancelReason }}
            </div>
          </div>

          <!-- Admin actions -->
          <div
            v-if="
              session?.role?.code === 'PROJECT_ADMIN' &&
              caseData.status !== 'COMPLETED' &&
              caseData.status !== 'CANCELED'
            "
            class="flex gap-2 shrink-0"
          >
            <Button
              size="sm"
              variant="outline"
              @click="dueDateDialogOpen = true"
            >
              <Icon name="lucide:calendar-clock" class="mr-1" />
              Cambiar fecha
            </Button>
            <Button
              size="sm"
              variant="outline"
              class="text-destructive border-destructive/30 hover:bg-destructive/10"
              @click="cancelDialogOpen = true"
            >
              <Icon name="lucide:ban" class="mr-1" />
              Cancelar
            </Button>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="w-full bg-secondary rounded-full h-2 mt-4">
          <div
            class="h-2 rounded-full transition-all"
            :class="
              caseData.progressPercent === 100 ? 'bg-green-500' : 'bg-primary'
            "
            :style="{ width: `${caseData.progressPercent}%` }"
          />
        </div>
      </div>

      <!-- Steps -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">
            Pasos del flujo
            <span class="text-muted-foreground font-normal text-sm ml-1">
              ({{ sortedSteps.length }} pasos)
            </span>
          </h2>
          <Button
            variant="ghost"
            size="sm"
            @click="refreshCase"
            :disabled="casePending"
          >
            <Icon
              name="lucide:refresh-cw"
              :class="{ 'animate-spin': casePending }"
            />
          </Button>
        </div>

        <div
          v-if="!sortedSteps.length"
          class="text-muted-foreground text-sm py-4 border rounded-lg text-center"
        >
          No hay pasos registrados para este caso.
        </div>

        <div v-else class="space-y-3">
          <Card
            v-for="step in sortedSteps"
            :key="step.id"
            :class="{
              'border-green-200 bg-green-50/50': step.status === 'APPROVED',
              'border-yellow-200 bg-yellow-50/50':
                step.status === 'IN_PROGRESS',
              'border-blue-200 bg-blue-50/50':
                step.status === 'ASSIGNED' || step.status === 'SUBMITTED',
              'border-red-200 bg-red-50/50': step.status === 'REJECTED',
              'opacity-60 hover:opacity-80':
                step.status === 'PENDING' &&
                step.stepOrder !== 1 &&
                sortedSteps[step.stepOrder - 2]?.status !== 'APPROVED',
            }"
          >
            <CardContent class="py-4">
              <div
                class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <!-- Step info -->
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                    :class="{
                      'bg-green-500 text-white': step.status === 'APPROVED',
                      'bg-yellow-500 text-white': step.status === 'IN_PROGRESS',
                      'bg-blue-500 text-white':
                        step.status === 'ASSIGNED' ||
                        step.status === 'SUBMITTED',
                      'bg-red-500 text-white': step.status === 'REJECTED',
                      'bg-muted text-muted-foreground':
                        step.status === 'PENDING',
                    }"
                  >
                    {{ step.stepOrder }}
                  </div>
                  <div>
                    <div class="flex items-center gap-2 flex-wrap">
                      <p class="font-medium">{{ step.stageName }}</p>
                      <Badge
                        class="text-xs"
                        :class="{
                          'bg-green-100 text-green-700':
                            step.status === 'APPROVED',
                          'bg-yellow-100 text-yellow-700':
                            step.status === 'IN_PROGRESS',
                          'bg-blue-100 text-blue-700':
                            step.status === 'ASSIGNED' ||
                            step.status === 'SUBMITTED',
                          'bg-red-100 text-red-700': step.status === 'REJECTED',
                          'bg-gray-100 text-gray-600':
                            step.status === 'PENDING',
                        }"
                      >
                        {{ stepStatusLabel[step.status] }}
                      </Badge>
                    </div>
                    <p
                      v-if="step.assignedEmployeeName"
                      class="text-sm text-muted-foreground"
                    >
                      <Icon name="lucide:user" class="inline mr-1" />
                      {{ step.assignedEmployeeName }}
                    </p>
                    <p v-else class="text-sm text-muted-foreground">
                      Sin asignar
                    </p>
                    <p
                      v-if="step.rejectionReason"
                      class="text-xs text-red-600 mt-1"
                    >
                      <Icon name="lucide:alert-circle" class="inline mr-1" />
                      {{ step.rejectionReason }}
                    </p>
                  </div>
                </div>

                <!-- Actions (PROJECT_ADMIN can assign/approve/reject) -->
                <div
                  v-if="session?.role?.code === 'PROJECT_ADMIN'"
                  class="flex gap-2 shrink-0"
                >
                  <Button
                    v-if="step.status === 'PENDING'"
                    :disabled="
                      sortedSteps[step.stepOrder - 2]?.status !== 'APPROVED' &&
                      step.stepOrder !== 1
                    "
                    size="sm"
                    variant="outline"
                    @click="openAssignDialog(step)"
                  >
                    <Icon name="lucide:user-plus" class="mr-1" />
                    Asignar
                  </Button>

                  <template
                    v-if="
                      step.status === 'ASSIGNED' ||
                      step.status === 'IN_PROGRESS' ||
                      step.status === 'SUBMITTED'
                    "
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      class="text-green-700 border-green-200 hover:bg-green-50"
                      @click="openApproveDialog(step)"
                    >
                      <Icon name="lucide:check" class="mr-1" />
                      Aprobar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      class="text-destructive border-destructive/30 hover:bg-destructive/10"
                      @click="openRejectDialog(step)"
                    >
                      <Icon name="lucide:x" class="mr-1" />
                      Rechazar
                    </Button>
                  </template>

                  <template v-if="step.status === 'APPROVED'">
                    <Icon
                      name="lucide:check-circle-2"
                      class="text-green-500 h-5 w-5"
                    />
                  </template>
                </div>

                <!-- Developer actions -->
                <div
                  v-if="
                    session?.role?.code === 'DEVELOPER' &&
                    step.assignedEmployeeId === session?.employee?.id &&
                    (step.status === 'ASSIGNED' ||
                      step.status === 'IN_PROGRESS')
                  "
                  class="flex gap-2 shrink-0"
                >
                  <Button
                    size="sm"
                    variant="outline"
                    @click="openWorklogDialog(step)"
                  >
                    <Icon name="lucide:clock" class="mr-1" />
                    Registrar trabajo
                  </Button>
                </div>
              </div>

              <WorklogsPanel
                :ref="(el) => setWorklogsPanelRef(step.id, el)"
                :case-id="caseId"
                :step-id="step.id"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </template>

    <!-- Dialogs -->
    <AssignDeveloperDialog
      v-if="activeStep"
      v-model:open="assignDialogOpen"
      :case-id="caseId"
      :step-id="activeStep.id"
      :step-name="activeStep.stageName"
      @success="refreshCase"
    />

    <ApproveStepDialog
      v-if="activeStep"
      v-model:open="approveDialogOpen"
      :case-id="caseId"
      :step-id="activeStep.id"
      :step-name="activeStep.stageName"
      :has-next-step="hasNextStep(activeStep)"
      @success="refreshCase"
    />

    <RejectStepDialog
      v-if="activeStep"
      v-model:open="rejectDialogOpen"
      :case-id="caseId"
      :step-id="activeStep.id"
      :step-name="activeStep.stageName"
      @success="refreshCase"
    />

    <UpdateDueDateDialog
      v-if="caseData"
      v-model:open="dueDateDialogOpen"
      :case-id="caseId"
      :case-title="caseData.title"
      :current-due-date="caseData.dueDate"
      @success="refreshCase"
    />

    <CancelCaseDialog
      v-if="caseData"
      v-model:open="cancelDialogOpen"
      :case-id="caseId"
      :case-title="caseData.title"
      @success="refreshCase"
    />

    <WorklogFormDialog
      v-if="activeStep"
      v-model:open="worklogDialogOpen"
      :case-id="caseId"
      :step-id="activeStep.id"
      :step-name="activeStep.stageName"
      @success="onWorklogSuccess"
    />
  </div>
</template>

<script setup lang="ts">
  import { NuxtLink } from "#components";
  import { Button } from "~/components/ui/button";
  import { Card, CardContent } from "@/components/ui/card";
  import Badge from "~/components/ui/badge/Badge.vue";
  import AssignDeveloperDialog from "~/components/cases/AssignDeveloperDialog.vue";
  import ApproveStepDialog from "~/components/cases/ApproveStepDialog.vue";
  import RejectStepDialog from "~/components/cases/RejectStepDialog.vue";
  import UpdateDueDateDialog from "~/components/cases/UpdateDueDateDialog.vue";
  import CancelCaseDialog from "~/components/cases/CancelCaseDialog.vue";
  import WorklogFormDialog from "~/components/cases/WorklogFormDialog.vue";
  import WorklogsPanel from "~/components/cases/WorklogsPanel.vue";
  import { casesApi } from "~/lib/api/cases";
  import type { CaseStepItemResponse } from "~/lib/api/cases";
import Separator from "~/components/ui/separator/Separator.vue";

  const route = useRoute();
  const projectId = computed(() => Number(route.params.projectId));
  const caseId = computed(() => Number(route.params.caseId));

  const sessionStore = useSessionStore();
  const { session, roleChecker } = storeToRefs(sessionStore);

  const {
    data: caseData,
    pending: casePending,
    refresh: refreshCase,
  } = await useAsyncData(`case-${caseId.value}`, () =>
    casesApi.getById(caseId.value),
  );

  const sortedSteps = computed(() =>
    [...(caseData.value?.steps ?? [])].sort(
      (a, b) => a.stepOrder - b.stepOrder,
    ),
  );

  function hasNextStep(step: CaseStepItemResponse) {
    const sorted = sortedSteps.value;
    const idx = sorted.findIndex((s) => s.id === step.id);
    return idx !== -1 && idx < sorted.length - 1;
  }

  const caseStatusLabel: Record<string, string> = {
    OPEN: "Abierto",
    IN_PROGRESS: "En progreso",
    COMPLETED: "Completado",
    CANCELED: "Cancelado",
  };

  const stepStatusLabel: Record<string, string> = {
    PENDING: "Pendiente",
    ASSIGNED: "Asignado",
    IN_PROGRESS: "En progreso",
    SUBMITTED: "Enviado",
    APPROVED: "Aprobado",
    REJECTED: "Rechazado",
  };

  // Dialog state
  const activeStep = ref<CaseStepItemResponse | undefined>(undefined);
  const assignDialogOpen = ref(false);
  const approveDialogOpen = ref(false);
  const rejectDialogOpen = ref(false);
  const dueDateDialogOpen = ref(false);
  const cancelDialogOpen = ref(false);
  const worklogDialogOpen = ref(false);

  // Worklogs panel refs keyed by stepId
  const worklogsPanelRefs = ref<
    Record<number, InstanceType<typeof WorklogsPanel> | null>
  >({});
  function setWorklogsPanelRef(stepId: number, el: unknown) {
    worklogsPanelRefs.value[stepId] = el as InstanceType<
      typeof WorklogsPanel
    > | null;
  }

  function openAssignDialog(step: CaseStepItemResponse) {
    activeStep.value = step;
    assignDialogOpen.value = true;
  }

  function openApproveDialog(step: CaseStepItemResponse) {
    activeStep.value = step;
    approveDialogOpen.value = true;
  }

  function openRejectDialog(step: CaseStepItemResponse) {
    activeStep.value = step;
    rejectDialogOpen.value = true;
  }

  function openWorklogDialog(step: CaseStepItemResponse) {
    activeStep.value = step;
    worklogDialogOpen.value = true;
  }

  function onWorklogSuccess() {
    if (activeStep.value) {
      worklogsPanelRefs.value[activeStep.value.id]?.refresh();
    }
    refreshCase();
  }

  definePageMeta({
    layout: "app",
  });
</script>
<style scoped></style>
