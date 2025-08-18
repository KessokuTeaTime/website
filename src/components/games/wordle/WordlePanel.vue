<script setup lang="ts">
import type { Word } from '@/utils/wordle'

const props = defineProps<{
  history: Word[]
  input: string
  lettersCount: number
  remainingTries: number
  isPending: boolean
  isCompleted: boolean
  animate?: { invalidAnswer?: boolean }
}>()
</script>

<template>
  <div
    class="wordle-panel"
    :class="{ pending: isPending, 'invalid-answer': animate?.invalidAnswer }"
  >
    <TransitionGroup :name="history.length > 0 ? 'transition-rows' : undefined">
      <div v-for="(word, index) in history" :key="`history-${index}`" class="wordle-row">
        <div
          v-for="i in lettersCount"
          :key="i"
          class="wordle-letter"
          :data-column="i"
          :data-letter="word[i - 1]?.letter"
          :data-matches="word[i - 1].matches"
        >
          {{ word[i - 1]?.letter }}
        </div>
      </div>
      <div key="input" class="wordle-row input" :hidden="remainingTries <= 0 || isCompleted">
        <div
          v-for="i in lettersCount"
          :key="i"
          class="wordle-letter"
          :data-column="i"
          :data-letter="input[i]"
        >
          {{ input[i - 1] }}
        </div>
      </div>
      <div
        v-if="remainingTries > 0 && !isCompleted"
        v-for="i in remainingTries - 1"
        :key="`remaining-try-${remainingTries - i - 1}`"
        class="remaining-try"
        :data-try="i"
      >
        <div class="placeholder" />
      </div>
    </TransitionGroup>
  </div>
</template>

<style lang="scss" scoped>
.wordle-panel {
  position: relative;
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
  z-index: 1;
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

.input {
  perspective: 1000px;
  transition: scale var(--duration-fast) ease;
  z-index: 0;

  > * {
    transform-origin: top;
    transition:
      scale var(--duration-fast) ease,
      transform var(--duration-fast) ease;
  }

  &[hidden] {
    display: none;
  }

  .pending & {
    color: var(--color-text-soft);
    scale: 0.95;

    > * {
      scale: 0.95;
      transform: rotate3d(1, 0, 0, -30deg);
    }
  }

  .invalid-answer & {
    animation-name: wiggle;
    animation-duration: 0.6s;
    animation-timing-function: cubic-bezier(0.36, 0.07, 0.19, 0.97);
    animation-iteration-count: 1;
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

  &[data-matches='+'] {
    font-weight: 900;
    color: var(--color-background);
    background: var(--tint);
  }

  &[data-matches='?'] {
    color: var(--tint);
    background: var(--tint-mute);
  }

  &[data-matches='-'] {
    color: var(--color-border);
    border: 1px solid var(--color-border);
  }
}

@keyframes wiggle {
  0% {
    transform: translateX(0);
  }

  15% {
    transform: translateX(-3%);
  }

  30% {
    transform: translateX(3%);
  }

  45% {
    transform: translateX(-2%);
  }

  60% {
    transform: translateX(2%);
  }

  75% {
    transform: translateX(-1%);
  }

  90% {
    transform: translateX(1%);
  }

  100% {
    transform: translateX(0);
  }
}

.transition-rows-enter-active,
.transition-rows-leave-active {
  transition: opacity var(--duration-fast) ease;
}

.transition-rows-move {
  transition: transform var(--duration-fast) ease;
}

.transition-rows-enter-from,
.transition-rows-leave-to {
  opacity: 0;
}

.transition-rows-leave-active {
  position: absolute;
}
</style>
