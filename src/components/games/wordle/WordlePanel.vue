<script setup lang="ts">
import type { Word } from '@/utils/wordle'

const props = defineProps<{
  history: Word[]
  input: string
  remainingTries: number
  isCompleted: boolean
}>()
</script>

<template>
  <div class="wordle-panel">
    <div v-for="word in history" class="wordle-row">
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
    <div class="wordle-row input" :hidden="remainingTries <= 0 || isCompleted">
      <div v-for="i in 5" class="wordle-letter" :data-column="i" :data-letter="input[i]">
        {{ input[i - 1] }}
      </div>
    </div>
    <div
      v-if="remainingTries > 0 && !isCompleted"
      v-for="i in remainingTries - 1"
      class="remaining-try"
      :data-try="i"
    >
      <div class="placeholder" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wordle-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
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

.remaining-try {
  width: 100%;
  height: 16px;
  padding: 4px;

  .placeholder {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    background: var(--color-background-soft);
  }
}

.input[hidden] {
  display: none;
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

  &[data-matches='+'] {
    font-weight: 900;
    color: var(--color-background);
    background: var(--tint);
  }

  &[data-matches='?'] {
    color: var(--tint);
    background: var(--tint-mute);
  }
}
</style>
