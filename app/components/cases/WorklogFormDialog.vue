<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Registrar trabajo</DialogTitle>
        <DialogDescription>
          Registra las horas trabajadas y un comentario para el paso
          <span class="font-medium text-foreground">{{ stepName }}</span>.
        </DialogDescription>
      </DialogHeader>

      <form @submit="onSubmit" class="space-y-4">
        <VeeField v-slot="{ field, errors, value }" name="comment">
          <Field :data-invalid="!!errors.length">
            <FieldLabel for="worklog-comment">Comentario</FieldLabel>
            <textarea
              id="worklog-comment"
              v-bind="field"
              :value="value"
              :aria-invalid="!!errors.length"
              placeholder="Describe el trabajo realizado..."
              rows="4"
              :disabled="isPending"
              class="file:text-foreground placeholder:text-muted-foreground border-input h-auto w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] resize-none"
            />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>

        <VeeField v-slot="{ field, errors, value }" name="hoursSpent">
          <Field :data-invalid="!!errors.length">
            <FieldLabel for="worklog-hours">Horas trabajadas</FieldLabel>
            <Input
              id="worklog-hours"
              v-bind="field"
              :value="value"
              type="number"
              step="0.1"
              min="0.1"
              placeholder="0.0"
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
            <Icon
              v-if="isPending"
              name="lucide:loader-circle"
              class="inline mr-1 animate-spin"
            />
            Registrar
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
  stepId: number;
  stepName: string;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  success: [];
}>();

const formSchema = z.object({
  comment: z.string().min(1, "El comentario es requerido"),
  hoursSpent: z.coerce.number().min(0.1, "Debe registrar al menos 0.1 horas"),
});

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(formSchema),
});

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) resetForm();
  },
);

const { mutate: createWorklog, asyncStatus } = casesMutations.useCreateWorklog({
  onComplete: () => {
    emit("update:open", false);
    emit("success");
  },
});

const isPending = computed(() => asyncStatus.value === "loading");

const onSubmit = handleSubmit((values) => {
  createWorklog({
    caseId: props.caseId,
    stepId: props.stepId,
    data: { comment: values.comment, hoursSpent: values.hoursSpent },
  });
});
</script>
