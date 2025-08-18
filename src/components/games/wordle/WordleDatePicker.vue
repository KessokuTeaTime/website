<script setup lang="ts">
import { WordleDate, WordlePartialDate, type Month } from '@/utils/wordle'
import { t } from 'astro-i18n'
import { computed, onMounted, ref, watchEffect } from 'vue'

const props = defineProps<{
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
  isOpened.value = false
  emit('selectDate', selectedDate.value)
}
</script>

<template>
  <div class="date-picker-container">
    <p v-if="!isOpened">
      {{
        t('page.games.wordle.date_picker.description', { date: date.toDate().toLocaleDateString() })
      }}
      <span class="separator left-margin-fix">·</span>
      <button class="open-date-picker" @click="isOpened = true">
        {{ t('page.games.wordle.date_picker.play_another') }}
      </button>
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
      <span class="separator">·</span>
      <button class="play-at-date" @click="onPlay" :disabled="selectedDate.is(date)">
        {{ t('page.games.wordle.date_picker.play') }}
      </button>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.date-picker-container {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: var(--color-text-soft);
  height: 2em;
  gap: 0.4em;
}

.date-picker {
  display: flex;
  align-items: center;
  justify-content: baseline;
  padding: 2px 6px;
  margin: -2px 0;
  border: 1px solid var(--color-border);
  border-radius: 6px;
}

.separator {
  color: var(--color-border);
  margin: 0 0.4em;

  &.left-margin-fix {
    margin-left: 0;
  }
}

button {
  font-size: 0.8rem;
  color: var(--color-text-soft);

  &.open-date-picker {
    text-decoration: underline;
  }

  &.play-at-date {
    font-weight: 500;
    color: var(--tint);
    transition: color var(--duration-fast) ease;

    &[disabled] {
      color: var(--tint-mute);
    }
  }
}

select {
  border: none;
}
</style>
