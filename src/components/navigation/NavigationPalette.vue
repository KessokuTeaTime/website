<script setup lang="ts">
import { remToPx } from '@/utils/conversion'
import { computed, onMounted, ref, useTemplateRef, watchEffect, type PropType } from 'vue'
import { type PageInfo } from '@/types'
import { config } from '@/config'
import { useWindowSize } from '@vueuse/core'
import { layoutWidth } from '@/utils/const'

// Definitions

const props = defineProps({
  pageInfo: {
    type: Object as PropType<PageInfo>,
    required: false
  }
})

const emit = defineEmits({
  back: null
})

// Constants

const gapSemantic = '1rem'

// Reactives

const links = useTemplateRef('links')
const sortedLinks = computed(() => {
  if (links.value) {
    return Array.from(links.value).sort((a, b) => {
      const indexA = parseInt(a.dataset.index || '0')
      const indexB = parseInt(b.dataset.index || '0')
      return indexA - indexB
    })
  } else {
    return []
  }
})

const leadingLinkWidth = computed(() => {
  if (sortedLinks.value && sortedLinks.value.length > 0) {
    return sortedLinks.value[0].clientWidth
  } else {
    return 0
  }
})
const leadingLinkWidthSemantic = computed(() => {
  return `${leadingLinkWidth.value}px`
})

const trailingLinkWidth = computed(() => {
  if (sortedLinks.value && sortedLinks.value.length > 0) {
    return sortedLinks.value[sortedLinks.value.length - 1].clientWidth
  } else {
    return 0
  }
})
const trailingLinkWidthSemantic = computed(() => {
  return `${trailingLinkWidth.value}px`
})

const selectedIndex = computed(() => {
  if (props.pageInfo) {
    return config.pageInfo.indexOf(props.pageInfo)
  } else {
    return undefined
  }
})
const alignmentIndex = computed(() => {
  return selectedIndex.value ?? 0
})

// Functions

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
    <div spacer="leading"></div>
    <div
      v-for="(pageInfo, index) in config.pageInfo"
      class="target"
      :key="index"
      ref="links"
      :data-index="index"
      :type="pageInfo.target.type"
    >
      <button v-if="index == selectedIndex" class="selected" @click="$emit('back')">
        {{ pageInfo.name }}
      </button>
      <a :href="getHref(pageInfo)" v-else>{{ pageInfo.name }}</a>
    </div>
    <div spacer="trailing"></div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.links-container {
  overflow: auto;
  display: flex;
  flex-direction: row-reverse;
  gap: v-bind(gapSemantic);

  @include layout(desktop) {
    flex-direction: row;
    --padding-spacer: calc((100% - v-bind(gapSemantic)) / 2);
  }

  > [spacer='leading'] {
    display: none;
    padding-right: calc(100% - v-bind(leadingLinkWidthSemantic) - v-bind(gapSemantic));

    @include layout(desktop) {
      display: inline;
      padding-right: calc((100% - v-bind(leadingLinkWidthSemantic)) / 2 - v-bind(gapSemantic));
    }
  }

  > [spacer='trailing'] {
    display: inline;
    padding-left: calc(100% - v-bind(trailingLinkWidthSemantic) - v-bind(gapSemantic));

    @include layout(desktop) {
      padding-left: calc((100% - v-bind(trailingLinkWidthSemantic)) / 2 - v-bind(gapSemantic));
    }
  }
}

.target[type='link']::after {
  content: '↗';
  display: inline;
  font-family: var(--font-mono);
  font-variant-ligatures: none;
  color: var(--color-text-soft);
  margin-right: 2px;
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
