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
        <span :class="selectedUser ? 'text-foreground' : 'text-muted-foreground'">
          {{
            selectedUser
              ? `${selectedUser.employee.firstName} ${selectedUser.employee.lastName}`
              : placeholder
          }}
        </span>
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </button>
    </PopoverTrigger>
    <PopoverContent class="w-[--radix-popover-trigger-width] p-0" align="start">
      <Command :filter-function="() => true">
        <CommandInput
          placeholder="Buscar desarrollador..."
          :model-value="search"
          @update:model-value="onSearchInput"
        />
        <CommandList>
          <CommandEmpty>
            <span v-if="pending">Buscando...</span>
            <span v-else>No se encontraron desarrolladores.</span>
          </CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="user in users"
              :key="user.id"
              :value="String(user.employee.id)"
              @select="() => {
                selectedUser = user;
                emit('update:modelValue', user.employee.id);
                comboOpen = false;
              }"
            >
              <Check
                class="mr-2 h-4 w-4"
                :class="selectedUser?.id === user.id ? 'opacity-100' : 'opacity-0'"
              />
              {{ user.employee.firstName }} {{ user.employee.lastName }}
              <span class="text-muted-foreground ml-1 text-xs font-mono">@{{ user.username }}</span>
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
import { usersApi, type UserItemResponse } from "~/lib/api/users";

const props = withDefaults(
  defineProps<{
    modelValue?: number;
    disabled?: boolean;
    placeholder?: string;
  }>(),
  { placeholder: "Seleccionar desarrollador..." },
);

const emit = defineEmits<{
  "update:modelValue": [value: number];
}>();

const comboOpen = ref(false);
const search = ref("");
const selectedUser = ref<UserItemResponse | null>(null);
const users = ref<UserItemResponse[]>([]);
const pending = ref(false);

const fetchUsers = useDebounceFn(async (query: string) => {
  pending.value = true;
  try {
    users.value = await usersApi.listDevelopers({ fullName: query || undefined });
  } finally {
    pending.value = false;
  }
}, 300);

function onSearchInput(val: string) {
  search.value = val;
  fetchUsers(val);
}

watch(comboOpen, (isOpen) => {
  if (isOpen && users.value.length === 0) {
    fetchUsers("");
  }
});
</script>
