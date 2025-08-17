import camelcaseKeys from 'camelcase-keys'
import { toQueryRecord, withQuery } from './api'
import decamelcaseKeys from 'decamelcase-keys'
import type { RangeType } from './types'
import { clamp } from 'lodash'

export const keyboardRows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map((s) => s.toLowerCase())

export interface Letter {
  letter: string
  matches: '+' | '?' | '-'
}

export type Word = Letter[]

export interface WordleParams {
  date: WordleDate
}

export interface WordlePayload {
  answer: String
}

export interface WordleResponse {
  lettersCount: number
  remainingTries: number
  isDirty: boolean
  isCompleted: boolean
  history: Word[]
}

export enum SessionStartError {
  NotInitialized = 404,
  Failed = 500
}

export enum SessionSubmitError {
  NotInitialized = 404,
  InvalidAnswer = 400
}

export class SessionError {
  kind: SessionStartError | SessionSubmitError | unknown
  msg: string

  constructor(kind: SessionStartError | SessionSubmitError | unknown, msg: string) {
    this.kind = kind
    this.msg = msg
  }
}

export class SessionContext {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async init(): Promise<void> {
    const res = await fetch(`${this.baseUrl}/play/session`, {
      method: 'GET',
      credentials: 'include'
    })

    if (!res.ok) {
      throw new SessionError(undefined, await res.text())
    }
  }

  async start(params: WordleParams): Promise<WordleResponse> {
    const res = await fetch(
      withQuery(`${this.baseUrl}/play/start`, toQueryRecord(decamelcaseKeys(params))),
      {
        method: 'GET',
        credentials: 'include'
      }
    )

    if (!res.ok) {
      switch (res.status) {
        case SessionStartError.NotInitialized:
          throw new SessionError(SessionStartError.NotInitialized, await res.text())
        case SessionStartError.Failed:
          throw new SessionError(SessionStartError.Failed, await res.text())
        default:
          throw new SessionError(undefined, await res.text())
      }
    } else {
      return camelcaseKeys(await res.json())
    }
  }

  async submit(params: WordleParams, payload: WordlePayload): Promise<WordleResponse> {
    const res = await fetch(
      withQuery(`${this.baseUrl}/play/submit`, toQueryRecord(decamelcaseKeys(params))),
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(decamelcaseKeys(payload))
      }
    )
    if (!res.ok) {
      switch (res.status) {
        case SessionSubmitError.NotInitialized:
          throw new SessionError(SessionSubmitError.NotInitialized, await res.text())
        case SessionSubmitError.InvalidAnswer:
          throw new SessionError(SessionSubmitError.InvalidAnswer, await res.text())
        default:
          throw new SessionError(undefined, await res.text())
      }
    } else {
      return camelcaseKeys(await res.json())
    }
  }
}

export const MIN_YEAR = 1970

export type Month = Exclude<RangeType<13>, 0>

export class WordlePartialDate {
  readonly year: number
  readonly month: Month

  constructor(year: number, month: Month) {
    this.year = WordlePartialDate.clampYear(year)
    this.month = WordlePartialDate.clampMonth(this.year, month)
  }

  days(): number[] {
    let date = new Date()
    let currentYear = date.getFullYear()
    let currentMonth = date.getMonth() + 1
    if (this.year == currentYear && this.month == currentMonth) {
      let currentDay = date.getDate()
      return Array.from({ length: currentDay }, (_, i) => i + 1)
    } else {
      // The 0th day of next month
      let days = new Date(this.year, this.month, 0).getDate()
      return Array.from({ length: days }, (_, i) => i + 1)
    }
  }

  clampDay(day: number): number {
    let days = this.days()
    if (days.length < 1) throw new Error(`Cannot find any valid dates in ${this}`)
    return clamp(day, days[0], days.reverse()[0])
  }

  static years(): number[] {
    let currentYear = new Date().getFullYear()
    return Array.from({ length: currentYear + 1 - MIN_YEAR }, (_, i) => i + MIN_YEAR)
  }

  static months(year: number): number[] {
    let date = new Date()
    let currentYear = date.getFullYear()
    if (year == currentYear) {
      let currentMonth = date.getMonth() + 1
      return Array.from({ length: currentMonth }, (_, i) => i + 1)
    } else {
      return Array.from({ length: 12 }, (_, i) => i + 1)
    }
  }

  static clampYear(year: number): number {
    let years = WordlePartialDate.years()
    return clamp(year, years[0], years.reverse()[0])
  }

  static clampMonth(year: number, month: Month): Month {
    let months = WordlePartialDate.months(year)
    return clamp(month, months[0], months.reverse()[0]) as Month
  }
}

export class WordleDate {
  readonly partial: WordlePartialDate
  readonly day: number

  constructor(partial: WordlePartialDate, day: number) {
    this.partial = partial
    this.day = partial.clampDay(day)
  }

  static today(): WordleDate {
    let date = new Date()
    return this.fromDate(date.getFullYear(), (date.getMonth() + 1) as Month, date.getDate())
  }

  static fromDate(year: number, month: Month, day: number): WordleDate {
    return new WordleDate(new WordlePartialDate(year, month), day)
  }

  static fromString(value: string): WordleDate {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (!match) throw new Error(`Invalid date string: ${value}, must be YYYY-MM-DD`)

    const [_, y, m, d] = match
    return WordleDate.fromDate(Number(y), Number(m) as Month, Number(d))
  }

  toString(): string {
    const y = this.partial.year.toString().padStart(4, '0')
    const m = this.partial.month.toString().padStart(2, '0')
    const d = this.day.toString().padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  toDate(): Date {
    return new Date(this.partial.year, this.partial.month - 1, this.day)
  }

  is(date: WordleDate): boolean {
    return (
      this.partial.year == date.partial.year &&
      this.partial.month == date.partial.month &&
      this.day == date.day
    )
  }

  isToday(): boolean {
    return this.is(WordleDate.today())
  }
}
