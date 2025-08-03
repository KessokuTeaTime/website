<script setup lang="ts">
import { remToPx } from '@/utils/conversion'
import { computed, type PropType } from 'vue'
import { type PageInfo } from '@/types'
import { config } from '@/config'

const props = defineProps({
  pageInfo: {
    type: Object as PropType<PageInfo>,
    required: false
  }
})

const emit = defineEmits({
  back: null
})

const gapSemantic = '1rem'
const gap = computed(() => remToPx(gapSemantic))

const selectedIndex = computed(() => {
  if (props.pageInfo) {
    return config.pageInfo.indexOf(props.pageInfo)
  } else {
    return 0
  }
})

function getHref(pageInfo: PageInfo): string {
  switch (pageInfo.target.type) {
    case 'slug':
      return pageInfo.target.slug
    case 'link':
      return pageInfo.target.link
  }
}
</script>

<template>
  <div class="links-container disable-scrollbars">
    <div spacer="left"></div>
    <template v-for="(pageInfo, index) in config.pageInfo">
      <button v-if="index == selectedIndex" class="selected">{{ pageInfo.name }}</button>
      <a :href="getHref(pageInfo)" v-else>{{ pageInfo.name }}</a>
    </template>
    <div spacer="right"></div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.links-container {
  overflow: auto;
  display: flex;
  gap: v-bind(gapSemantic);

  > [spacer='left'] {
    padding-right: calc(100% - v-bind(gapSemantic));

    @include layout(desktop) {
      padding-right: calc(50% - v-bind(gapSemantic));
    }
  }

  > [spacer='right'] {
    padding-left: calc(100% - v-bind(gapSemantic));

    @include layout(desktop) {
      padding-left: calc(50% - v-bind(gapSemantic));
    }
  }
}

button,
a {
  color: var(--color-text-soft);
  white-space: nowrap;
  font-stretch: expanded;
  text-decoration: none;
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
