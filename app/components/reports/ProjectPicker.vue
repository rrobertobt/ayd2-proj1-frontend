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
        <span :class="selectedProject ? 'text-foreground' : 'text-muted-foreground'">
          {{ selectedProject ? selectedProject.name : placeholder }}
        </span>
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </button>
    </PopoverTrigger>
    <PopoverContent class="w-[--radix-popover-trigger-width] p-0" align="start">
      <Command :filter-function="() => true">
        <CommandInput
          placeholder="Buscar proyecto..."
          :model-value="search"
          @update:model-value="onSearchInput"
        />
        <CommandList>
          <CommandEmpty>
            <span v-if="pending">Buscando...</span>
            <span v-else>No se encontraron proyectos.</span>
          </CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="project in projects"
              :key="project.id"
              :value="String(project.id)"
              @select="() => {
                selectedProject = project;
                emit('update:modelValue', project.id);
                comboOpen = false;
              }"
            >
              <Check
                class="mr-2 h-4 w-4"
                :class="selectedProject?.id === project.id ? 'opacity-100' : 'opacity-0'"
              />
              {{ project.name }}
              <Badge
                class="ml-2 text-xs"
                :class="project.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
              >
                {{ project.status === 'ACTIVE' ? 'Activo' : 'Inactivo' }}
              </Badge>
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
import Badge from "~/components/ui/badge/Badge.vue";
import { projectsApi, type ProjectItemResponse } from "~/lib/api/projects";

const props = withDefaults(
  defineProps<{
    modelValue?: number;
    disabled?: boolean;
    placeholder?: string;
  }>(),
  { placeholder: "Seleccionar proyecto..." },
);

const emit = defineEmits<{
  "update:modelValue": [value: number];
}>();

const comboOpen = ref(false);
const search = ref("");
const selectedProject = ref<ProjectItemResponse | null>(null);
const projects = ref<ProjectItemResponse[]>([]);
const pending = ref(false);

const fetchProjects = useDebounceFn(async (query: string) => {
  pending.value = true;
  try {
    const result = await projectsApi.list({ search: query || undefined, size: 20 });
    projects.value = result.content;
  } finally {
    pending.value = false;
  }
}, 300);

function onSearchInput(val: string) {
  search.value = val;
  fetchProjects(val);
}

watch(comboOpen, (isOpen) => {
  if (isOpen && projects.value.length === 0) {
    fetchProjects("");
  }
});
</script>
