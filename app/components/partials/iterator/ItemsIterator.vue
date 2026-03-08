<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-center pb-2.5">
      <div class="mb-2 sm:mb-0">
        <span class="text-sm text-muted-foreground">
          Página
          <span class="text-foreground font-bold">
            {{ getPageIndex + 1 }}
          </span>
          de
          {{ getPageCount }}
        </span>
        <span class="font-bold"> ⋅ </span>
        <span class="text-sm text-muted-foreground">
          Total de registros:
          <span class="font-semibold text-foreground">{{
            props.totalElements
          }}</span>
        </span>
      </div>
      <div class="flex gap-2 py-2 justify-center sm:justify-end">
        <Button
          class=""
          @click="setPageIndex(0)"
          variant="secondary"
          :disabled="!getCanPreviousPage"
          size="sm"
        >
          <Icon name="lucide:chevrons-left" />
        </Button>
        <Button
          class=""
          @click="previousPage()"
          variant="secondary"
          :disabled="!getCanPreviousPage"
          size="sm"
        >
          <Icon name="lucide:chevron-left" />
          Anterior
        </Button>
        <Button
          class=""
          @click="nextPage()"
          variant="secondary"
          :disabled="!getCanNextPage"
          size="sm"
        >
          <Icon name="lucide:chevron-right" />
          Siguiente
        </Button>
        <Button
          class=""
          @click="setPageIndex(getPageCount - 1)"
          variant="secondary"
          :disabled="!getCanNextPage"
          size="sm"
        >
          <Icon name="lucide:chevrons-right" />
        </Button>
      </div>
    </div>
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <template v-for="item in props.items" :key="item">
        <slot :item="item" />
      </template>
    </section>
  </div>
</template>
<script setup lang="ts" generic="T">
  import { Button } from "~/components/ui/button";

  const props = withDefaults(
    defineProps<{
      items: T[];
      totalElements: number;
      totalPages: number;
      paginationState?: {
        pageIndex: number;
        pageSize: number;
      };
    }>(),
    {
      paginationState: () => ({
        pageIndex: 0,
        pageSize: 10,
      }),
    },
  );

  const emit = defineEmits<{
    (
      e: "paginationChange",
      state: { pageIndex: number; pageSize: number },
    ): void;
  }>();

  const setPageIndex = (index: number) => {
    emit("paginationChange", { ...props.paginationState, pageIndex: index });
  };
  const setPageSize = (size: number) => {
    emit("paginationChange", { ...props.paginationState, pageSize: size });
  };
  const getPageIndex = computed(() => props.paginationState?.pageIndex ?? 0);
  const getPageSize = computed(() => props.paginationState?.pageSize ?? 10);
  const getPageCount = computed(() => props.totalPages);
  const getCanPreviousPage = computed(() => getPageIndex.value > 0);
  const getCanNextPage = computed(
    () => getPageIndex.value < getPageCount.value - 1,
  );

  const previousPage = () => {
    if (getCanPreviousPage.value) {
      setPageIndex(getPageIndex.value - 1);
    }
  };
  const nextPage = () => {
    if (getCanNextPage.value) {
      setPageIndex(getPageIndex.value + 1);
    }
  };
</script>
<style lang="postcss" scoped></style>
