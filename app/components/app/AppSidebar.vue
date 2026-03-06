<template>
  <Sidebar >
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in items" :key="item.title">
              <SidebarMenuButton as-child>
                <a :href="item.url">
                  <Icon :name="item.icon" />
                  <span>{{ item.title }}</span>
                </a>
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
      title: "Home",
      url: "#",
      icon: 'lucide:house',
    },
    {
      title: "Inbox",
      url: "#",
      icon: 'lucide:inbox',
    },
    {
      title: "Calendar",
      url: "#",
      icon: 'lucide:calendar',
    },
    {
      title: "Search",
      url: "#",
      icon: 'lucide:search',
    },
    {
      title: "Settings",
      url: "#",
      icon: 'lucide:settings',
    },
  ];
</script>
