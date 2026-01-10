<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { keyboardRows } from '@/lib/wordle'

const props = defineProps<{
  keys?: { found: string; misplaced: string; notFound: string }
  canDelete?: boolean
  canSubmit?: boolean
  isFinished: boolean
}>()

const emit = defineEmits<{
  typeDown: [key: string]
  typeUp: [key: string]
  deleteDown: []
  deleteUp: []
  submitDown: []
  submitUp: []
}>()

function getState(_key: string): 'found' | 'misplaced' | 'not-found' | undefined {
  const key = _key.toLowerCase()
  if (props.keys != null) {
    if (props.keys.found.includes(key)) {
      return 'found'
    } else if (props.keys.misplaced.includes(key)) {
      return 'misplaced'
    } else if (props.keys.notFound.includes(key)) {
      return 'not-found'
    }
  }
}
</script>

<template>
  <div class="keyboard-container">
    <div class="keyboard-main">
      <div v-for="(row, index) in keyboardRows" :key="index" class="keyboard-row" :data-row="index">
        <div class="key-spacer" data-side="left"></div>
        <button
          v-for="c in row.toLowerCase()"
          :key="c"
          @mousedown="emit('typeDown', c)"
          @mouseup="emit('typeUp', c)"
          class="key"
          :data-state="getState(c)"
          :data-key="c"
        >
          {{ c }}
        </button>
        <div class="key-spacer" data-side="right"></div>
      </div>
    </div>
    <div class="keyboard-actions" :hidden="isFinished">
      <div class="keyboard-row" data-row="4">
        <button
          @mousedown="emit('deleteDown')"
          @mouseup="emit('deleteUp')"
          class="key"
          :style="{ '--span': 3.5 }"
          data-key="backspace"
          :disabled="!canDelete"
        >
          <Icon icon="f7:delete-left-fill" />
        </button>
        <div class="key" :style="{ '--span': 2 }" hidden />
        <button
          @mousedown="emit('submitDown')"
          @mouseup="emit('submitUp')"
          class="key"
          :style="{ '--span': 3.5 }"
          data-key="return"
          :disabled="!canSubmit"
        >
          <Icon icon="f7:return" />
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.keyboard-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--gap);

  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;

  --gap: 8px;
  --span: 1;
}

.keyboard-main,
.keyboard-actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--gap);

  &[hidden] {
    display: none;
  }
}

.keyboard-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100svw;
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
  transition: all var(--duration-fast) cubic-bezier(0.3, 0.96, 0.48, 1.11);

  --cell-width: min(3rem, calc(100vw / 11 - var(--gap)));

  &:not([disabled]):active {
    scale: 0.9;
  }

  &[hidden] {
    background: none;
    opacity: 0;
  }

  &[disabled] {
    color: var(--color-border);
    background: transparent;
    border: 1px solid var(--color-border);
  }

  &[data-key='return'] {
    color: var(--color-background);
    background: var(--tint);
    border: none;

    &[disabled] {
      color: var(--tint);
      background: var(--tint-mute);
    }
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

  &[data-state='not-found'] {
    color: var(--color-border);
    background: none;
    border: 1px solid var(--color-border);
  }
}
</style>
