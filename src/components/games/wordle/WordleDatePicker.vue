<script setup lang="ts">
import { WordleDate, WordlePartialDate, type Month } from '@/lib/wordle'
import { renderInline } from '@/lib/markdown'
import { t } from 'astro-i18n'
import { computed, onMounted, ref, watchEffect } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps<{
  locale?: string
  date: WordleDate
}>()

const emit = defineEmits<{
  selectDate: [WordleDate]
}>()

const isOpened = ref(false)

const year = ref(1)
const month = ref<Month>(1)
const day = ref(1)

const selectedPartialDate = computed(() => {
  return new WordlePartialDate(year.value, month.value)
})

const selectedDate = computed(() => {
  return new WordleDate(selectedPartialDate.value, day.value)
})

onMounted(() => {
  year.value = props.date.partial.year
  month.value = props.date.partial.month
  day.value = props.date.day
})

watchEffect(() => {
  year.value = WordlePartialDate.clampYear(year.value)
  month.value = WordlePartialDate.clampMonth(year.value, month.value)
})

watchEffect(() => {
  day.value = selectedPartialDate.value.clampDay(day.value)
})

function onPlay() {
  emit('selectDate', selectedDate.value)
}
</script>

<template>
  <div class="date-picker-container">
    <p v-if="!isOpened">
      <span
        v-html="
          renderInline(
            t(
              'page.games.wordle.date_picker.description',
              { date: date.toDate().toLocaleDateString() },
              { locale }
            )
          )
        "
      />
      <span class="separator">·</span>
      <button
        class="underline"
        v-html="
          renderInline(t('page.games.wordle.date_picker.play_another', undefined, { locale }))
        "
        @click="isOpened = true"
      />
    </p>
    <template v-else>
      <div class="date-picker">
        <select class="year" v-model="year">
          <option v-for="year in WordlePartialDate.years().reverse()" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
        <span class="separator">/</span>
        <select class="month" v-model="month">
          <option
            v-for="month in WordlePartialDate.months(year).reverse()"
            :key="month"
            :value="month"
          >
            {{ month }}
          </option>
        </select>
        <span class="separator">/</span>
        <select class="day" v-model="day">
          <option v-for="day in selectedDate.partial.days().reverse()" :key="day" :value="day">
            {{ day }}
          </option>
        </select>
      </div>
      <button class="play" @click="onPlay" :disabled="selectedDate.is(date)">
        <Icon icon="mi:arrow-right" />
      </button>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.date-picker-container {
  display: flex;
  align-items: center;
  justify-content: baseline;
  font-size: 0.8rem;
  color: var(--color-text-soft);
  height: 2em;
  gap: 0.4em;
}

.date-picker {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
}

.play {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-background);
  background: var(--tint);
  border-radius: 50%;
  height: 1.5em;
  aspect-ratio: 1/1;
  transition:
    color var(--duration-fast) ease,
    background var(--duration-fast) ease;

  &[disabled] {
    color: var(--color-border);
    background: transparent;
  }
}

.separator {
  color: var(--color-border);
  margin: 0 0.4em;
}

.underline {
  text-decoration: underline;
}

button {
  font-size: 0.8rem;
  color: var(--color-text-soft);
}

select {
  border: none;
}
</style>
