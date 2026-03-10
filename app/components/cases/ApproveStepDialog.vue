<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Aprobar paso</DialogTitle>
        <DialogDescription>
          Estás aprobando el paso
          <span class="font-medium text-foreground">{{ stepName }}</span>.
          <span v-if="!hasNextStep" class="block mt-1 text-xs">
            Este es el último paso — el caso finalizará automáticamente al aprobar.
          </span>
        </DialogDescription>
      </DialogHeader>

      <form @submit="onSubmit" class="space-y-4">
        <template v-if="hasNextStep">
          <VeeField v-slot="{ errors, setValue }" name="nextAssigneeUserId">
            <Field :data-invalid="!!errors.length">
              <FieldLabel>Desarrollador del siguiente paso</FieldLabel>

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
                          : "Buscar desarrollador..."
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
                        <span v-else>No se encontraron usuarios.</span>
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
        </template>

        <DialogFooter>
          <DialogClose as-child>
            <Button type="button" variant="outline" :disabled="isPending">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" :disabled="isPending || (hasNextStep && !selectedUser)">
            <Icon
              v-if="isPending"
              name="lucide:loader-circle"
              class="inline mr-1 animate-spin"
            />
            Aprobar
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
import { casesMutations } from "~/lib/mutations/cases";

const props = defineProps<{
  open: boolean;
  caseId: number;
  stepId: number;
  stepName: string;
  hasNextStep: boolean;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  success: [];
}>();

const comboOpen = ref(false);
const search = ref("");
const selectedUser = ref<UserItemResponse | null>(null);
const users = ref<UserItemResponse[]>([]);
const usersPending = ref(false);

const fetchUsers = useDebounceFn(async (fullName: string) => {
  usersPending.value = true;
  try {
    const result = await usersApi.list({ fullName, size: 20 });
    users.value = result.content;
  } finally {
    usersPending.value = false;
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

const formSchema = z.object({
  nextAssigneeUserId: z.number().optional(),
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

const { mutate: approveStep, asyncStatus } = casesMutations.useApproveStep({
  onComplete: () => {
    emit("update:open", false);
    emit("success");
  },
});

const isPending = computed(() => asyncStatus.value === "loading");

const onSubmit = handleSubmit((values) => {
  approveStep({
    caseId: props.caseId,
    stepId: props.stepId,
    nextAssigneeUserId: values.nextAssigneeUserId,
  });
});
</script>
