import { defineAstroI18nConfig } from 'astro-i18n'

export default defineAstroI18nConfig({
  primaryLocale: 'en',
  secondaryLocales: ['zh'],
  fallbackLocale: 'en',
  trailingSlash: 'always',
  run: 'client+server',
  showPrimaryLocale: true,
  translationLoadingRules: [],
  translationDirectory: {},
  translations: {},
  routes: {}
})
