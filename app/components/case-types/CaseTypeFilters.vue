<template>
  <h3 class="uppercase text-xs tracking-widest font-light pb-4 flex items-center gap-2">
    Filtros:
  </h3>

  <fieldset
    class="grid grid-cols-1 md:grid-cols-3 gap-4"
    v-bind="$attrs"
    :disabled="props.loading"
  >
    <div class="space-y-2">
      <Label class="flex gap-1">
        <Icon name="lucide:search" />
        Búsqueda general
      </Label>
      <Input
        placeholder="Buscar por nombre"
        @input="(e) => inputHandlers.search(e.target.value)"
        :model-value="$route.query.search || ''"
      />
    </div>

    <div class="space-y-2">
      <Label class="flex gap-1">
        <Icon name="lucide:check" />
        Estado
      </Label>
      <NativeSelect
        :model-value="$route.query.active || ''"
        @update:model-value="(val) => inputHandlers.active(val)"
        class="w-full"
      >
        <NativeSelectOption value="">Todos</NativeSelectOption>
        <NativeSelectOption value="true">Activo</NativeSelectOption>
        <NativeSelectOption value="false">Inactivo</NativeSelectOption>
      </NativeSelect>
    </div>
  </fieldset>
</template>

<script setup>
  import Input from "~/components/ui/input/Input.vue";
  import Label from "~/components/ui/label/Label.vue";
  import NativeSelect from "~/components/ui/native-select/NativeSelect.vue";
  import NativeSelectOption from "~/components/ui/native-select/NativeSelectOption.vue";

  const props = defineProps({
    loading: {
      type: Boolean,
      default: false,
    },
  });

  const route = useRoute();

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
    active: createInputHandler("active"),
  };
</script>
