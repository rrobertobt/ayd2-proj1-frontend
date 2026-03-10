<template>
  <div>
    <h1 class="text-2xl font-bold mb-4 uppercase">Mis proyectos</h1>
    <p class="text-muted-foreground">
      Aquí puedes ver los proyectos en los que estás involucrado como
      administrador.
    </p>

    <div v-if="projects">
      <ItemsIterator :items="projects" no-pagination class="py-4">
        <template #default="{ item }">
          <Card class="hover:bg-secondary/50 transition-colors">
            <CardHeader>
              <CardTitle>{{ item.name }}</CardTitle>
              <CardDescription>{{ item.description }}</CardDescription>
            </CardHeader>
            <CardContent class="text-sm">
              <div class="space-y-2">
                <span>
                  <span class="font-medium pr-1">Estado:</span>
                  <Badge
                    :class="{
                      'bg-green-100 text-green-700': item.status === 'ACTIVE',
                      'bg-red-100 text-red-700': item.status === 'INACTIVE',
                    }"
                    >{{ item.status }}</Badge
                  >
                </span>
                <p>
                  <span class="font-medium pr-1">Registrado el:</span>
                  <span class="text-muted-foreground">
                    {{ new Date(item.createdAt).toLocaleDateString("es-GT") }}
                  </span>
                </p>
              </div>
            </CardContent>
            <CardFooter class="flex flex-col items-start gap-3">
              <Button variant="outline" size="sm" as-child>
                <NuxtLink :to="`/main/projects/${item.id}`">
                  <Icon name="lucide:arrow-right" />
                  Ver detalles
                </NuxtLink>
              </Button>
            </CardFooter>
          </Card>
        </template>
      </ItemsIterator>
    </div>
  </div>
</template>
<script setup lang="ts">
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import ItemsIterator from "~/components/partials/iterator/ItemsIterator.vue";
  import Badge from "~/components/ui/badge/Badge.vue";
  import { Button } from "~/components/ui/button";
  import { projectsApi } from "~/lib/api/projects";

  const { data: projects, refresh } = useAsyncData("my-projects", () =>
    projectsApi.listMy(),
  );

  definePageMeta({
    layout: "app",
  });
</script>
<style scoped></style>
