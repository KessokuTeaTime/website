<script setup lang="ts">
import { ref } from 'vue'

const isExpanded = ref(false)
</script>

<template>
  <div :class="{ expanded: isExpanded }">
    <button @click="isExpanded = !isExpanded">Navigation Menu</button>
  </div>
</template>

<style lang="scss" scoped>
* {
  font-stretch: expanded;

  .expanded & {
    text-decoration: underline;
    text-decoration-color: var(--color-text-soft);
  }
}

button {
  transition:
    text-decoration var(--duration-fast) ease,
    scale var(--duration-fast) ease;

  &:active {
    scale: 0.95;
  }
}
</style>
