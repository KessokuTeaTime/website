<script setup lang="ts">
import { computed, ref } from 'vue'

const emit = defineEmits({
  back: null
})

const paletteContainer = ref<HTMLElement | null>(null)
const paletteContainerWidth = computed(() => {
  if (paletteContainer.value?.clientWidth) {
    return `${paletteContainer.value.clientWidth}px`
  } else {
    return '100%'
  }
})
</script>

<template>
  <div class="palette-container" ref="paletteContainer">
    <div class="spacer"></div>
    <a href="/">Link</a>
    <button @click="$emit('back')" class="selected">Navigation Menu</button>
    <div class="spacer"></div>
  </div>
</template>

<style lang="scss" scoped>
.palette-container {
  overflow: scroll;
  display: flex;
  gap: 1rem;
  border: 1px solid blue;
}

.spacer {
  width: 1000px;
  // background: var(--color-border);
}

a {
  text-decoration: none;
}

button,
a {
  color: var(--color-text-soft);
  white-space: nowrap;
  font-stretch: expanded;
  width: fit-content;
  transition:
    color var(--duration-fast) ease,
    scale var(--duration-fast) ease;

  &:active {
    scale: 0.95;
  }
}

.selected {
  color: var(--color-text);
  text-decoration: underline;
  text-decoration-color: var(--color-text-soft);
}
</style>
