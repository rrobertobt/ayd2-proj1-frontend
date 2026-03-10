<template>
  <Popover v-model:open="comboOpen">
    <PopoverTrigger as-child>
      <button
        type="button"
        role="combobox"
        :aria-expanded="comboOpen"
        :disabled="disabled"
        class="border-input bg-background flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 text-sm shadow-xs outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span :class="selectedCaseType ? 'text-foreground' : 'text-muted-foreground'">
          {{ selectedCaseType ? selectedCaseType.name : placeholder }}
        </span>
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </button>
    </PopoverTrigger>
    <PopoverContent class="w-[--radix-popover-trigger-width] p-0" align="start">
      <Command :filter-function="() => true">
        <CommandInput
          placeholder="Buscar tipo de caso..."
          :model-value="search"
          @update:model-value="onSearchInput"
        />
        <CommandList>
          <CommandEmpty>
            <span v-if="pending">Buscando...</span>
            <span v-else>No se encontraron tipos de caso.</span>
          </CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="caseType in caseTypes"
              :key="caseType.id"
              :value="String(caseType.id)"
              @select="() => {
                selectedCaseType = caseType;
                emit('update:modelValue', caseType.id);
                comboOpen = false;
              }"
            >
              <Check
                class="mr-2 h-4 w-4"
                :class="selectedCaseType?.id === caseType.id ? 'opacity-100' : 'opacity-0'"
              />
              {{ caseType.name }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { Check, ChevronsUpDown } from "lucide-vue-next";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { caseTypesApi, type CaseTypeItemResponse } from "~/lib/api/case-types";

const props = withDefaults(
  defineProps<{
    modelValue?: number;
    disabled?: boolean;
    placeholder?: string;
  }>(),
  { placeholder: "Seleccionar tipo de caso..." },
);

const emit = defineEmits<{
  "update:modelValue": [value: number];
}>();

const comboOpen = ref(false);
const search = ref("");
const selectedCaseType = ref<CaseTypeItemResponse | null>(null);
const caseTypes = ref<CaseTypeItemResponse[]>([]);
const pending = ref(false);

const fetchCaseTypes = useDebounceFn(async (query: string) => {
  pending.value = true;
  try {
    const result = await caseTypesApi.list({ search: query || undefined, size: 20 });
    caseTypes.value = result.content;
  } finally {
    pending.value = false;
  }
}, 300);

function onSearchInput(val: string) {
  search.value = val;
  fetchCaseTypes(val);
}

watch(comboOpen, (isOpen) => {
  if (isOpen && caseTypes.value.length === 0) {
    fetchCaseTypes("");
  }
});
</script>
