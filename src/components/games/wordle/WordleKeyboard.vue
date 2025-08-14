<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { PropType } from 'vue'

const props = defineProps({
  keys: {
    type: Object as PropType<{ found: string; misplaced: string }>,
    required: false
  }
})

function getState(key: string): 'found' | 'misplaced' | undefined {
  if (props.keys != null) {
    if (props.keys.found.includes(key.toLowerCase())) {
      return 'found'
    } else if (props.keys.misplaced.includes(key.toLowerCase())) {
      return 'misplaced'
    }
  }
}
</script>

<template>
  <div class="keyboard-container">
    <div class="keyboard-main">
      <div class="keyboard-row" data-row="1">
        <!--QWERTYUIOP-->
        <div class="key-spacer" data-side="left"></div>
        <button v-for="c in 'QWERTYUIOP'" class="key" :data-state="getState(c)" :data-key="c">
          {{ c }}
        </button>
        <div class="key-spacer" data-side="right"></div>
      </div>

      <div class="keyboard-row" data-row="2">
        <div class="key-spacer" data-side="left"></div>
        <!--ASDFGHJKL-->
        <button v-for="c in 'ASDFGHJKL'" class="key" :data-state="getState(c)" :data-key="c">
          {{ c }}
        </button>
        <div class="key-spacer" data-side="right"></div>
      </div>

      <div class="keyboard-row" data-row="3">
        <div class="key-spacer" data-side="left"></div>
        <!--ZXCVBNM-->
        <button v-for="c in 'ZXCVBNM'" class="key" :data-state="getState(c)" :data-key="c">
          {{ c }}
        </button>
        <div class="key-spacer" data-side="right"></div>
      </div>

      <div class="keyboard-row" data-row="4">
        <button class="key" :style="{ '--span': 3.5 }" data-key="backspace">
          <Icon icon="f7:delete-left-fill" />
        </button>
        <div class="key" :style="{ '--span': 2 }" hidden />
        <button class="key" :style="{ '--span': 3.5 }" data-key="return">
          <Icon icon="f7:return" />
        </button>
      </div>
    </div>
    <div class="keyboard-auxiliary"></div>
  </div>
</template>

<style lang="scss" scoped>
.keyboard-container {
  display: flex;
  flex-direction: column;
  justify-content: center;

  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;

  --gap: 8px;
  --span: 1;
}

.keyboard-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--gap);
}

.keyboard-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: min-content;
  gap: var(--gap);
}

.key,
.key-spacer {
  height: 3rem;
}

.key {
  font-family: var(--font-mono);
  font-size: medium;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(max(var(--span), 1) * var(--cell-width) + max(var(--span) - 1, 0) * var(--gap));
  background: var(--color-background-mute);
  border-radius: 6px;
  transition: scale var(--duration-fast) cubic-bezier(0.3, 0.96, 0.48, 1.11);

  --cell-width: min(3rem, calc(100vw / 11 - var(--gap)));

  &:active {
    scale: 0.9;
  }

  &[hidden] {
    background: none;
    opacity: 0;
  }

  &[data-key='return'] {
    color: var(--color-background);
    background: var(--tint);
  }

  &[data-state='found'] {
    font-weight: 600;
    color: var(--color-background);
    background: var(--tint);
  }

  &[data-state='misplaced'] {
    color: var(--tint);
    background: var(--tint-mute);
  }
}
</style>
