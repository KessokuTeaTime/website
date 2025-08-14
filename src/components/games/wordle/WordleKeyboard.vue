<template>
  <div class="keyboard-container">
    <div class="keyboard-main">
      <div class="keyboard-row" data-row="1">
        <!--QWERTYUIOP-->
        <div class="key-spacer" data-side="left"></div>
        <button v-for="c in 'QWERTYUIOP'" class="key" :data-key="c">
          {{ c }}
        </button>
        <div class="key-spacer" data-side="right"></div>
      </div>

      <div class="keyboard-row" data-row="2">
        <div class="key-spacer" data-side="left"></div>
        <!--ASDFGHJKL-->
        <button v-for="c in 'ASDFGHJKL'" class="key" :data-key="c">
          {{ c }}
        </button>
        <div class="key-spacer" data-side="right"></div>
      </div>

      <div class="keyboard-row" data-row="3">
        <div class="key-spacer" data-side="left"></div>
        <!--ZXCVBNM-->
        <button v-for="c in 'ZXCVBNM'" class="key" :data-key="c">
          {{ c }}
        </button>
        <div class="key-spacer" data-side="right"></div>
      </div>

      <div class="keyboard-row" data-row="4">
        <div class="key-spacer" data-side="left"></div>
        <button class="key" :style="{ '--span': 3.5 }" data-key="backspace"></button>
        <div class="key" :style="{ '--span': 2 }" hidden />
        <button class="key" :style="{ '--span': 3.5 }" data-key="return"></button>
        <div class="key-spacer" data-side="right"></div>
      </div>
    </div>
    <div class="keyboard-auxiliary"></div>
  </div>
</template>

<style lang="scss" scoped>
.keyboard-container {
  display: flex;
  flex-direction: column;
  justify-content: center;

  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;

  --gap: 8px;
  --span: 1;
}

.keyboard-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--gap);
}

.keyboard-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: min-content;
  gap: var(--gap);
}

.key,
.key-spacer {
  height: 3rem;
}

.key {
  font-family: var(--font-mono);
  font-size: medium;
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(max(var(--span), 1) * var(--cell-width) + max(var(--span) - 1, 0) * var(--gap));
  background: var(--color-background-mute);
  border-radius: 6px;
  transition: scale var(--duration-fast) cubic-bezier(0.3, 0.96, 0.48, 1.11);

  --cell-width: min(3rem, calc(100vw / 11 - var(--gap)));

  &:active {
    scale: 0.9;
  }

  &[hidden] {
    background: none;
    opacity: 0;
  }
}

.key-spacer {
  background: var(--color-background-soft);
  flex-grow: 1;

  &[data-side='left'] {
    border-radius: 0 6px 6px 0;
    mask: linear-gradient(to left, white 0%, transparent 100%);
  }

  &[data-side='right'] {
    border-radius: 6px 0 0 6px;
    mask: linear-gradient(to right, white 0%, transparent 100%);
  }
}
</style>
