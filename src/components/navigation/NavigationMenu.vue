<script setup lang="ts">
import { ref } from 'vue'
import { size } from '@/utils/const'

const isExpanded = ref(false)
</script>

<template>
  <div class="menu-container disable-scrollbars">
    <button @click="isExpanded = true">Navigation Menu</button>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.menu-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  overflow: scroll;
  mask: linear-gradient(
    to right,
    transparent 0%,
    white 2rem,
    white calc(100% - 4px),
    transparent 100%
  );

  @include layout(desktop) {
    justify-content: center;

    mask: linear-gradient(
      to right,
      transparent 0%,
      white 2rem,
      white calc(100% - 2rem),
      transparent 100%
    );
  }
  border: 1px solid red;
}

button {
  white-space: nowrap;
  font-stretch: expanded;
  width: fit-content;
  transition:
    text-decoration var(--duration-fast) ease,
    scale var(--duration-fast) ease;

  &:active {
    scale: 0.95;
  }
}
</style>
