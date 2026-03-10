<template>
  <Sidebar>
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <div
              class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
            >
              <Icon name="lucide:briefcase" class="size-4" />
            </div>
            <div class="grid flex-1 text-left leading-tight">
              <span class="truncate font-semibold text-lg">Code 'n Bugs</span>
              <span class="truncate">Tracking</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Administración</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in itemsMapped" :key="item.title">
              <SidebarMenuButton as-child>
                <NuxtLink :to="item.url">
                  <Icon :name="item.icon" />
                  <span>{{ item.title }}</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>

<script setup lang="ts">
  import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarHeader,
  } from "@/components/ui/sidebar";

  const sessionStore = useSessionStore();
  const { session, roleChecker } = storeToRefs(sessionStore);

  const itemsMapped = computed(() => {
    if (roleChecker.value.isSystemAdmin) {
      return [
        {
          title: "Dashboard",
          url: "/main/dashboard",
          icon: "lucide:house",
        },
        {
          title: "Usuarios",
          url: "/main/users",
          icon: "lucide:users",
        },
        {
          title: "Proyectos",
          url: "/main/projects",
          icon: "lucide:folder",
        },
        {
          title: "Casos",
          url: "/main/cases",
          icon: "lucide:file-text",
        },
        {
          title: "Tipos de caso",
          url: "/main/case-types",
          icon: "lucide:tag",
        },
        {
          title: "Reportes",
          url: "/main/reports",
          icon: "lucide:chart-line",
        },
      ];
    } else if (roleChecker.value.isProjectAdmin) {
      return [
        {
          title: "Dashboard",
          url: "/main/dashboard",
          icon: "lucide:house",
        },
        {
          title: "Mis proyectos",
          url: "/main/my/projects",
          icon: "lucide:folder-open",
        },
      ];
    } else if (roleChecker.value.isDeveloper) {
      return [
        {
          title: "Dashboard",
          url: "/main/dashboard",
          icon: "lucide:house",
        },
        {
          title: "Mis Casos",
          url: "/main/my/cases",
          icon: "lucide:file-text",
        }
      ];
    }
    return [];
  });

</script>
