<template>
  <div class="wordle-panel">
    <div v-for="row in 6" class="wordle-row" :class="{ alternate: row % 2 == 0 }">
      <div v-for="column in 5" class="wordle-letter" :data-row="row" :data-column="column"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wordle-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: min-content;
  height: min-content;
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

  &:not(:nth-of-type(1)) {
    background: var(--color-background-mute);

    &.alternate {
      background: var(--color-background-soft);
    }
  }
}

.wordle-letter {
  width: 3.6rem;
  aspect-ratio: 1/1;
  grid-row: var(--row);
  grid-column: var(--column);
  border-radius: 6px;

  .wordle-row:nth-of-type(1) > & {
    background: var(--color-background-mute);
  }
}
</style>
