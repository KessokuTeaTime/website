<script setup lang="ts">
import WordlePanel from '@/components/games/wordle/WordlePanel.vue'
import WordleKeyboard from '@/components/games/wordle/WordleKeyboard.vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useSound } from '@vueuse/sound'
import typeSoundFile from '/sounds/keyboard-type-1.mp3'
import pressSoundFile from '/sounds/button-press-1.mp3'
import { keyboardRows, SessionContext, type Word, type WordleResponse } from '@/utils/wordle'

const typeSound = useSound(typeSoundFile, {
  sprite: {
    on: [163, 86],
    off: [257, 237]
  }
})
const pressSound = useSound(pressSoundFile, {
  sprite: {
    on: [59, 104],
    off: [233, 172]
  }
})

const date = '1970-01-01'

const context = ref(new SessionContext('https://api.kessokuteatime.work/wordle'))
const response = ref<WordleResponse | null>(null)
const input = ref('')

const canDelete = computed(() => {
  return input.value.length > 0
})
const canSubmit = computed(() => {
  return input.value.length >= 5
})
const history = computed(() => {
  console.log(response.value?.history)
  return response.value?.history ?? []
})
const remainingTries = computed(() => {
  return response.value?.remainingTries ?? 0
})
const isCompleted = computed(() => {
  return response.value?.isCompleted ?? false
})
const isFinished = computed(() => {
  return remainingTries.value <= 0 || isCompleted.value
})
const keys = computed(() => {
  function find(matches: '+' | '?' | '-'): string[] {
    if (response.value != null) {
      return response.value.history.flatMap((letters) =>
        letters.filter((letter) => letter.matches == matches).map((letter) => letter.letter)
      )
    } else {
      return []
    }
  }

  return {
    found: find('+').join().toLowerCase(),
    misplaced: find('?').join().toLowerCase(),
    notFound: find('-').join().toLowerCase()
  }
})

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
  document.addEventListener('keyup', onKeyUp)
})

onMounted(async () => {
  await context.value.init()
  response.value = await context.value.start({ date })
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
  document.removeEventListener('keyup', onKeyUp)
})

function onKeyDown(event: KeyboardEvent) {
  if (!isFinished.value && !event.repeat) {
    if (
      keyboardRows.filter(
        (s) =>
          s.includes(event.key) ||
          s.includes(event.key.toLowerCase()) ||
          s.includes(event.key.toUpperCase())
      ).length > 0
    ) {
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
  if (!isFinished.value && !event.repeat) {
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

function onTypeDown(_key: string) {
  const key = _key.toLowerCase()
  if (remainingTries.value > 0 && input.value.length < 5) {
    typeSound.play({ id: 'on' })
    input.value += key
  }
}

function onTypeUp(_key: string) {
  if (remainingTries.value > 0) {
    typeSound.play({ id: 'off' })
  }
}

function onDeleteDown() {
  if (remainingTries.value > 0 && input.value.length > 0) {
    pressSound.play({ id: 'on' })
    input.value = input.value.substring(0, input.value.length - 1)
  }
}

function onDeleteUp() {
  if (remainingTries.value > 0) {
    pressSound.play({ id: 'off' })
  }
}

async function onSubmitDown() {
  if (remainingTries.value > 0 && input.value.length == 5) {
    pressSound.play({ id: 'on' })
    response.value = await context.value.submit({ date }, { answer: input.value })
    input.value = ''
  }
}

function onSubmitUp() {
  if (remainingTries.value > 0) {
    pressSound.play({ id: 'off' })
  }
}
</script>

<template>
  <div class="wordle-container">
    <WordlePanel
      :history="history"
      :input="input"
      :remainingTries="remainingTries"
      :isCompleted="isCompleted"
    />
    <WordleKeyboard
      client:visible
      :keys="keys"
      :canDelete="canDelete"
      :canSubmit="canSubmit"
      :isFinished="isFinished"
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
