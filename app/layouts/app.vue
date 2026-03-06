<template>
  <SidebarProvider>
    <AppSidebar />
    <main class="px-8 py-4 w-full">
      <div class="flex justify-between items-center w-full">
        <SidebarTrigger class="mb-2" />

        <section>
          <DropdownMenu>
            <DropdownMenuTrigger class="flex gap-2 py-1 px-2 hover:bg-accent items-center text-left">
              <Icon name="lucide:user-round" />
              <span class="flex flex-col">
                <span class="text-sm font-medium">
                  {{ session?.employee.firstName }}
                  {{ session?.employee.lastName }}
                </span>
                <span class="uppercase font-light text-xs text-muted-foreground">{{
                  session?.role.name
                }}</span>
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-56" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Keyboard shortcuts
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        </section>
      </div>
      <NuxtPage />
    </main>
  </SidebarProvider>
</template>
<script setup lang="ts">
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "~/components/ui/dropdown-menu";

  import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";

  const sessionStore = useSessionStore();
  const { session } = storeToRefs(sessionStore);
</script>
<style scoped></style>
