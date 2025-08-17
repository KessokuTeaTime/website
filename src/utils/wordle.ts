import camelcaseKeys from 'camelcase-keys'
import { toQueryRecord, withQuery } from './api'
import decamelcaseKeys from 'decamelcase-keys'

export const keyboardRows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map((s) => s.toLowerCase())

export interface Letter {
  letter: string
  matches: '+' | '?' | '-'
}

export type Word = Letter[]

export interface WordleParams {
  date: String
}

export interface WordlePayload {
  answer: String
}

export interface WordleResponse {
  remainingTries: number
  isDirty: boolean
  isCompleted: boolean
  history: Word[]
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
    if (!res.ok) throw new Error('Failed to init session context')
  }

  async start(params: WordleParams): Promise<WordleResponse> {
    const res = await fetch(
      withQuery(`${this.baseUrl}/play/start`, toQueryRecord(decamelcaseKeys(params))),
      {
        method: 'GET',
        credentials: 'include'
      }
    )
    return camelcaseKeys(await res.json())
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
    return camelcaseKeys(await res.json())
  }
}
