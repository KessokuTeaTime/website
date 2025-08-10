export type Localized<T> =
  | T
  | {
      fallback: T
      localizations?: Record<string, T>
    }

export function getLocalizedValue<T>(from: Localized<T>, locale?: string): T {
  if (typeof from === 'object' && from && 'fallback' in from) {
    let fallback = from.fallback
    if (locale && from.localizations) {
      let result = from.localizations[locale] ?? fallback
      return result
    } else {
      return fallback
    }
  } else {
    return from
  }
}
