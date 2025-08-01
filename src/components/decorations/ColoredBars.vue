<template>
  <div
    v-for="i in ['kita', 'ryo', 'bocchi', 'nijika']"
    :key="i"
    :class="`tint-${i}`"
    class="block"
  ></div>
</template>

<style lang="scss">
.block {
  flex-grow: 1;
  background-color: var(--tint);
}
</style>
