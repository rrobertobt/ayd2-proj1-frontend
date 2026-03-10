<template>
  <div v-if="loading" class="flex items-center gap-2 text-sm text-muted-foreground pt-1">
    <Icon name="lucide:loader-circle" class="animate-spin" />
    Cargando...
  </div>
  <div v-else-if="data" class="grid grid-cols-3 gap-2 pt-1">
    <div class="text-center border rounded p-2">
      <p class="text-xs text-muted-foreground">Casos</p>
      <p class="font-semibold text-lg">{{ data.totalCases }}</p>
    </div>
    <div class="text-center border rounded p-2">
      <p class="text-xs text-muted-foreground">Horas</p>
      <p class="font-semibold text-lg">{{ data.totalHours.toFixed(1) }}</p>
    </div>
    <div class="text-center border rounded p-2">
      <p class="text-xs text-muted-foreground">Total</p>
      <p class="font-semibold text-lg">{{ formatMoney(data.totalMoney) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HoursAndMoneyDTO } from "~/lib/api/reports";

defineProps<{
  data?: HoursAndMoneyDTO | null;
  loading?: boolean;
}>();

const formatMoney = (value: number) =>
  new Intl.NumberFormat("es-GT", { style: "currency", currency: "GTQ" }).format(value);
</script>
