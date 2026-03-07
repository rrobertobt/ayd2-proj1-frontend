<script setup lang="ts">
  import type { PrimitiveProps } from "reka-ui";
  import type { HTMLAttributes } from "vue";
  import type { ButtonVariants } from ".";
  import { Primitive } from "reka-ui";
  import { cn } from "@/lib/utils";
  import { buttonVariants } from ".";

  interface Props extends PrimitiveProps {
    variant?: ButtonVariants["variant"];
    size?: ButtonVariants["size"];
    class?: HTMLAttributes["class"];
    icon?: string;
    disabled?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    as: "button",
  });
</script>

<template>
  <Primitive
    data-slot="button"
    :data-variant="variant"
    :data-size="size"
    :as="as"
    :disabled="disabled"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <Icon v-if="icon" :name="icon"/>
    <slot />
  </Primitive>
</template>
