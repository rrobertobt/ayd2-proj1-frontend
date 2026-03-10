<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Asignar administrador</DialogTitle>
        <DialogDescription>
          Busca y selecciona un administrador de proyectos para
          <span class="font-medium text-foreground">{{ project?.name }}</span>.
        </DialogDescription>
      </DialogHeader>

      <form @submit="onSubmit" class="space-y-4">
        <VeeField v-slot="{ errors, setValue }" name="userId">
          <Field :data-invalid="!!errors.length">
            <FieldLabel>Administrador</FieldLabel>

            <Popover v-model:open="comboOpen">
              <PopoverTrigger as-child>
                <button
                  type="button"
                  role="combobox"
                  :aria-expanded="comboOpen"
                  :disabled="isPending"
                  :data-invalid="!!errors.length"
                  class="border-input bg-background flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 text-sm shadow-xs outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[invalid=true]:border-destructive"
                >
                  <span :class="selectedUser ? 'text-foreground' : 'text-muted-foreground'">
                    {{
                      selectedUser
                        ? `${selectedUser.employee.firstName} ${selectedUser.employee.lastName}`
                        : "Buscar administrador..."
                    }}
                  </span>
                  <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent class="w-full p-0" align="start">
                <Command :filter-function="() => true">
                  <CommandInput
                    placeholder="Buscar por nombre..."
                    :model-value="search"
                    @update:model-value="onSearchInput"
                  />
                  <CommandList>
                    <CommandEmpty>
                      <span v-if="usersPending">Buscando...</span>
                      <span v-else>No se encontraron administradores.</span>
                    </CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        v-for="user in users"
                        :key="user.id"
                        :value="String(user.id)"
                        @select="() => {
                          selectedUser = user;
                          setValue(user.id);
                          comboOpen = false;
                        }"
                      >
                        <Check
                          class="mr-2 h-4 w-4"
                          :class="selectedUser?.id === user.id ? 'opacity-100' : 'opacity-0'"
                        />
                        <span>
                          {{ user.employee.firstName }} {{ user.employee.lastName }}
                          <span class="text-muted-foreground ml-1 text-xs">{{ user.email }}</span>
                        </span>
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>

        <DialogFooter>
          <DialogClose as-child>
            <Button type="button" variant="outline" :disabled="isPending">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" :disabled="isPending || !selectedUser">
            <Icon
              v-if="isPending"
              name="lucide:loader-circle"
              class="inline mr-1 animate-spin"
            />
            Asignar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Check, ChevronsUpDown } from "lucide-vue-next";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm, Field as VeeField } from "vee-validate";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "~/components/ui/field";
import { usersApi } from "~/lib/api/users";
import type { UserItemResponse } from "~/lib/api/users";
import type { ProjectItemResponse } from "~/lib/api/projects";
import { projectsMutations } from "~/lib/mutations/projects";

const props = defineProps<{
  open: boolean;
  project?: ProjectItemResponse;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  success: [];
}>();

// --- combobox state ---
const comboOpen = ref(false);
const search = ref("");
const selectedUser = ref<UserItemResponse | null>(null);
const users = ref<UserItemResponse[]>([]);
const usersPending = ref(false);

const fetchUsers = useDebounceFn(async (fullName: string) => {
  usersPending.value = true;
  try {
    const result = await usersApi.list({ roleCode: "PROJECT_ADMIN", fullName, size: 20 });
    users.value = result.content;
  } finally {
    usersPending.value = false;
  }
}, 300);

function onSearchInput(val: string) {
  search.value = val;
  fetchUsers(val);
}

// Load initial list when the combobox opens
watch(comboOpen, (isOpen) => {
  if (isOpen && users.value.length === 0) {
    fetchUsers("");
  }
});

// --- form ---
const formSchema = z.object({
  userId: z.number({ required_error: "Selecciona un administrador" }),
});

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(formSchema),
});

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      resetForm();
      selectedUser.value = null;
      search.value = "";
      users.value = [];
    }
  },
);

// --- mutation ---
const { mutate: assignAdmin, asyncStatus } = projectsMutations.useAssignProjectAdmin({
  onComplete: () => {
    emit("update:open", false);
    emit("success");
  },
});

const isPending = computed(() => asyncStatus.value === "loading");

const onSubmit = handleSubmit((values) => {
  if (props.project) {
    assignAdmin({ projectId: props.project.id, userId: values.userId });
  }
});
</script>
