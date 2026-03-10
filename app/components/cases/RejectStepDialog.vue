<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Rechazar paso</DialogTitle>
        <DialogDescription>
          Indica el motivo del rechazo para el paso
          <span class="font-medium text-foreground">{{ stepName }}</span>.
          El desarrollador deberá registrar un nuevo worklog.
        </DialogDescription>
      </DialogHeader>

      <form @submit="onSubmit" class="space-y-4">
        <VeeField v-slot="{ field, errors, value }" name="reason">
          <Field :data-invalid="!!errors.length">
            <FieldLabel for="reject-reason">Motivo del rechazo</FieldLabel>
            <textarea
              id="reject-reason"
              v-bind="field"
              :value="value"
              :aria-invalid="!!errors.length"
              placeholder="Describe qué debe corregir o mejorar el desarrollador..."
              rows="4"
              :disabled="isPending"
              class="file:text-foreground placeholder:text-muted-foreground border-input h-auto w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] resize-none"
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
          <Button type="submit" variant="destructive" :disabled="isPending">
            <Icon
              v-if="isPending"
              name="lucide:loader-circle"
              class="inline mr-1 animate-spin"
            />
            Rechazar
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
  reason: z.string().min(1, "El motivo es requerido"),
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

const { mutate: rejectStep, asyncStatus } = casesMutations.useRejectStep({
  onComplete: () => {
    emit("update:open", false);
    emit("success");
  },
});

const isPending = computed(() => asyncStatus.value === "loading");

const onSubmit = handleSubmit((values) => {
  rejectStep({ caseId: props.caseId, stepId: props.stepId, reason: values.reason });
});
</script>
