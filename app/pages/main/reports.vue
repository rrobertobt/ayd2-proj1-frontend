<template>
  <div class="space-y-8">
    <h1 class="text-2xl font-bold uppercase">Reportes</h1>

    <!-- ── TOP HIGHLIGHTS ─────────────────────────────────────── -->
    <section>
      <h2 class="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">
        <Icon name="lucide:trophy" class="inline mr-1" />
        Destacados
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <!-- Top dev most cases -->
        <Card>
          <CardHeader class="pb-1">
            <CardTitle class="text-sm text-muted-foreground font-normal">Dev con más casos</CardTitle>
          </CardHeader>
          <CardContent>
            <template v-if="topsStatus === 'pending'">
              <Skeleton class="h-5 w-32 mb-1" />
              <Skeleton class="h-4 w-20" />
            </template>
            <template v-else-if="topDevMostCases">
              <p class="font-semibold text-base">{{ topDevMostCases.firstName }} {{ topDevMostCases.lastName }}</p>
              <p class="text-xs text-muted-foreground font-mono">@{{ topDevMostCases.username }}</p>
              <p class="text-sm mt-1">
                <span class="font-semibold">{{ topDevMostCases.count }}</span> casos ·
                <span class="font-semibold">{{ formatMoney(topDevMostCases.totalMoney) }}</span>
              </p>
            </template>
            <p v-else class="text-sm text-muted-foreground">Sin datos</p>
          </CardContent>
        </Card>

        <!-- Top dev highest paid -->
        <Card>
          <CardHeader class="pb-1">
            <CardTitle class="text-sm text-muted-foreground font-normal">Dev mejor pagado</CardTitle>
          </CardHeader>
          <CardContent>
            <template v-if="topsStatus === 'pending'">
              <Skeleton class="h-5 w-32 mb-1" />
              <Skeleton class="h-4 w-20" />
            </template>
            <template v-else-if="topDevHighestPaid">
              <p class="font-semibold text-base">{{ topDevHighestPaid.firstName }} {{ topDevHighestPaid.lastName }}</p>
              <p class="text-xs text-muted-foreground font-mono">@{{ topDevHighestPaid.username }}</p>
              <p class="text-sm mt-1">
                <span class="font-semibold">{{ formatMoney(topDevHighestPaid.totalMoney) }}</span> ·
                <span class="font-semibold">{{ topDevHighestPaid.count }}</span> casos
              </p>
            </template>
            <p v-else class="text-sm text-muted-foreground">Sin datos</p>
          </CardContent>
        </Card>

        <!-- Top project most completed -->
        <Card>
          <CardHeader class="pb-1">
            <CardTitle class="text-sm text-muted-foreground font-normal">Proyecto más completado</CardTitle>
          </CardHeader>
          <CardContent>
            <template v-if="topsStatus === 'pending'">
              <Skeleton class="h-5 w-32 mb-1" />
              <Skeleton class="h-4 w-20" />
            </template>
            <template v-else-if="topProjectCompleted">
              <p class="font-semibold text-base">{{ topProjectCompleted.projectName }}</p>
              <p class="text-sm mt-1">
                <span class="font-semibold">{{ topProjectCompleted.caseCount }}</span> casos completados
              </p>
            </template>
            <p v-else class="text-sm text-muted-foreground">Sin datos</p>
          </CardContent>
        </Card>

        <!-- Top project most canceled -->
        <Card>
          <CardHeader class="pb-1">
            <CardTitle class="text-sm text-muted-foreground font-normal">Proyecto más cancelado</CardTitle>
          </CardHeader>
          <CardContent>
            <template v-if="topsStatus === 'pending'">
              <Skeleton class="h-5 w-32 mb-1" />
              <Skeleton class="h-4 w-20" />
            </template>
            <template v-else-if="topProjectCanceled">
              <p class="font-semibold text-base">{{ topProjectCanceled.projectName }}</p>
              <p class="text-sm mt-1">
                <span class="font-semibold">{{ topProjectCanceled.caseCount }}</span> casos cancelados
              </p>
            </template>
            <p v-else class="text-sm text-muted-foreground">Sin datos</p>
          </CardContent>
        </Card>
      </div>
    </section>

    <Separator />

    <!-- ── PROYECTOS ───────────────────────────────────────────── -->
    <section>
      <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h2 class="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          <Icon name="lucide:folder" class="inline mr-1" />
          Reporte de proyectos
        </h2>
        <Button variant="ghost" size="sm" @click="refreshProjects" :disabled="projectsReportStatus === 'pending'">
          <Icon name="lucide:refresh-cw" :class="{ 'animate-spin': projectsReportStatus === 'pending' }" />
        </Button>
      </div>
      <!-- Filters -->
      <div class="flex flex-wrap gap-2 mb-3">
        <NativeSelect v-model="projectsFilter.status" @change="refreshProjects">
          <option value="">Todos los estados</option>
          <option value="ACTIVE">Activo</option>
          <option value="INACTIVE">Inactivo</option>
        </NativeSelect>
        <div class="flex gap-1">
          <Input v-model="projectsFilter.search" placeholder="Buscar proyecto..." class="w-48" @keyup.enter="refreshProjects" />
          <Button size="sm" variant="outline" @click="refreshProjects">
            <Icon name="lucide:search" />
          </Button>
        </div>
      </div>
      <!-- Table -->
      <div class="overflow-x-auto rounded-lg border text-sm" v-if="projectsReportData">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Proyecto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead class="text-right">Total casos</TableHead>
              <TableHead class="text-right">Abiertos</TableHead>
              <TableHead class="text-right">En progreso</TableHead>
              <TableHead class="text-right">Completados</TableHead>
              <TableHead class="text-right">Cancelados</TableHead>
              <TableHead class="text-right">Horas</TableHead>
              <TableHead class="text-right">Total pagado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-if="!projectsReportData.length">
              <TableCell colspan="9" class="text-center text-muted-foreground py-6">Sin resultados</TableCell>
            </TableRow>
            <TableRow v-for="row in projectsReportData" :key="row.projectId">
              <TableCell class="font-medium">{{ row.projectName }}</TableCell>
              <TableCell>
                <Badge :class="row.projectStatus === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                  {{ row.projectStatus === 'ACTIVE' ? 'Activo' : 'Inactivo' }}
                </Badge>
              </TableCell>
              <TableCell class="text-right">{{ row.totalCases }}</TableCell>
              <TableCell class="text-right">{{ row.openCases }}</TableCell>
              <TableCell class="text-right">{{ row.inProgressCases }}</TableCell>
              <TableCell class="text-right">{{ row.completedCases }}</TableCell>
              <TableCell class="text-right">{{ row.canceledCases }}</TableCell>
              <TableCell class="text-right">{{ row.totalHours.toFixed(1) }}</TableCell>
              <TableCell class="text-right font-medium">{{ formatMoney(row.totalMoney) }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div v-else-if="projectsReportStatus === 'pending'" class="text-muted-foreground text-sm py-4 flex items-center gap-2">
        <Icon name="lucide:loader-circle" class="animate-spin" /> Cargando...
      </div>
    </section>

    <!-- ── CASOS POR PROYECTO (case-count) ────────────────────── -->
    <section>
      <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h2 class="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          <Icon name="lucide:hash" class="inline mr-1" />
          Cantidad de casos por proyecto
        </h2>
        <Button variant="ghost" size="sm" @click="refreshCaseCount" :disabled="caseCountStatus === 'pending'">
          <Icon name="lucide:refresh-cw" :class="{ 'animate-spin': caseCountStatus === 'pending' }" />
        </Button>
      </div>
      <div class="flex gap-2 mb-3">
        <NativeSelect v-model="caseCountFilter" @change="refreshCaseCount">
          <option value="">Todos los estados</option>
          <option value="ACTIVE">Activo</option>
          <option value="INACTIVE">Inactivo</option>
        </NativeSelect>
      </div>
      <div class="overflow-x-auto rounded-lg border text-sm" v-if="caseCountData">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Proyecto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead class="text-right">Casos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-if="!caseCountData.length">
              <TableCell colspan="3" class="text-center text-muted-foreground py-6">Sin resultados</TableCell>
            </TableRow>
            <TableRow v-for="row in caseCountData" :key="row.projectId">
              <TableCell class="font-medium">{{ row.projectName }}</TableCell>
              <TableCell>
                <Badge :class="row.projectStatus === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                  {{ row.projectStatus === 'ACTIVE' ? 'Activo' : 'Inactivo' }}
                </Badge>
              </TableCell>
              <TableCell class="text-right font-semibold">{{ row.caseCount }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div v-else-if="caseCountStatus === 'pending'" class="text-muted-foreground text-sm py-4 flex items-center gap-2">
        <Icon name="lucide:loader-circle" class="animate-spin" /> Cargando...
      </div>
    </section>

    <Separator />

    <!-- ── DESARROLLADORES ────────────────────────────────────── -->
    <section>
      <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h2 class="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          <Icon name="lucide:code-2" class="inline mr-1" />
          Reporte de desarrolladores
        </h2>
        <Button variant="ghost" size="sm" @click="refreshDevelopers" :disabled="developersStatus === 'pending'">
          <Icon name="lucide:refresh-cw" :class="{ 'animate-spin': developersStatus === 'pending' }" />
        </Button>
      </div>
      <div class="flex gap-2 mb-3">
        <Input v-model="developersSearch" placeholder="Buscar por nombre o username..." class="w-64" @keyup.enter="refreshDevelopers" />
        <Button size="sm" variant="outline" @click="refreshDevelopers">
          <Icon name="lucide:search" />
        </Button>
      </div>
      <div class="overflow-x-auto rounded-lg border text-sm" v-if="developersData">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Username</TableHead>
              <TableHead class="text-right">Tarifa/hr</TableHead>
              <TableHead class="text-right">Casos</TableHead>
              <TableHead class="text-right">Horas</TableHead>
              <TableHead class="text-right">Total pagado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-if="!developersData.length">
              <TableCell colspan="6" class="text-center text-muted-foreground py-6">Sin resultados</TableCell>
            </TableRow>
            <TableRow v-for="dev in developersData" :key="dev.employeeId">
              <TableCell class="font-medium">{{ dev.firstName }} {{ dev.lastName }}</TableCell>
              <TableCell class="font-mono text-xs">@{{ dev.username }}</TableCell>
              <TableCell class="text-right">{{ formatMoney(dev.hourlyRate) }}</TableCell>
              <TableCell class="text-right">{{ dev.totalCasesParticipated }}</TableCell>
              <TableCell class="text-right">{{ dev.totalHoursLogged.toFixed(1) }}</TableCell>
              <TableCell class="text-right font-medium">{{ formatMoney(dev.totalMoneyPaid) }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div v-else-if="developersStatus === 'pending'" class="text-muted-foreground text-sm py-4 flex items-center gap-2">
        <Icon name="lucide:loader-circle" class="animate-spin" /> Cargando...
      </div>
    </section>

    <Separator />

    <!-- ── INVERSIÓN ──────────────────────────────────────────── -->
    <section>
      <h2 class="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
        <Icon name="lucide:dollar-sign" class="inline mr-1" />
        Inversión (horas y dinero)
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- By date range -->
        <Card>
          <CardHeader>
            <CardTitle class="text-base">Por intervalo de fechas</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="flex flex-col gap-1">
              <label class="text-xs text-muted-foreground">Desde</label>
              <Input type="datetime-local" v-model="investmentByDate.from" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs text-muted-foreground">Hasta</label>
              <Input type="datetime-local" v-model="investmentByDate.to" />
            </div>
            <Button size="sm" @click="loadInvestmentByDate" :disabled="investmentByDateStatus === 'pending'">
              <Icon name="lucide:search" class="mr-1" />
              Consultar
            </Button>
            <InvestmentCard :data="investmentByDateData" :loading="investmentByDateStatus === 'pending'" />
          </CardContent>
        </Card>

        <!-- By project -->
        <Card>
          <CardHeader>
            <CardTitle class="text-base">Por proyecto</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="flex gap-2">
              <div class="flex-1">
                <ProjectPicker v-model="investmentProjectId" :disabled="investmentProjectStatus === 'pending'" />
              </div>
              <Button size="sm" @click="loadInvestmentByProject" :disabled="investmentProjectStatus === 'pending' || !investmentProjectId">
                <Icon name="lucide:search" />
              </Button>
            </div>
            <InvestmentCard :data="investmentProjectData" :loading="investmentProjectStatus === 'pending'" />
          </CardContent>
        </Card>

        <!-- By developer -->
        <Card>
          <CardHeader>
            <CardTitle class="text-base">Por desarrollador</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="flex gap-2">
              <div class="flex-1">
                <DeveloperPicker v-model="investmentDeveloperId" :disabled="investmentDeveloperStatus === 'pending'" />
              </div>
              <Button size="sm" @click="loadInvestmentByDeveloper" :disabled="investmentDeveloperStatus === 'pending' || !investmentDeveloperId">
                <Icon name="lucide:search" />
              </Button>
            </div>
            <InvestmentCard :data="investmentDeveloperData" :loading="investmentDeveloperStatus === 'pending'" />
          </CardContent>
        </Card>

        <!-- By case type -->
        <Card>
          <CardHeader>
            <CardTitle class="text-base">Por tipo de caso</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="flex gap-2">
              <div class="flex-1">
                <CaseTypePicker v-model="investmentCaseTypeId" :disabled="investmentCaseTypeStatus === 'pending'" />
              </div>
              <Button size="sm" @click="loadInvestmentByCaseType" :disabled="investmentCaseTypeStatus === 'pending' || !investmentCaseTypeId">
                <Icon name="lucide:search" />
              </Button>
            </div>
            <InvestmentCard :data="investmentCaseTypeData" :loading="investmentCaseTypeStatus === 'pending'" />
          </CardContent>
        </Card>
      </div>
    </section>

    <Separator />

    <!-- ── CASOS DETALLADOS ────────────────────────────────────── -->
    <section>
      <h2 class="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
        <Icon name="lucide:file-text" class="inline mr-1" />
        Casos detallados
      </h2>

      <div class="space-y-6">
        <!-- Cases by project -->
        <div>
          <p class="text-sm font-medium mb-2">Por proyecto</p>
          <div class="flex gap-2 mb-3">
            <div class="flex-1 max-w-sm">
              <ProjectPicker v-model="casesByProjectId" :disabled="casesByProjectStatus === 'pending'" />
            </div>
            <Button size="sm" @click="loadCasesByProject" :disabled="casesByProjectStatus === 'pending' || !casesByProjectId">
              <Icon name="lucide:search" />
            </Button>
          </div>
          <CasesReportTable v-if="casesByProjectData !== null" :data="casesByProjectData" :loading="casesByProjectStatus === 'pending'" />
        </div>

        <Separator class="opacity-50" />

        <!-- Cases by developer -->
        <div>
          <p class="text-sm font-medium mb-2">Por desarrollador</p>
          <div class="flex gap-2 mb-3">
            <div class="flex-1 max-w-sm">
              <DeveloperPicker v-model="casesByDeveloperId" :disabled="casesByDeveloperStatus === 'pending'" />
            </div>
            <Button size="sm" @click="loadCasesByDeveloper" :disabled="casesByDeveloperStatus === 'pending' || !casesByDeveloperId">
              <Icon name="lucide:search" />
            </Button>
          </div>
          <CasesReportTable v-if="casesByDeveloperData !== null" :data="casesByDeveloperData" :loading="casesByDeveloperStatus === 'pending'" />
        </div>

        <Separator class="opacity-50" />

        <!-- Cases by case type -->
        <div>
          <p class="text-sm font-medium mb-2">Por tipo de caso</p>
          <div class="flex gap-2 mb-3">
            <div class="flex-1 max-w-sm">
              <CaseTypePicker v-model="casesByCaseTypeId" :disabled="casesByCaseTypeStatus === 'pending'" />
            </div>
            <Button size="sm" @click="loadCasesByCaseType" :disabled="casesByCaseTypeStatus === 'pending' || !casesByCaseTypeId">
              <Icon name="lucide:search" />
            </Button>
          </div>
          <CasesReportTable v-if="casesByCaseTypeData !== null" :data="casesByCaseTypeData" :loading="casesByCaseTypeStatus === 'pending'" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reportsApi, type HoursAndMoneyDTO, type CaseReportDTO } from "~/lib/api/reports";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Badge from "~/components/ui/badge/Badge.vue";
import Skeleton from "~/components/ui/skeleton/Skeleton.vue";
import Separator from "~/components/ui/separator/Separator.vue";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { NativeSelect } from "~/components/ui/native-select";
import { Input } from "~/components/ui/input";
import { fetchErrorHandler } from "~/lib/utils";
import InvestmentCard from "~/components/reports/InvestmentCard.vue";
import CasesReportTable from "~/components/reports/CasesReportTable.vue";
import ProjectPicker from "~/components/reports/ProjectPicker.vue";
import DeveloperPicker from "~/components/reports/DeveloperPicker.vue";
import CaseTypePicker from "~/components/reports/CaseTypePicker.vue";

definePageMeta({ layout: "app" });

// ── Helpers ─────────────────────────────────────────────────────
const formatMoney = (value: number) =>
  new Intl.NumberFormat("es-GT", { style: "currency", currency: "GTQ" }).format(value);

// ── Top cards (endpoints 8, 9, 10, 11) ──────────────────────────
const { data: topsData, status: topsStatus, refresh: refreshTops } = await useAsyncData(
  "reports-tops",
  () =>
    Promise.all([
      reportsApi.topDeveloperMostCases(),
      reportsApi.topDeveloperHighestPaid(),
      reportsApi.topProjectMostCompleted(),
      reportsApi.topProjectMostCanceled(),
    ]).catch((e) => { fetchErrorHandler(e); return [null, null, null, null]; }),
);
const topDevMostCases = computed(() => topsData.value?.[0]);
const topDevHighestPaid = computed(() => topsData.value?.[1]);
const topProjectCompleted = computed(() => topsData.value?.[2]);
const topProjectCanceled = computed(() => topsData.value?.[3]);

// ── Project report (endpoint 7) ──────────────────────────────────
const projectsFilter = reactive({ status: "" as "" | "ACTIVE" | "INACTIVE", search: "" });
const { data: projectsReportData, status: projectsReportStatus, refresh: refreshProjects } = await useAsyncData(
  "reports-projects",
  () =>
    reportsApi
      .projects({ status: projectsFilter.status || undefined, search: projectsFilter.search || undefined })
      .catch((e) => { fetchErrorHandler(e); return []; }),
  { watch: [] },
);

// ── Case count by project (endpoint 1) ───────────────────────────
const caseCountFilter = ref<"" | "ACTIVE" | "INACTIVE">("");
const { data: caseCountData, status: caseCountStatus, refresh: refreshCaseCount } = await useAsyncData(
  "reports-case-count",
  () =>
    reportsApi
      .projectCaseCount({ status: caseCountFilter.value || undefined })
      .catch((e) => { fetchErrorHandler(e); return []; }),
  { watch: [] },
);

// ── Developer report (endpoint 6) ────────────────────────────────
const developersSearch = ref("");
const { data: developersData, status: developersStatus, refresh: refreshDevelopers } = await useAsyncData(
  "reports-developers",
  () =>
    reportsApi
      .developers({ search: developersSearch.value || undefined })
      .catch((e) => { fetchErrorHandler(e); return []; }),
  { watch: [] },
);

// ── Investment by date (endpoint 5) ──────────────────────────────
const investmentByDate = reactive({ from: "", to: "" });
const investmentByDateData = ref<HoursAndMoneyDTO | null>(null);
const investmentByDateStatus = ref<"idle" | "pending" | "success" | "error">("idle");
async function loadInvestmentByDate() {
  if (!investmentByDate.from || !investmentByDate.to) return;
  investmentByDateStatus.value = "pending";
  try {
    investmentByDateData.value = await reportsApi.investmentByDate({
      from: new Date(investmentByDate.from).toISOString(),
      to: new Date(investmentByDate.to).toISOString(),
    });
    investmentByDateStatus.value = "success";
  } catch (e) {
    fetchErrorHandler(e);
    investmentByDateStatus.value = "error";
  }
}

// ── Investment by project (endpoint 2) ───────────────────────────
const investmentProjectId = ref<number | undefined>(undefined);
const investmentProjectData = ref<HoursAndMoneyDTO | null>(null);
const investmentProjectStatus = ref<"idle" | "pending">("idle");
async function loadInvestmentByProject() {
  if (!investmentProjectId.value) return;
  investmentProjectStatus.value = "pending";
  try {
    investmentProjectData.value = await reportsApi.projectInvestment(investmentProjectId.value);
  } catch (e) {
    fetchErrorHandler(e);
  } finally {
    investmentProjectStatus.value = "idle";
  }
}

// ── Investment by developer (endpoint 3) ─────────────────────────
const investmentDeveloperId = ref<number | undefined>(undefined);
const investmentDeveloperData = ref<HoursAndMoneyDTO | null>(null);
const investmentDeveloperStatus = ref<"idle" | "pending">("idle");
async function loadInvestmentByDeveloper() {
  if (!investmentDeveloperId.value) return;
  investmentDeveloperStatus.value = "pending";
  try {
    investmentDeveloperData.value = await reportsApi.developerInvestment(investmentDeveloperId.value);
  } catch (e) {
    fetchErrorHandler(e);
  } finally {
    investmentDeveloperStatus.value = "idle";
  }
}

// ── Investment by case type (endpoint 4) ─────────────────────────
const investmentCaseTypeId = ref<number | undefined>(undefined);
const investmentCaseTypeData = ref<HoursAndMoneyDTO | null>(null);
const investmentCaseTypeStatus = ref<"idle" | "pending">("idle");
async function loadInvestmentByCaseType() {
  if (!investmentCaseTypeId.value) return;
  investmentCaseTypeStatus.value = "pending";
  try {
    investmentCaseTypeData.value = await reportsApi.caseTypeInvestment(investmentCaseTypeId.value);
  } catch (e) {
    fetchErrorHandler(e);
  } finally {
    investmentCaseTypeStatus.value = "idle";
  }
}

// ── Cases by project (endpoint 12) ───────────────────────────────
const casesByProjectId = ref<number | undefined>(undefined);
const casesByProjectData = ref<CaseReportDTO[] | null>(null);
const casesByProjectStatus = ref<"idle" | "pending">("idle");
async function loadCasesByProject() {
  if (!casesByProjectId.value) return;
  casesByProjectStatus.value = "pending";
  try {
    casesByProjectData.value = await reportsApi.casesByProject(casesByProjectId.value);
  } catch (e) {
    fetchErrorHandler(e);
  } finally {
    casesByProjectStatus.value = "idle";
  }
}

// ── Cases by developer (endpoint 13) ─────────────────────────────
const casesByDeveloperId = ref<number | undefined>(undefined);
const casesByDeveloperData = ref<CaseReportDTO[] | null>(null);
const casesByDeveloperStatus = ref<"idle" | "pending">("idle");
async function loadCasesByDeveloper() {
  if (!casesByDeveloperId.value) return;
  casesByDeveloperStatus.value = "pending";
  try {
    casesByDeveloperData.value = await reportsApi.casesByDeveloper(casesByDeveloperId.value);
  } catch (e) {
    fetchErrorHandler(e);
  } finally {
    casesByDeveloperStatus.value = "idle";
  }
}

// ── Cases by case type (endpoint 14) ─────────────────────────────
const casesByCaseTypeId = ref<number | undefined>(undefined);
const casesByCaseTypeData = ref<CaseReportDTO[] | null>(null);
const casesByCaseTypeStatus = ref<"idle" | "pending">("idle");
async function loadCasesByCaseType() {
  if (!casesByCaseTypeId.value) return;
  casesByCaseTypeStatus.value = "pending";
  try {
    casesByCaseTypeData.value = await reportsApi.casesByCaseType(casesByCaseTypeId.value);
  } catch (e) {
    fetchErrorHandler(e);
  } finally {
    casesByCaseTypeStatus.value = "idle";
  }
}
</script>
<style scoped></style>
