<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import TextKessoku from './TextKessoku.vue'
import TextTeaTime from './TextTeaTime.vue'
import { remToPx } from '@/utils/conversion'
import { Lerp } from '@/utils/lerp'

// Constants

const kessokuLengthFactor = 159.55
const kessokuThicknessFactor = 76.24

const teaTimeLengthFactor = 486.06
const teaTimeThicknessFactor = 75.76

const aspectRatio =
  (kessokuLengthFactor + teaTimeLengthFactor) /
  Math.max(kessokuThicknessFactor, teaTimeThicknessFactor)

const navBarHeight = '3.8rem'

// Variables

let rafId: number | null = null
let originScreenPos = { x: 0, y: 0 }
let lastScreenPos = { x: 0, y: 0 }

// Reactives

const count = ref(1)
const offsetLerp = ref(new Lerp())
const offset = computed(() => `${offsetLerp.value.value}px`)

// Hooks

onMounted(() => {
  originScreenPos = { x: window.screenX, y: window.screenY }

  updateCount()
  startWindowMoveDetection()
  window.addEventListener('resize', updateCount)
})

onUnmounted(() => {
  stopWindowMoveDetection()
  window.removeEventListener('resize', updateCount)
})

// Functions

function updateCount() {
  const navBarHeightPx = remToPx(parseFloat(navBarHeight))
  count.value =
    Math.floor(window.innerWidth / ((window.innerHeight - navBarHeightPx) / aspectRatio)) + 1
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
  <div class="container">
    <div class="text-container">
      <template v-for="i in count + 2" :key="i">
        <TextTeaTime class="stroke" id="tea-time" :style="`--index: ${i}`" />
      </template>
    </div>
    <div class="text-container">
      <template v-for="i in count + 2" :key="i">
        <TextKessoku class="stroke" id="kessoku" :style="`--index: ${i}`" />
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: calc(100vh - v-bind(navBarHeight));
  overflow: hidden;
  margin-top: v-bind(navBarHeight);
  --text-width: calc((100vh - v-bind(navBarHeight)) / v-bind(aspectRatio));
  --offset: mod(
    calc(mod(calc(-1 * v-bind(offset)), var(--text-width)) + var(--text-width)),
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

  &:has(#kessoku) {
    animation: move 1s linear infinite normal;
  }

  &:has(#tea-time) {
    animation: move 1s linear infinite reverse;
  }
}

#kessoku,
#tea-time {
  width: var(--text-width);
}

@keyframes move {
  100% {
    transform: translateX(var(--text-width));
  }
}
</style>
