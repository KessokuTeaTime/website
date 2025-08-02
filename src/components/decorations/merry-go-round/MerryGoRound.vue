<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import TextKessoku from './TextKessoku.vue'
import TextTeaTime from './TextTeaTime.vue'
import { remToPx } from '@/utils/conversion'

// Constants

const kessokuLengthFactor = 159.55
const kessokuThicknessFactor = 76.24

const teaTimeLengthFactor = 486.06
const teaTimeThicknessFactor = 75.76

const kessokuAspectRatio = kessokuLengthFactor / kessokuThicknessFactor
const teaTimeAspectRatio = teaTimeLengthFactor / teaTimeThicknessFactor

const aspectRatio =
  (kessokuLengthFactor + teaTimeLengthFactor) /
  Math.max(kessokuThicknessFactor, teaTimeThicknessFactor)

const navBarHeight = '4rem'

// Variables

let rafId: number | null = null
let originScreenPos = { x: 0, y: 0 }
let lastScreenPos = { x: 0, y: 0 }

// Reactives

const count = ref(1)
const horizontalOffset = ref('0')

// Hooks

onMounted(() => {
  originScreenPos = { x: window.screenX, y: window.screenY }

  updateCount()
  startWindowMoveDetection()
  window.addEventListener('resize', updateCount)
  window.addEventListener('resize', updateOffset)
})

onUnmounted(() => {
  stopWindowMoveDetection()
  window.removeEventListener('resize', updateCount)
  window.removeEventListener('resize', updateOffset)
})

// Functions

function updateCount() {
  const navBarHeightPx = remToPx(parseFloat(navBarHeight))
  count.value =
    Math.floor(window.innerWidth / ((window.innerHeight - navBarHeightPx) / aspectRatio)) + 1
  console.log(`Count updated: ${count.value}, navBarHeight: ${navBarHeightPx}px`)
}

function updateOffset() {
  horizontalOffset.value = `${window.screenX - originScreenPos.x}px`
}

function startWindowMoveDetection() {
  const detectMove = () => {
    if (lastScreenPos.x !== window.screenX || lastScreenPos.y !== window.screenY) {
      lastScreenPos = { x: window.screenX, y: window.screenY }
      updateOffset()
    }
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
      <!--`count + 1` is for the infinite cycling effect-->
      <template v-for="i in count + 1" :key="i">
        <TextTeaTime class="stroke" id="tea-time" :style="`--index: ${i}`" />
      </template>
    </div>
    <div class="text-container">
      <template v-for="i in count + 1" :key="i">
        <TextKessoku class="stroke" id="kessoku" :style="`--index: ${i}`" />
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  padding-top: v-bind(navBarHeight);
  --text-width: calc((100vh - v-bind(navBarHeight)) / v-bind(aspectRatio));
}

.stroke {
  fill: none;
  stroke: var(--color-border);
}

.text-container {
  white-space: nowrap;
  overflow: hidden;
  --offset: mod(
    calc(mod(calc(-1 * v-bind(horizontalOffset)), var(--text-width)) + var(--text-width)),
    var(--text-width)
  );
}

#kessoku,
#tea-time {
  width: var(--text-width);
  transform: translateX(calc(var(--offset) - var(--text-width)));
}
</style>
