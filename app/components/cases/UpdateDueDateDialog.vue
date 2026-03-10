<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Actualizar fecha límite</DialogTitle>
        <DialogDescription>
          Ingresa la nueva fecha límite para el caso
          <span class="font-medium text-foreground">{{ caseTitle }}</span>.
        </DialogDescription>
      </DialogHeader>

      <form @submit="onSubmit" class="space-y-4">
        <VeeField v-slot="{ field, errors, value }" name="dueDate">
          <Field :data-invalid="!!errors.length">
            <FieldLabel for="due-date-input">Nueva fecha límite</FieldLabel>
            <Input
              id="due-date-input"
              type="date"
              :default-value="value"
              v-bind="field"
              :aria-invalid="!!errors.length"
              :min="minDate"
              :disabled="isPending"
            />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>

        <DialogFooter>
          <DialogClose as-child>
            <Button type="button" variant="outline" :disabled="isPending">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" :disabled="isPending">
            <Icon v-if="isPending" name="lucide:loader-circle" class="inline mr-1 animate-spin" />
            Guardar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "~/components/ui/field";
import { casesMutations } from "~/lib/mutations/cases";

const props = defineProps<{
  open: boolean;
  caseId: number;
  caseTitle: string;
  currentDueDate?: string;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  success: [];
}>();

const today = new Date();
const minDate = today.toISOString().split("T")[0];

const formSchema = z.object({
  dueDate: z
    .string()
    .min(1, "La fecha límite es requerida")
    .refine((val) => new Date(val) > today, "La fecha debe ser futura"),
});

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: { dueDate: "" },
});

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      resetForm({ values: { dueDate: props.currentDueDate ?? "" } });
    }
  },
);

const { mutate: updateDueDate, asyncStatus } = casesMutations.useUpdateDueDate({
  onComplete: () => {
    emit("update:open", false);
    emit("success");
  },
});

const isPending = computed(() => asyncStatus.value === "loading");

const onSubmit = handleSubmit((values) => {
  updateDueDate({ caseId: props.caseId, data: { dueDate: values.dueDate } });
});
</script>
