<script setup lang="ts">
import { ref } from 'vue'
import NavigationPalette from './NavigationPalette.vue'

const isExpanded = ref(false)
</script>

<template>
  <div class="menu-container">
    <Transition name="fade">
      <button @click="isExpanded = true" v-if="!isExpanded">Navigation Menu</button>
      <NavigationPalette v-else class="palette" @back="isExpanded = false" />
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.menu-container {
  position: relative;
  width: 100%;
  height: 1rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  mask: linear-gradient(
    to right,
    transparent 0%,
    white 2rem,
    white calc(100% - 4px),
    transparent 100%
  );
  border: 1px solid red;

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
}

.palette {
  position: absolute;
  width: 100%;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--duration-fast) ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
