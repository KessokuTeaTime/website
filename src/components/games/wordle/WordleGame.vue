<script setup lang="ts">
import WordlePanel from '@/components/games/wordle/WordlePanel.vue'
import WordleKeyboard from '@/components/games/wordle/WordleKeyboard.vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useSound } from '@vueuse/sound'
import typeSoundFile from '/sounds/keyboard-type-1.mp3'
import pressSoundFile from '/sounds/button-press-1.mp3'
import { keyboardRows, match, type Word } from '@/utils/wordle'

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

const solution = 'memes'

const input = ref('')
const words = ref<Word[]>([])

const canDelete = computed(() => {
  return input.value.length > 0
})
const canSubmit = computed(() => {
  return input.value.length >= 5
})
const keys = computed(() => {
  function find(matches: 'yes' | 'partial' | 'no'): string[] {
    return words.value.flatMap((letters) =>
      letters.filter((letter) => letter.matches == matches).map((letter) => letter.letter)
    )
  }

  return {
    found: find('yes').join(),
    misplaced: find('partial').join(),
    notFound: find('no').join()
  }
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
    words.value.push(match(input.value, solution))
    input.value = ''
  }
}

function onSubmitUp() {
  pressUpSound.play({ id: '1' })
}
</script>

<template>
  <div class="wordle-container">
    <WordlePanel :words="words" :input="input" :remainingTries="4" />
    <WordleKeyboard
      client:visible
      :keys="keys"
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
