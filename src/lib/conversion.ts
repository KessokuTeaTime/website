// unitflip
export type Unit =
  | 'px'
  | 'rem'
  | 'em'
  | '%'
  | 'vw'
  | 'vh'
  | 'vmin'
  | 'vmax'
  | 'ch'
  | 'cm'
  | 'in'
  | 'mm'
  | 'pt'
  | 'pc'
  | 'q'
  | 'rlh'

export function fontSize(): number {
  return parseFloat(getComputedStyle(document.documentElement).fontSize)
}
