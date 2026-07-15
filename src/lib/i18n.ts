import type { Locale } from '@/paraglide/runtime'

export type Localized<T> =
  | T
  | {
      fallback: T
      localizations?: Record<string, T>
    }

export function getLocalizedValue<T>(from: Localized<T>, locale?: Locale): T {
  if (typeof from === 'object' && from != null && 'fallback' in from) {
    const fallback = from.fallback
    if (locale != null && from.localizations != null) {
      const result = from.localizations[locale] ?? fallback
      return result
    } else {
      return fallback
    }
  } else {
    return from
  }
}

export function getLanguageName(locale: Locale, displayLocale = 'en'): string | undefined {
  const displayNames = new Intl.DisplayNames([displayLocale], { type: 'language' })
  return displayNames.of(locale)
}
