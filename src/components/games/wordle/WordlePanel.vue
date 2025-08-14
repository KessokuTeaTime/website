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
  }
})
</script>

<template>
  <div class="wordle-panel">
    <div v-for="word in words" class="wordle-row">
      <button
        v-for="i in 5"
        class="wordle-letter"
        :data-column="i"
        :data-letter="word[i - 1]?.letter"
      >
        {{ word[i - 1]?.letter }}
      </button>
    </div>
    <div class="wordle-row input">
      <button v-for="i in 5" class="wordle-letter" :data-column="i" :data-letter="input[i]">
        {{ input[i - 1] }}
      </button>
    </div>
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
}

.wordle-letter {
  font-family: var(--font-mono);
  font-size: larger;
  font-weight: bold;
  text-transform: uppercase;
  width: 3.6rem;
  aspect-ratio: 1/1;
  grid-row: var(--row);
  grid-column: var(--column);
  border-radius: 6px;

  .input > & {
    background: var(--color-background-mute);
  }
}
</style>
