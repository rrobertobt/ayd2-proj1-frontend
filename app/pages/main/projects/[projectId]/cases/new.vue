<template>
  <div class="max-w-lg">
    <!-- Back -->
    <div class="flex items-center gap-3 mb-4">
      <Button variant="ghost" size="sm" as-child>
        <NuxtLink :to="`/main/projects/${projectId}/cases`">
          <Icon name="lucide:arrow-left" class="mr-1" />
          Volver a casos
        </NuxtLink>
      </Button>
    </div>

    <h1 class="text-2xl font-bold mb-6 uppercase">Nuevo Caso</h1>

    <form @submit="onSubmit" class="space-y-4">
      <VeeField v-slot="{ field, errors, value }" name="title">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="case-title">Título</FieldLabel>
          <Input
            id="case-title"
            :default-value="value"
            v-bind="field"
            :aria-invalid="!!errors.length"
            placeholder="Describe brevemente el caso"
            :disabled="isPending"
          />
          <FieldError v-if="errors.length" :errors="errors" />
        </Field>
      </VeeField>

      <VeeField v-slot="{ field, errors, value }" name="description">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="case-description">Descripción <span class="text-muted-foreground font-normal">(opcional)</span></FieldLabel>
          <textarea
            id="case-description"
            v-bind="field"
            :value="value"
            :aria-invalid="!!errors.length"
            placeholder="Detalla el caso..."
            rows="4"
            :disabled="isPending"
            class="file:text-foreground placeholder:text-muted-foreground border-input h-auto w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] resize-none"
          />
          <FieldError v-if="errors.length" :errors="errors" />
        </Field>
      </VeeField>

      <VeeField v-slot="{ errors, setValue }" name="caseTypeId">
        <Field :data-invalid="!!errors.length">
          <FieldLabel>Tipo de caso</FieldLabel>
          <Popover v-model:open="caseTypeComboOpen">
            <PopoverTrigger as-child>
              <button
                type="button"
                role="combobox"
                :aria-expanded="caseTypeComboOpen"
                :disabled="isPending"
                :data-invalid="!!errors.length"
                class="border-input bg-background flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 text-sm shadow-xs outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[invalid=true]:border-destructive"
              >
                <span :class="selectedCaseType ? 'text-foreground' : 'text-muted-foreground'">
                  {{ selectedCaseType ? selectedCaseType.name : "Seleccionar tipo de caso..." }}
                </span>
                <Icon name="lucide:chevrons-up-down" class="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </button>
            </PopoverTrigger>
            <PopoverContent class="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Buscar tipo..." />
                <CommandList>
                  <CommandEmpty>No se encontraron tipos de caso.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      v-for="ct in activeCaseTypes"
                      :key="ct.id"
                      :value="String(ct.id)"
                      @select="() => {
                        selectedCaseType = ct;
                        setValue(ct.id);
                        caseTypeComboOpen = false;
                      }"
                    >
                      <Icon
                        name="lucide:check"
                        class="mr-2 h-4 w-4"
                        :class="selectedCaseType?.id === ct.id ? 'opacity-100' : 'opacity-0'"
                      />
                      {{ ct.name }}
                      <span class="ml-1 text-xs text-muted-foreground">({{ ct.stages.length }} etapas)</span>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FieldError v-if="errors.length" :errors="errors" />
        </Field>
      </VeeField>

      <VeeField v-slot="{ field, errors, value }" name="dueDate">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="case-due-date">Fecha límite</FieldLabel>
          <Input
            id="case-due-date"
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

      <div class="flex gap-2 pt-2">
        <Button type="button" variant="outline" :disabled="isPending" as-child>
          <NuxtLink :to="`/main/projects/${projectId}/cases`">Cancelar</NuxtLink>
        </Button>
        <Button type="submit" :disabled="isPending">
          <Icon v-if="isPending" name="lucide:loader-circle" class="inline mr-1 animate-spin" />
          Crear caso
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { z } from "zod";
  import { toTypedSchema } from "@vee-validate/zod";
  import { useForm, Field as VeeField } from "vee-validate";
  import { NuxtLink } from "#components";
  import { Button } from "~/components/ui/button";
  import { Input } from "~/components/ui/input";
  import { Field, FieldLabel, FieldError } from "~/components/ui/field";
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "~/components/ui/popover";
  import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from "~/components/ui/command";
  import { casesMutations } from "~/lib/mutations/cases";
  import { caseTypesApi } from "~/lib/api/case-types";
  import type { CaseTypeItemResponse } from "~/lib/api/case-types";

  const route = useRoute();
  const projectId = computed(() => Number(route.params.projectId));

  // Date helpers
  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  const formSchema = z.object({
    title: z.string().min(1, "El título es requerido").max(250, "Máximo 250 caracteres"),
    description: z.string().optional(),
    caseTypeId: z.number({ required_error: "Selecciona un tipo de caso" }),
    dueDate: z
      .string()
      .min(1, "La fecha límite es requerida")
      .refine((val) => new Date(val) > today, "La fecha debe ser futura"),
  });

  const { handleSubmit } = useForm({
    validationSchema: toTypedSchema(formSchema),
    initialValues: {
      title: "",
      description: "",
      dueDate: "",
    },
  });

  // Load active case types with at least one stage
  const { data: caseTypesData } = await useAsyncData("case-types-select", () =>
    caseTypesApi.list({ size: 100, active: true }),
  );

  const activeCaseTypes = computed(
    () => caseTypesData.value?.content.filter((ct) => ct.stages.length > 0) ?? [],
  );

  const selectedCaseType = ref<CaseTypeItemResponse | undefined>(undefined);
  const caseTypeComboOpen = ref(false);

  const { mutate: createCase, asyncStatus } = casesMutations.useCreateCase({
    onComplete: () => {
      navigateTo(`/main/projects/${projectId.value}/cases`);
    },
  });

  const isPending = computed(() => asyncStatus.value === "loading");

  const onSubmit = handleSubmit((values) => {
    createCase({
      projectId: projectId.value,
      caseTypeId: values.caseTypeId,
      title: values.title,
      description: values.description || undefined,
      dueDate: values.dueDate,
    });
  });

  definePageMeta({
    layout: "app",
  });
</script>
<style scoped></style>