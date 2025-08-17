export type RangeType<N extends number, T extends unknown[] = []> = T['length'] extends N
  ? never
  : T['length'] | RangeType<N, [...T, unknown]>
