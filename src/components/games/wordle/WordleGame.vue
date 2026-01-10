<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watchEffect } from 'vue'
import { useSound } from '@vueuse/sound'
import WordlePanel from '@/components/games/wordle/WordlePanel.vue'
import WordleKeyboard from '@/components/games/wordle/WordleKeyboard.vue'
import WordleDatePicker from './WordleDatePicker.vue'
import ConfettiExplosion from 'vue-confetti-explosion'
import typeSoundFile from '/sounds/keyboard-type-1.mp3'
import pressSoundFile from '/sounds/button-press-1.mp3'
import {
  keyboardRows,
  SessionContext,
  SessionSubmitError,
  WordleDate,
  type WordleResponse
} from '@/lib/wordle'
import { AnimateOneShot } from '@/lib/animate'
import { navigate } from 'astro:transitions/client'

const props = defineProps<{
  locale?: string
}>()

// Sounds

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

// Reactives

const context = reactive(new SessionContext('https://api.kessokuteatime.work/wordle'))
const response = reactive<{ inner: WordleResponse | null }>({ inner: null })

const input = ref('')
const isInitialized = ref(false)
const isPending = ref(false)

const history = computed(() => {
  return response.inner?.history ?? []
})

const date = computed(() => {
  const query = new URL(window.location.href).searchParams.get('date')
  if (query != null) {
    return WordleDate.fromString(query)
  } else {
    return WordleDate.today()
  }
})

// Reactives: animate

const animateInvalidAnswer = ref(new AnimateOneShot())
const animateConfetti = ref(new AnimateOneShot())

// Reactives: game state

const lettersCount = computed(() => {
  return response.inner?.lettersCount ?? 0
})

const remainingTries = computed(() => {
  return response.inner?.remainingTries ?? 0
})

const canDelete = computed(() => {
  return input.value.length > 0
})

const canSubmit = computed(() => {
  return input.value.length >= 5
})

const isCompleted = computed(() => {
  return response.inner?.isCompleted ?? false
})

const isFinished = computed(() => {
  return remainingTries.value <= 0 || isCompleted.value
})

// Reactives: keyboard

const keys = computed(() => {
  function find(matches: '+' | '?' | '-'): string[] {
    if (history.value != null) {
      return history.value.flatMap((letters) =>
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

// Hooks

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
  document.addEventListener('keyup', onKeyUp)
})

onMounted(start)

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
  document.removeEventListener('keyup', onKeyUp)
})

// Watch effects

watchEffect(() => {
  if (isCompleted.value) {
    animateConfetti.value.trigger()
  }
})

// Functions

async function start() {
  isPending.value = true
  await context.init()
  response.inner = await context.start({ date: date.value })

  isPending.value = false
  isInitialized.value = true
}

async function submit() {
  try {
    isPending.value = true
    response.inner = await context.submit({ date: date.value }, { answer: input.value })
    input.value = ''
  } catch (err: any) {
    switch (err.kind) {
      case SessionSubmitError.NotInitialized:
        await start()
        break
      case SessionSubmitError.InvalidAnswer:
        animateInvalidAnswer.value.trigger()
        break
    }
  } finally {
    isPending.value = false
  }
}

function onSelectDate(date: WordleDate) {
  let url = new URL(window.location.href)

  if (date.isToday()) {
    url.searchParams.delete('date')
  } else {
    url.searchParams.set('date', date.toString())
  }

  navigate(url.toString())
}

// Functions: keyboard events

function onKeyDown(event: KeyboardEvent) {
  if (!isPending.value && !isFinished.value && !event.repeat) {
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
  if (!isPending.value && !isFinished.value && !event.repeat) {
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
  if (remainingTries.value > 0 && input.value.length == lettersCount.value) {
    pressSound.play({ id: 'on' })
    await submit()
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
    <div class="confetti">
      <ConfettiExplosion
        v-if="animateConfetti.animate"
        :colors="['var(--tint)', 'var(--tint-soft)', 'var(--tint-mute)']"
        class="confetti"
      />
    </div>
    <WordlePanel
      v-if="isInitialized"
      :history="history"
      :input="input"
      :lettersCount="lettersCount"
      :remainingTries="remainingTries"
      :isPending="isPending"
      :isCompleted="isCompleted"
      :animate="{
        invalidAnswer: animateInvalidAnswer.animate
      }"
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
    <WordleDatePicker
      v-if="isInitialized"
      :locale="locale"
      :date="date"
      @selectDate="onSelectDate"
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

.confetti {
  position: fixed;
  top: 5rem;
}
</style>
