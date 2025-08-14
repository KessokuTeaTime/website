export interface Letter {
  letter: string
  matches: 'yes' | 'partial' | 'no'
}

export type Word = Letter[]
