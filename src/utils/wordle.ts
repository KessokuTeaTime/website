export interface Letter {
  letter: string
  matches: 'yes' | 'partial' | 'no'
}

export type Word = Letter[]

export const keyboardRows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map((s) => s.toLowerCase())
