<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ isEdit ? "Editar etapa" : "Nueva etapa" }}</DialogTitle>
        <DialogDescription>
          {{
            isEdit
              ? "Modifica los datos de la etapa y guarda los cambios."
              : "Agrega una nueva etapa al flujo del tipo de caso."
          }}
        </DialogDescription>
      </DialogHeader>

      <form @submit="onSubmit" class="space-y-4">
        <VeeField v-slot="{ field, errors, value }" name="name">
          <Field :data-invalid="!!errors.length">
            <FieldLabel for="stage-name">Nombre</FieldLabel>
            <Input
              id="stage-name"
              :default-value="value"
              v-bind="field"
              :aria-invalid="!!errors.length"
              placeholder="Ej. Análisis, Desarrollo, QA..."
              :disabled="isPending"
            />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>

        <VeeField v-slot="{ field, errors, value }" name="stageOrder">
          <Field :data-invalid="!!errors.length">
            <FieldLabel for="stage-order">Orden</FieldLabel>
            <Input
              id="stage-order"
              :default-value="value"
              v-bind="field"
              type="number"
              min="1"
              step="1"
              :aria-invalid="!!errors.length"
              placeholder="1"
              :disabled="isPending"
            />
            <FieldDescription>
              Número entero que determina la posición en el flujo. Debe ser único por tipo de caso.
            </FieldDescription>
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>

        <VeeField v-slot="{ field, errors, value }" name="description">
          <Field :data-invalid="!!errors.length">
            <FieldLabel for="stage-description">Descripción <span class="text-muted-foreground font-normal">(opcional)</span></FieldLabel>
            <textarea
              id="stage-description"
              v-bind="field"
              :value="value"
              :aria-invalid="!!errors.length"
              placeholder="Descripción de la etapa..."
              rows="3"
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
          <Button type="submit" :disabled="isPending">
            <Icon
              v-if="isPending"
              name="lucide:loader-circle"
              class="inline mr-1 animate-spin"
            />
            {{ isEdit ? "Guardar cambios" : "Agregar etapa" }}
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
import { Field, FieldLabel, FieldError, FieldDescription } from "~/components/ui/field";
import type { StageItemResponse } from "~/lib/api/case-types";
import { caseTypesMutations } from "~/lib/mutations/case-types";

const props = defineProps<{
  open: boolean;
  caseTypeId: number;
  stage?: StageItemResponse;
  initialStageOrder?: number;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  success: [];
}>();

const isEdit = computed(() => !!props.stage);

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(150, "Máximo 150 caracteres"),
  description: z.string().optional(),
  stageOrder: z.coerce
    .number({ invalid_type_error: "Debe ser un número" })
    .int("Debe ser un entero")
    .min(1, "El orden mínimo es 1"),
});

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    name: "",
    description: "",
    stageOrder: 0,
  },
});

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      resetForm({
        values: {
          name: props.stage?.name ?? "",
          description: props.stage?.description ?? "",
          stageOrder: props.stage?.stageOrder ?? props.initialStageOrder ?? 1,
        },
      });
    }
  },
);

const closeDialog = () => emit("update:open", false);

const { mutate: createStage, asyncStatus: createStatus } =
  caseTypesMutations.useCreateStage({
    onComplete: () => {
      closeDialog();
      emit("success");
    },
  });

const { mutate: updateStage, asyncStatus: updateStatus } =
  caseTypesMutations.useUpdateStage({
    onComplete: () => {
      closeDialog();
      emit("success");
    },
  });

const isPending = computed(
  () => createStatus.value === "loading" || updateStatus.value === "loading",
);

const onSubmit = handleSubmit((values) => {
  if (isEdit.value && props.stage) {
    updateStage({ caseTypeId: props.caseTypeId, stageId: props.stage.id, data: values });
  } else {
    createStage({ caseTypeId: props.caseTypeId, data: values });
  }
});
</script>
