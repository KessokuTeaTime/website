import { getRelativeLocaleUrl, middleware } from 'astro:i18n'
import { defineMiddleware, sequence } from 'astro:middleware'
import { config } from './config'
import { useAstroI18n } from 'astro-i18n'

export const sluggingMiddleware = defineMiddleware(async (context, next) => {
  const locale = context.currentLocale
  const defaultLocale = config.siteInfo.defaultLocale
  const path = context.url.pathname

  if (locale != null) {
    context.locals.root = getRelativeLocaleUrl(locale, '/')

    if (defaultLocale != null) {
      context.locals.slug = path.replace(new RegExp(`^(/${locale})|(/${defaultLocale})`), '')
    } else {
      context.locals.slug = path.replace(new RegExp(`^/${locale}`), '')
    }
  } else {
    context.locals.root = '/'
    context.locals.slug = path
  }

  return await next()
})

export const onRequest = sequence(
  useAstroI18n(),
  sluggingMiddleware,
  middleware({
    prefixDefaultLocale: true,
    redirectToDefaultLocale: false,
    fallbackType: 'rewrite'
  })
)
