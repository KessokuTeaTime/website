import {
  getRelativeLocaleUrl,
  middleware,
  redirectToDefaultLocale,
  redirectToFallback
} from 'astro:i18n'
import { defineMiddleware, sequence } from 'astro:middleware'
import { config } from './config'

export const redirectWithLocalMiddleware = defineMiddleware(async (context, next) => {
  let locale = context.currentLocale
  let defaultLocale = config.siteInfo.defaultLocale
  let path = context.url.pathname

  function matches(locale?: string): boolean {
    if (locale == null) {
      return false
    } else {
      return path.startsWith(`/${locale}`)
    }
  }

  if (!matches(locale) && !matches(defaultLocale)) {
    return context.redirect(getRelativeLocaleUrl(locale!, path))
  } else {
    return await next()
  }
})

export const onRequest = sequence(
  redirectWithLocalMiddleware,
  middleware({
    prefixDefaultLocale: true,
    redirectToDefaultLocale: false,
    fallbackType: 'rewrite'
  })
)
