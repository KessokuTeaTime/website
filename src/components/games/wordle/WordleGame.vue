<script setup lang="ts">
import WordlePanel from '@/components/games/wordle/WordlePanel.vue'
import WordleKeyboard from '@/components/games/wordle/WordleKeyboard.vue'
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { useSound } from '@vueuse/sound'
import typeSoundFile from '/sounds/keyboard-type-1.mp3'
import pressSoundFile from '/sounds/button-press-1.mp3'
import { keyboardRows } from '@/utils/wordle'

const typeDownSound = useSound(typeSoundFile, {
  sprite: {
    1: [163, 86]
  }
})
const typeUpSound = useSound(typeSoundFile, {
  sprite: {
    1: [257, 237]
  }
})
const pressDownSound = useSound(pressSoundFile, {
  sprite: {
    1: [59, 104]
  }
})
const pressUpSound = useSound(pressSoundFile, {
  sprite: {
    1: [233, 172]
  }
})

const input = ref('')

const canDelete = computed(() => {
  return input.value.length > 0
})
const canSubmit = computed(() => {
  return input.value.length >= 5
})

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
  document.addEventListener('keyup', onKeyUp)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
  document.removeEventListener('keyup', onKeyUp)
})

function onKeyDown(event: KeyboardEvent) {
  if (!event.repeat) {
    if (keyboardRows.filter((s) => s.includes(event.key)).length > 0) {
      onTypeDown(event.key)
    } else {
      switch (event.key) {
        case 'Backspace':
        case 'Delete':
          onDeleteDown()
          break
        case 'Enter':
          onSubmitDown()
          break
      }
    }
  }
}

function onKeyUp(event: KeyboardEvent) {
  if (!event.repeat) {
    if (keyboardRows.filter((s) => s.includes(event.key)).length > 0) {
      onTypeUp(event.key)
    } else {
      switch (event.key) {
        case 'Backspace':
        case 'Delete':
          onDeleteUp()
          break
        case 'Enter':
          onSubmitUp()
          break
      }
    }
  }
}

function onTypeDown(key: string) {
  if (input.value.length < 5) {
    typeDownSound.play({ id: '1' })
    input.value += key
  }
}

function onTypeUp(key: string) {
  typeUpSound.play({ id: '1' })
}

function onDeleteDown() {
  if (input.value.length > 0) {
    pressDownSound.play({ id: '1' })
    input.value = input.value.substring(0, input.value.length - 1)
  }
}

function onDeleteUp() {
  pressUpSound.play({ id: '1' })
}

function onSubmitDown() {
  if (input.value.length == 5) {
    pressDownSound.play({ id: '1' })
  }
}

function onSubmitUp() {
  pressUpSound.play({ id: '1' })
}
</script>

<template>
  <div class="wordle-container">
    <WordlePanel
      :words="[
        [
          { letter: 'r', matches: 'yes' },
          { letter: 'u', matches: 'partial' },
          { letter: 's', matches: 'no' },
          { letter: 't', matches: 'partial' },
          { letter: 'y', matches: 'no' }
        ]
      ]"
      :input="input"
      :remainingTurns="4"
    />
    <WordleKeyboard
      client:visible
      :keys="{
        found: 'r',
        misplaced: 'ut',
        notFound: 'sy'
      }"
      :canDelete="canDelete"
      :canSubmit="canSubmit"
      @typeDown="onTypeDown"
      @typeUp="onTypeUp"
      @deleteDown="onDeleteDown"
      @deleteUp="onDeleteUp"
      @submitDown="onSubmitDown"
      @submitUp="onSubmitUp"
    />
  </div>
</template>

<style lang="scss" scoped>
.wordle-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6rem;

  --tint: var(--color-tint-pink);
  --tint-soft: var(--color-tint-pink-soft);
  --tint-mute: var(--color-tint-pink-mute);
}
</style>
