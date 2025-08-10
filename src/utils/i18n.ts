export type Localized<T> =
  | T
  | {
      fallback: T
      localizations?: Record<string, T>
    }

export function getLocalizedValue<T>(from: Localized<T>, locale?: string): T {
  if (typeof from === 'object' && from != null && 'fallback' in from) {
    let fallback = from.fallback
    if (locale != null && from.localizations != null) {
      let result = from.localizations[locale] ?? fallback
      return result
    } else {
      return fallback
    }
  } else {
    return from
  }
}

export function getLanguageName(locale: string, displayLocale = 'en'): string | undefined {
  const displayNames = new Intl.DisplayNames([displayLocale], { type: 'language' })
  return displayNames.of(locale)
}
