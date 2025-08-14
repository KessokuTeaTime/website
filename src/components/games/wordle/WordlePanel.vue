<script setup lang="ts">
import type { Word } from '@/utils/wordle'
import type { PropType } from 'vue'

const props = defineProps({
  words: {
    type: Object as PropType<Word[]>,
    required: true
  },
  input: {
    type: String,
    required: false,
    default: ''
  },
  remainingTurns: {
    type: Number,
    required: false
  }
})
</script>

<template>
  <div class="wordle-panel">
    <div v-for="word in words" class="wordle-row">
      <div
        v-for="i in 5"
        class="wordle-letter"
        :data-column="i"
        :data-letter="word[i - 1]?.letter"
        :data-matches="word[i - 1].matches"
      >
        {{ word[i - 1]?.letter }}
      </div>
    </div>
    <div class="wordle-row input">
      <div v-for="i in 5" class="wordle-letter" :data-column="i" :data-letter="input[i]">
        {{ input[i - 1] }}
      </div>
    </div>
    <div v-for="i in remainingTurns" class="wordle-row placeholder" />
  </div>
</template>

<style lang="scss" scoped>
.wordle-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: min-content;
  height: min-content;

  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.wordle-row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 8px;
  width: min-content;
  height: min-content;
  margin: 4px;
  border-radius: 8px;

  &.placeholder {
    width: 100%;
    height: 12px;
    background: var(--color-background-soft);
  }
}

.wordle-letter {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: larger;
  font-weight: 600;
  text-transform: uppercase;
  width: 3.6rem;
  aspect-ratio: 1/1;
  grid-row: var(--row);
  grid-column: var(--column);
  border-radius: 6px;

  .input > & {
    background: var(--color-background-mute);
  }

  &[data-matches='yes'] {
    font-weight: 900;
    color: var(--color-background);
    background: var(--tint);
  }

  &[data-matches='partial'] {
    color: var(--tint);
    background: var(--tint-mute);
  }
}
</style>
