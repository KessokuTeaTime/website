<script setup lang="ts">
import TextKessoku from './TextKessoku.vue'
import TextTea from './TextTea.vue'
import TextTime from './TextTime.vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { remToPx } from '@/utils/conversion'
import { Lerp } from '@/utils/lerp'

// Constants

const kessokuLengthFactor = 146.76
const kessokuThicknessFactor = 70.17

const teaLengthFactor = 220.51
const teaThicknessFactor = 69.72

const timeLengthFactor = 220.94
const timeThicknessFactor = 69.72

const aspectRatio =
  (kessokuLengthFactor + teaLengthFactor + timeLengthFactor) /
  Math.max(kessokuThicknessFactor, teaThicknessFactor, timeThicknessFactor)
const marginSemantic = `3.2rem`

// Variables

let rafId: number | null = null
let originScreenPos = { x: 0, y: 0 }
let lastScreenPos = { x: 0, y: 0 }

// Reactives

const height = ref(0)
const count = ref(1)
const offsetLerp = ref(new Lerp())

const heightSemantic = computed(() => `${height.value}px`)
const offsetSemantic = computed(() => `${offsetLerp.value.value}px`)

// Hooks

onMounted(() => {
  originScreenPos = { x: window.screenX, y: window.screenY }

  updateCount()
  startWindowMoveDetection()
  window.addEventListener('resize', updateCount)
  window.addEventListener('resize', offsetLerp.value.complete)
})

onUnmounted(() => {
  stopWindowMoveDetection()
  window.removeEventListener('resize', updateCount)
  window.removeEventListener('resize', offsetLerp.value.complete)
})

// Functions

function updateCount() {
  let margin = remToPx(marginSemantic)
  height.value = window.innerHeight - margin
  count.value = Math.floor(window.innerWidth / ((window.innerHeight - margin) / aspectRatio)) + 1
}

function updateOffset() {
  if (lastScreenPos.x !== window.screenX || lastScreenPos.y !== window.screenY) {
    lastScreenPos = { x: window.screenX, y: window.screenY }
    offsetLerp.value.target = window.screenX - originScreenPos.x
  }

  offsetLerp.value.update()
}

function startWindowMoveDetection() {
  const detectMove = () => {
    updateOffset()
    rafId = requestAnimationFrame(detectMove)
  }
  rafId = requestAnimationFrame(detectMove)
}

function stopWindowMoveDetection() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}
</script>

<template>
  <div class="merry-go-round-container">
    <div class="text-container">
      <template v-for="i in count + 2" :key="i">
        <TextTime class="stroke" :style="`--index: ${i}`" text="time" />
      </template>
    </div>
    <div class="text-container">
      <template v-for="i in count + 2" :key="i">
        <TextTea class="stroke" :style="`--index: ${i}`" text="tea" />
      </template>
    </div>
    <div class="text-container">
      <template v-for="i in count + 2" :key="i">
        <TextKessoku class="stroke" :style="`--index: ${i}`" text="kessoku" />
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.merry-go-round-container {
  width: 100%;
  height: v-bind(heightSemantic);
  overflow: hidden;
  margin-top: v-bind(marginSemantic);
  --text-width: calc(v-bind(heightSemantic) / v-bind(aspectRatio));
  --offset: mod(
    calc(mod(calc(-1 * v-bind(offsetSemantic)), var(--text-width)) + var(--text-width)),
    var(--text-width)
  );
}

.stroke {
  fill: none;
  stroke: var(--color-border);
}

.text-container {
  white-space: nowrap;
  transform: translateX(calc(var(--offset) - 2 * var(--text-width)));
  animation-composition: add;

  &:has([text='kessoku']) {
    animation: move 0.68s linear infinite normal;
  }

  &:has([text='tea']) {
    animation: move 1s linear infinite reverse;
  }

  &:has([text='time']) {
    animation: move 1.85s linear infinite normal;
  }
}

[text] {
  width: var(--text-width);
}

@keyframes move {
  100% {
    transform: translateX(var(--text-width));
  }
}
</style>
