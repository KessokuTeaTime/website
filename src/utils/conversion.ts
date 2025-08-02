export function fontSize(): number {
  return parseFloat(getComputedStyle(document.documentElement).fontSize)
}

export function remToPx(rem: string | number): number {
  const value = typeof rem === 'string' ? parseFloat(rem) : rem
  return value * fontSize()
}

export function pxToRem(px: number): string {
  return `${px / fontSize()}rem`
}
