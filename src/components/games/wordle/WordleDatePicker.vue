<script setup lang="ts">
import { WordleDate, WordlePartialDate, type Month } from '@/utils/wordle'
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
    <span>Currently playing at {{ date.toDate().toDateString() }}</span>
    <button v-if="!isOpened" class="open-date-picker" @click="isOpened = true">
      Play another…
    </button>
    <div v-else class="date-picker">
      <span>Year</span>
      <select class="year" v-model="year">
        <option v-for="year in WordlePartialDate.years().reverse()" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
      <span class="separator">·</span>
      <span>Month</span>
      <select class="month" v-model="month">
        <option
          v-for="month in WordlePartialDate.months(year).reverse()"
          :key="month"
          :value="month"
        >
          {{ month }}
        </option>
      </select>
      <span class="separator">·</span>
      <span>Day</span>
      <select class="day" v-model="day">
        <option v-for="day in selectedDate.partial.days().reverse()" :key="day" :value="day">
          {{ day }}
        </option>
      </select>
      <span class="separator">·</span>
      <button class="play-at-date" @click="onPlay" :disabled="selectedDate.is(date)">Go</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.date-picker-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: var(--color-text-soft);
  gap: 0.4em;
}

.date-picker {
  display: flex;
  align-items: center;
  justify-content: baseline;
  gap: 0.4em;
  height: 2rem;
}

.separator {
  color: var(--color-border);
}

button {
  font-size: 0.8rem;
  color: var(--color-text-soft);

  &.open-date-picker {
    text-decoration: underline;
    height: 2rem;
  }

  &.play-at-date {
    font-weight: 500;
    color: var(--tint);

    &[disabled] {
      color: var(--tint-mute);
    }
  }
}
</style>
