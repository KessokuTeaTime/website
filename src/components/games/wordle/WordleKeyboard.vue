<template>
  <div class="keyboard-container">
    <div class="keyboard-main">
      <div class="keyboard-row" data-row="1">
        <!--QWERTYUIOP-->
        <div class="key-spacer" data-side="left"></div>
        <div v-for="c in 'QWERTYUIOP'" class="key" :data-key="c">
          {{ c }}
        </div>
        <div class="key-spacer" data-side="right"></div>
      </div>

      <div class="keyboard-row" data-row="2">
        <div class="key-spacer" data-side="left"></div>
        <!--ASDFGHJKL-->
        <div v-for="c in 'ASDFGHJKL'" class="key" :data-key="c">
          {{ c }}
        </div>
        <div class="key-spacer" data-side="right"></div>
      </div>

      <div class="keyboard-row" data-row="3">
        <div class="key-spacer" data-side="left"></div>
        <!--ZXCVBNM-->
        <div v-for="c in 'ZXCVBNM'" class="key" :data-key="c">
          {{ c }}
        </div>
        <div class="key-spacer" data-side="right"></div>
      </div>

      <div class="keyboard-row" data-row="4">
        <div class="key-spacer" data-side="left"></div>
        <div class="key" data-key="backspace"></div>
        <div class="key" data-key="return"></div>
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
}

.keyboard-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
}

.keyboard-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: min-content;
  gap: 8px;
}

.key,
.key-spacer {
  height: 3rem;
}

.key {
  color: var(--color-text-soft);
  font-family: var(--font-mono);
  display: flex;
  align-items: center;
  justify-content: center;
  width: min(3rem, calc(100vw / 11 - 8px));
  background: var(--color-background-mute);
  border-radius: 6px;
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
