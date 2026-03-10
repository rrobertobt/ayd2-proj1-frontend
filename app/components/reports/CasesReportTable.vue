<template>
  <div v-if="loading" class="flex items-center gap-2 text-sm text-muted-foreground">
    <Icon name="lucide:loader-circle" class="animate-spin" />
    Cargando...
  </div>
  <p v-else-if="!data.length" class="text-sm text-muted-foreground">Sin resultados</p>
  <div v-else class="overflow-x-auto rounded-lg border text-sm">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Proyecto</TableHead>
          <TableHead>Tipo de caso</TableHead>
          <TableHead>Creado por</TableHead>
          <TableHead>Vencimiento</TableHead>
          <TableHead class="text-right">Horas</TableHead>
          <TableHead class="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="row in data" :key="row.caseId">
          <TableCell class="font-medium">{{ row.title }}</TableCell>
          <TableCell>
            <Badge
              :class="{
                'bg-blue-100 text-blue-700': row.status === 'OPEN',
                'bg-yellow-100 text-yellow-700': row.status === 'IN_PROGRESS',
                'bg-green-100 text-green-700': row.status === 'COMPLETED',
                'bg-gray-100 text-gray-600': row.status === 'CANCELED',
              }"
            >
              {{ caseStatusLabel[row.status] ?? row.status }}
            </Badge>
          </TableCell>
          <TableCell>{{ row.projectName }}</TableCell>
          <TableCell>{{ row.caseTypeName }}</TableCell>
          <TableCell>{{ row.createdByEmployee }}</TableCell>
          <TableCell>{{ new Date(row.dueDate).toLocaleDateString("es-GT") }}</TableCell>
          <TableCell class="text-right">{{ row.totalHours.toFixed(1) }}</TableCell>
          <TableCell class="text-right font-medium">{{ formatMoney(row.totalMoney) }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<script setup lang="ts">
import type { CaseReportDTO } from "~/lib/api/reports";
import Badge from "~/components/ui/badge/Badge.vue";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

defineProps<{
  data: CaseReportDTO[];
  loading?: boolean;
}>();

const caseStatusLabel: Record<string, string> = {
  OPEN: "Abierto",
  IN_PROGRESS: "En progreso",
  COMPLETED: "Completado",
  CANCELED: "Cancelado",
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat("es-GT", { style: "currency", currency: "GTQ" }).format(value);
</script>
