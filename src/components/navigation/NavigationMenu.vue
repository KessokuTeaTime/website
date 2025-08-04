<script setup lang="ts">
import { ref, computed } from 'vue'
import NavigationPalette from './NavigationPalette.vue'
import { type PageInfo, type PageInfoTargetSlug, type PageInfoTargetLink } from '@/types'
import { config } from '@/config'

const props = defineProps({
  slug: {
    type: String,
    required: false
  }
})

const isExpanded = ref(false)

const pageInfo = computed(() => {
  if (!props.slug || !config.pageInfo) return undefined

  return config.pageInfo.find((info) => {
    if (info.target.type == 'slug') {
      return info.target.slug === props.slug
    } else {
      return false
    }
  })
})
</script>

<template>
  <div class="menu-container" :class="{ masked: isExpanded }">
    <Transition name="fade">
      <button v-if="!isExpanded" @click="isExpanded = true">Navigation Menu</button>
      <NavigationPalette :page-info="pageInfo" v-else class="palette" @back="isExpanded = false" />
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
  --mask: linear-gradient(
    to right,
    transparent 0%,
    white 2rem,
    white calc(100% - 4px),
    transparent 100%
  );
  border: 1px solid red;

  @include layout(desktop) {
    justify-content: center;

    --mask: linear-gradient(
      to right,
      transparent 0%,
      white 2rem,
      white calc(100% - 2rem),
      transparent 100%
    );
  }

  &.masked {
    mask: var(--mask);
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

  &:before {
    content: '<>';
    display: inline;
    font-family: var(--font-mono);
    font-variant-ligatures: none;
    color: var(--color-text-soft);
    margin-right: 2px;

    @include layout(desktop) {
      content: '<';
      display: inline;
    }
  }

  &:after {
    content: none;
    display: none;
    font-family: var(--font-mono);
    font-variant-ligatures: none;
    color: var(--color-text-soft);
    margin-left: 2px;

    @include layout(desktop) {
      content: '>';
      display: inline;
    }
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
