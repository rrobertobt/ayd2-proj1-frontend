<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ isEdit ? "Editar proyecto" : "Nuevo proyecto" }}</DialogTitle>
        <DialogDescription>
          {{
            isEdit
              ? "Modifica los datos del proyecto y guarda los cambios."
              : "Completa los datos para crear un nuevo proyecto."
          }}
        </DialogDescription>
      </DialogHeader>

      <form @submit="onSubmit" class="space-y-4">
        <VeeField v-slot="{ field, errors, value }" name="name">
          <Field :data-invalid="!!errors.length">
            <FieldLabel for="project-name">Nombre</FieldLabel>
            <Input
              id="project-name"
              :default-value="value"
              v-bind="field"
              :aria-invalid="!!errors.length"
              placeholder="Nombre del proyecto"
              :disabled="isPending"
            />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>

        <VeeField v-slot="{ field, errors, value }" name="description">
          <Field :data-invalid="!!errors.length">
            <FieldLabel for="project-description">Descripción</FieldLabel>
            <textarea
              id="project-description"
              v-bind="field"
              :value="value"
              :aria-invalid="!!errors.length"
              placeholder="Descripción del proyecto"
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
            {{ isEdit ? "Guardar cambios" : "Crear proyecto" }}
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

const isEdit = computed(() => !!props.project);

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(255),
  description: z.string().min(1, "La descripción es requerida").max(1000),
});

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    name: "",
    description: "",
  },
});

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      resetForm({
        values: {
          name: props.project?.name ?? "",
          description: props.project?.description ?? "",
        },
      });
    }
  },
);

const closeDialog = () => emit("update:open", false);

const { mutate: createProject, asyncStatus: createStatus } =
  projectsMutations.useCreateProject({
    onComplete: () => {
      closeDialog();
      emit("success");
    },
  });

const { mutate: updateProject, asyncStatus: updateStatus } =
  projectsMutations.useUpdateProject({
    onComplete: () => {
      closeDialog();
      emit("success");
    },
  });

const isPending = computed(
  () => createStatus.value === "loading" || updateStatus.value === "loading",
);

const onSubmit = handleSubmit((values) => {
  if (isEdit.value && props.project) {
    updateProject({ projectId: props.project.id, data: values });
  } else {
    createProject(values);
  }
});
</script>
