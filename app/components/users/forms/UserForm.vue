<template>
  <form @submit="onSubmit" id="userForm" class="py-2">
    <fieldset class="grid grid-cols-1 md:grid-cols-2 gap-2" :disabled="props.loading">
      <VeeField v-slot="{ field, errors, value }" name="username">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="username"> Nombre de usuario </FieldLabel>
          <Input
            id="username"
            :default-value="value"
            v-bind="field"
            :aria-invalid="!!errors.length"
            placeholder="shadcn"
            autocomplete="username"
          />
          <FieldError v-if="errors.length" :errors="errors" />
        </Field>
      </VeeField>

      <VeeField v-slot="{ field, errors, value }" name="email">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="email"> Correo electrónico </FieldLabel>
          <Input
            id="email"
            :default-value="value"
            v-bind="field"
            type="email"
            :aria-invalid="!!errors.length"
            placeholder="usuario@ejemplo.com"
            autocomplete="email"
          />
          <FieldError v-if="errors.length" :errors="errors" />
        </Field>
      </VeeField>

      <VeeField v-slot="{ field, errors }" name="password" v-if="!props.hidePassword">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="password"> Contraseña </FieldLabel>
          <Input
            id="password"
            v-bind="field"
            type="password"
            :aria-invalid="!!errors.length"
            placeholder="********"
            autocomplete="new-password"
          />
          <FieldDescription>
            Introduce una contraseña inicial para el usuario. Si lo dejas en
            blanco, se enviará un enlace al correo asociado para completar el
            registro
          </FieldDescription>
          <FieldError v-if="errors.length" :errors="errors" />
        </Field>
      </VeeField>

      <VeeField v-slot="{ field, errors, value }" name="employee.firstName">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="firstName"> Nombre </FieldLabel>
          <Input
            id="firstName"
            v-bind="field"
            :default-value="value"
            :aria-invalid="!!errors.length"
            placeholder="Juan"
            autocomplete="given-name"
          />
          <FieldError v-if="errors.length" :errors="errors" />
        </Field>
      </VeeField>

      <VeeField v-slot="{ field, errors, value }" name="employee.lastName">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="lastName"> Apellido </FieldLabel>
          <Input
            id="lastName"
            v-bind="field"
            :default-value="value"
            :aria-invalid="!!errors.length"
            placeholder="Pérez"
            autocomplete="family-name"
          />
          <FieldError v-if="errors.length" :errors="errors" />
        </Field>
      </VeeField>

      <VeeField v-if="!props.hideRole" v-slot="{ field, errors }" name="roleId">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="roleId"> Rol </FieldLabel>
          <NativeSelect
            @update:model-value="field.onChange"
            :name="field.name"
            :model-value="field.value"
          >
            <NativeSelectOption value="">
              Selecciona un rol
            </NativeSelectOption>
            <NativeSelectOption
              v-for="role in availableRoles"
              :key="role.id"
              :value="role.id"
            >
              {{ role.name }}
            </NativeSelectOption>
          </NativeSelect>
          <FieldError v-if="errors.length" :errors="errors" />
        </Field>
      </VeeField>

      <VeeField v-slot="{ field, errors, value }" name="employee.hourlyRate">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="hourlyRate"> Tarifa por hora </FieldLabel>
          <Input
            id="hourlyRate"
            v-bind="field"
            :default-value="value"
            type="number"
            min="0"
            max="10000"
            step="0.01"
            :aria-invalid="!!errors.length"
            placeholder="0.00"
            inputmode="decimal"
          />
          <FieldError v-if="errors.length" :errors="errors" />
        </Field>
      </VeeField>
    </fieldset>

    <Button
      type="submit"
      form="userForm"
      icon="lucide:save"
      class="mt-4"
      :disabled="props.loading"
    >
      Guardar
    </Button>
  </form>
</template>
<script setup lang="ts">
  import { z } from "zod";
  import { toTypedSchema } from "@vee-validate/zod";
  import { useForm, Field as VeeField } from "vee-validate";
  import { rolesApi } from "~/lib/api/roles";
  import { Input } from "~/components/ui/input";
  import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldError,
    FieldDescription,
  } from "~/components/ui/field";
  import { Button } from "~/components/ui/button";
  import { NativeSelect, NativeSelectOption } from "~/components/ui/native-select";

  const props = defineProps<{
    loading?: boolean;
    hideRole?: boolean;
    hidePassword?: boolean;
    initialValues?: {
      username?: string;
      email?: string;
      roleId?: number;
      employee?: {
        firstName?: string;
        lastName?: string;
        hourlyRate?: number;
      };
    };
  }>();

  const { data: availableRoles } = useAsyncData(() => rolesApi.list(), {
    lazy: true,
  });

  const formSchema = z.object({
    username: z.string().min(5).max(100),
    email: z.string().email().max(100),
    password: z.string().optional(),
    roleId: props.hideRole ? z.number().optional() : z.number(),
    employee: z.object({
      firstName: z.string().min(2).max(100),
      lastName: z.string().min(2).max(100),
      hourlyRate: z.number().min(0).max(10000),
    }),
  });

  const { handleSubmit } = useForm({
    validationSchema: toTypedSchema(formSchema),
    initialValues: {
      username: props.initialValues?.username ?? "",
      email: props.initialValues?.email ?? "",
      password: undefined,
      roleId: props.initialValues?.roleId ?? undefined,
      employee: {
        firstName: props.initialValues?.employee?.firstName ?? "",
        lastName: props.initialValues?.employee?.lastName ?? "",
        hourlyRate: props.initialValues?.employee?.hourlyRate ?? 0,
      },
    },
  });

  const emit = defineEmits<{
    (e: "submit", values: z.infer<typeof formSchema>): void;
  }>();

  const onSubmit = handleSubmit((values) => {
    if (!values.password) values.password = undefined;

    emit("submit", values);
  });
</script>
<style scoped></style>
