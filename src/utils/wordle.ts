export interface Letter {
  letter: string
  matches: 'yes' | 'partial' | 'no'
}

export type Word = Letter[]

export const keyboardRows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map((s) => s.toLowerCase())

export function match(input: string, solution: string): Word {
  let word: Word = [...input].map((c) => {
    return {
      letter: c,
      matches: 'no'
    }
  })

  let unmatchedLetters: Record<string, number> = {}
  ;[...solution].forEach((c) => {
    unmatchedLetters[c] = (unmatchedLetters[c] ?? 0) + 1
  })

  // 1. Marks letters that match exactly
  word = word.map((letter, index) => {
    if (letter.letter == solution[index]) {
      letter.matches = 'yes'
      unmatchedLetters[letter.letter]--
    }
    return letter
  })

  // 2. Marks letters that match partially in an ordered sequence
  word = word.map((letter, index) => {
    if (letter.matches != 'yes' && unmatchedLetters[letter.letter] > 0) {
      letter.matches = 'partial'
      unmatchedLetters[letter.letter]--
      return letter
    } else {
      return letter
    }
  })

  return word
}
