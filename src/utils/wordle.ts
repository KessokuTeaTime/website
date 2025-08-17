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
