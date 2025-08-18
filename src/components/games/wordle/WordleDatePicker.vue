<script setup lang="ts">
import { WordleDate, WordlePartialDate, type Month } from '@/utils/wordle'
import { t } from 'astro-i18n'
import { computed, onMounted, ref, watchEffect } from 'vue'
import { marked } from 'marked'

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
    <span
      v-html="
        marked.parseInline(
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
      v-if="!isOpened"
      class="open-date-picker"
      v-html="
        marked.parseInline(t('page.games.wordle.date_picker.play_another', undefined, { locale }))
      "
      @click="isOpened = true"
    />
    <template v-else>
      <div class="date-picker-wrapper" :class="{ disabled: selectedDate.is(date) }">
        <button
          class="play-at-date"
          v-html="t('page.games.wordle.date_picker.go_to', undefined, { locale })"
          @click="onPlay"
        />
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
      </div>
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

.date-picker-wrapper {
  display: flex;
  align-items: center;
  justify-content: baseline;
  font-weight: 500;
  color: var(--color-background);
  padding: 2px 5px;
  background: var(--tint);
  border-radius: 6px;
  transition: color var(--duration-fast) ease;

  &.disabled {
    color: var(--color-text-soft);
    background: var(--color-selection);
  }

  .date-picker,
  .play-at-date {
    color: var(--color-background);
  }

  &.disabled :is(.date-picker, .play-at-date) {
    color: var(--color-text);
  }

  .separator {
    color: var(--color-background);
  }

  &.disabled .separator {
    color: var(--color-text-soft);
  }
}

.date-picker {
  display: flex;
  align-items: center;
  justify-content: baseline;
  font-family: var(--font-mono);
}

.separator {
  color: var(--color-border);
  margin: 0 0.4em;
}

.open-date-picker {
  font-size: 0.8rem;
  color: var(--color-text-soft);
  text-decoration: underline;
}

select {
  border: none;
}
</style>
