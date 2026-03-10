<template>
  <div class="mt-3 border-t pt-3">
    <button
      type="button"
      class="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
      @click="isOpen = !isOpen"
    >
      <Icon
        name="lucide:chevron-right"
        class="h-3.5 w-3.5 transition-transform"
        :class="{ 'rotate-90': isOpen }"
      />
      <Icon name="lucide:clock" class="h-3.5 w-3.5 mr-1" />
      Worklogs
      <span v-if="worklogs" class="ml-1">({{ worklogs.length }})</span>
      <Icon v-if="pending" name="lucide:loader-circle" class="animate-spin h-3 w-3 ml-1" />
    </button>

    <div v-if="isOpen" class="mt-2 space-y-2">
      <div v-if="pending" class="text-xs text-muted-foreground py-2">Cargando...</div>
      <div
        v-else-if="!worklogs?.length"
        class="text-xs text-muted-foreground py-2 text-center border rounded"
      >
        Sin registros de trabajo aún.
      </div>
      <div
        v-else
        v-for="log in worklogs"
        :key="log.id"
        class="rounded border bg-muted/30 px-3 py-2 text-xs space-y-1"
      >
        <div class="flex items-center justify-between gap-2 flex-wrap">
          <span class="font-medium text-foreground">{{ log.employeeName }}</span>
          <div class="flex items-center gap-2 text-muted-foreground">
            <span>
              <Icon name="lucide:clock" class="inline mr-0.5" />
              {{ log.hoursSpent }}h
            </span>
            <span>{{ new Date(log.createdAt).toLocaleDateString("es-GT") }}</span>
          </div>
        </div>
        <p class="text-muted-foreground">{{ log.comment }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { casesApi } from "~/lib/api/cases";

const props = defineProps<{
  caseId: number;
  stepId: number;
}>();

const isOpen = ref(false);

const { data: worklogs, pending, refresh } = useAsyncData(
  `worklogs-${props.caseId}-${props.stepId}`,
  () => casesApi.listWorklogs(props.caseId, props.stepId),
  { immediate: false },
);

watch(isOpen, (open) => {
  if (open && !worklogs.value) {
    refresh();
  }
});

defineExpose({ refresh });
</script>
