<template>
  <Toaster
    position="top-center"
    :toast-options="{
      duration: 5000,
      classes: {
        toast: 'font-sans',
        description: '!text-muted-foreground',
      },
    }"
  />
  <NuxtLayout>
    <slot />
  </NuxtLayout>
</template>

<script setup lang="ts">
  import "vue-sonner/style.css";
  import { Toaster } from "vue-sonner";

</script>
