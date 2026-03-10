<template>
  <div>
    <h1 class="text-2xl font-bold mb-4 uppercase">Usuarios</h1>
    <div class="space-y-2">
      <h2 class="uppercase text-xs tracking-widest font-light">Acciones:</h2>
      <Button as-child>
        <NuxtLink to="/main/users/new">
          <Icon name="lucide:plus" class="inline mr-1" />
          Crear/Registrar
        </NuxtLink>
      </Button>
    </div>
    <div class="pt-4 rounded-lg">
      <UserFilters :loading="status === 'pending'" />
    </div>
    <div class="pt-6 rounded-lg relative" v-if="data">
      <DataTable
        :columns="columns"
        :data="data.content"
        :totalElements="data.totalElements"
        :totalPages="data.totalPages"
        :paginationState="paginationOptions"
        :enable-sorting="false"
        @pagination-change="
          ($event) => {
            if (typeof $event === 'function') {
              paginationOptions = $event(paginationOptions);
            } else {
              paginationOptions = {
                ...paginationOptions,
                ...$event,
              };
            }
          }
        "
      />
    </div>
  </div>
</template>
<script setup lang="tsx">
  import type { ColumnDef } from "@tanstack/vue-table";
  import DataTable from "~/components/partials/DataTable.vue";
  import { usersApi, type UserItemResponse } from "~/lib/api/users";
  import { Icon, NuxtLink } from "#components";
  import { Button } from "~/components/ui/button";
  import Badge from "~/components/ui/badge/Badge.vue";
  import UserFilters from "~/components/users/forms/UserFilters.vue";

  import UserActionsTable from "~/components/users/table/UserActionsTable.vue";
  const route = useRoute();
  const { data, status, refresh } = useAsyncData(
    "admin-users",
    () =>
      usersApi.list({
        page: route.query.page ? Number(route.query.page) : 0,
        // All filters from the query
        ...route.query,
      }),
    { watch: [() => route.query] },
  );

  const paginationOptions = computed({
    get: () => ({
      pageIndex: route.query.page ? Number(route.query.page) - 1 : 0,
      pageSize: route.query.limit ? Number(route.query.limit) : 10,
    }),
    set: (value) => {
      navigateTo({
        query: {
          ...route.query,
          page: value.pageIndex,
          limit: value.pageSize,
        },
      });
    },
  });

  
  const columns: ColumnDef<UserItemResponse>[] = [
    {
      accessorFn: (row) => {
        return `${row.employee.firstName} ${row.employee.lastName}`;
      },
      id: "fullName",
      meta: {
        displayName: "Nombres",
      },
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:user" class="inline mr-1 " />
          Nombres
        </div>
      ),
      cell: ({ row }) => (
        <div class="text-base">{row.getValue("fullName")}</div>
      ),
    },
    {
      accessorKey: "username",
      meta: {
        displayName: "Nombre de Usuario",
      },
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:at-sign" class="inline mr-1 " />
          Nombre de Usuario
        </div>
      ),
      cell: ({ row }) => (
        <div class="text-sm font-mono p-1 bg-muted rounded">
          {row.getValue("username")}
        </div>
      ),
    },
    {
      accessorKey: "email",
      meta: {
        displayName: "Correo Electrónico",
      },
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:mail" class="inline mr-1 " />
          Correo Electrónico
        </div>
      ),
      cell: ({ row }) => <div class="text-base">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "role.name",
      meta: {
        displayName: "Rol",
      },
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:shield-check" class="inline mr-1 " />
          Rol
        </div>
      ),
    },
    {
      accessorKey: "active",
      meta: {
        displayName: "Estado",
      },
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:check" class="inline mr-1 " />
          Estado
        </div>
      ),
      cell: ({ row }) => (
        <Badge
          variant={row.getValue("active") ? "default" : "destructive"}
          class="mx-auto"
        >
          {row.getValue("active") ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    {
      accessorKey: "employee.hourlyRate",
      meta: {
        displayName: "Tarifa por Hora",
      },
      header: () => (
        <div class="text-center font-semibold">
          <Icon name="lucide:currency" class="inline mr-1 " />
          Tarifa por Hora
        </div>
      ),
      cell: ({ row }) => (
        <div class="text-sm font-mono">${row.original.employee.hourlyRate}</div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div class="relative">
          <UserActionsTable userId={row.original.id} onAction-complete={refresh} active={row.original.active} />
        </div>
      ),
    },
  ];

  definePageMeta({
    layout: "app",
  });
</script>
<style scoped></style>
