<template>
  <Sidebar >
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in items" :key="item.title">
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
  } from "@/components/ui/sidebar";

  const items = [
    {
      title: "Dashboard",
      url: "/main/dashboard",
      icon: 'lucide:house',
    },
    {
      title: "Usuarios",
      url: "/main/users",
      icon: 'lucide:users',
    },
    {
      title: "Proyectos",
      url: "/main/projects",
      icon: 'lucide:folder',
    },
    {
      title: "Ajustes",
      url: "#",
      icon: 'lucide:settings',
    },
  ];
</script>
