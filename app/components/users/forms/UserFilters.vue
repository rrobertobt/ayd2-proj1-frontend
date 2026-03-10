<template>
  <h3
    class="uppercase text-xs tracking-widest font-light pb-4 flex items-center gap-2"
  >
    Filtros:
  </h3>

  <fieldset
    class="grid grid-cols-1 md:grid-cols-4 gap-4"
    v-bind="$attrs"
    :disabled="props.loading"
  >
    <div class="space-y-2">
      <Label class="flex gap-1">
        <Icon name="lucide:search" />
        Búsqueda general
      </Label>
      <Input
        placeholder="Buscar por nombre, correo..."
        @input="(e) => inputHandlers.search(e.target.value)"
        :model-value="$route.query.search || ''"
      />
    </div>

    <div class="space-y-2">
      <Label class="flex gap-1">
        <Icon name="lucide:user" />
        Nombre
      </Label>
      <Input
        placeholder="Buscar por nombre"
        @input="(e) => inputHandlers.firstName(e.target.value)"
        :model-value="$route.query.firstName || ''"
      />
    </div>

    <div class="space-y-2">
      <Label class="flex gap-1">
        <Icon name="lucide:user" />
        Apellido
      </Label>
      <Input
        placeholder="Buscar por apellido"
        @input="(e) => inputHandlers.lastName(e.target.value)"
        :model-value="$route.query.lastName || ''"
      />
    </div>

    <div class="space-y-2">
      <Label class="flex gap-1">
        <Icon name="lucide:mail" />
        Correo
      </Label>
      <Input
        placeholder="Buscar por correo electrónico"
        @input="(e) => inputHandlers.email(e.target.value)"
        :model-value="$route.query.email || ''"
      />
    </div>

    <div class="space-y-2">
      <Label class="flex gap-1">
        <Icon name="lucide:shield-check" />
        Rol
      </Label>
      <NativeSelect
        :model-value="$route.query.roleId || ''"
        @update:model-value="(val) => inputHandlers.roleId(val)"
        class="w-full"
      >
        <NativeSelectOption value="">Todos los roles</NativeSelectOption>
        <NativeSelectOption
          v-for="role in roles"
          :key="role.id"
          :value="role.id"
        >
          {{ role.name }}
        </NativeSelectOption>
      </NativeSelect>
    </div>

  </fieldset>
</template>

<script setup>
  import Input from "~/components/ui/input/Input.vue";
  import Label from "~/components/ui/label/Label.vue";
  import NativeSelect from "~/components/ui/native-select/NativeSelect.vue";
  import NativeSelectOption from "~/components/ui/native-select/NativeSelectOption.vue";
  import { rolesApi } from "~/lib/api/roles";

  const props = defineProps({
    loading: {
      type: Boolean,
      default: false,
    },
  });

  const route = useRoute();

  const { data: roles } = useAsyncData("roles-filter", () => rolesApi.list(), {
    default: () => [],
  });

  function handleCleanAllFilters() {
    navigateTo({
      query: undefined,
    });
  }

  function createInputHandler(field, options) {
    const updateQuery = (value) => {
      navigateTo({
        query: {
          ...route.query,
          page: 0,
          [field]: value || undefined,
        },
      });
    };

    return options?.debounce ? useDebounceFn(updateQuery, 500) : updateQuery;
  }

  const inputHandlers = {
    search: createInputHandler("search", { debounce: true }),
    firstName: createInputHandler("firstName", { debounce: true }),
    lastName: createInputHandler("lastName", { debounce: true }),
    email: createInputHandler("email", { debounce: true }),
    roleId: createInputHandler("roleId"),
    active: createInputHandler("active"),
  };
</script>

<style scoped></style>
