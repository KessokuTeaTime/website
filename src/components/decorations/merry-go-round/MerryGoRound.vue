<script setup lang="ts">
import TextKessoku from './TextKessoku.vue'
import TextTeaTime from './TextTeaTime.vue'

const kessokuWidth = 159.55
const kessokuHeight = 76.24

const teaTimeWidth = 486.06
const teaTimeHeight = 75.76

const kessokuAspectRatio = kessokuWidth / kessokuHeight
const teaTimeAspectRatio = teaTimeWidth / teaTimeHeight

const aspectRatio = (kessokuWidth + teaTimeWidth) / Math.max(kessokuHeight, teaTimeHeight)
</script>

<template>
  <div class="container">
    <div class="tea-time-container">
      <TextTeaTime class="stroke" id="tea-time" />
    </div>
    <div class="kessoku-container">
      <TextKessoku class="stroke" id="kessoku" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
}

.stroke {
  fill: none;
  stroke: var(--color-border);
}

#kessoku {
  width: calc(100vh / v-bind(aspectRatio));
}

#tea-time {
  width: calc(100vh / v-bind(aspectRatio));
}
</style>
