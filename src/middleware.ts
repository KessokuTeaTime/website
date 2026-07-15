import { getRelativeLocaleUrl, middleware as i18nMiddleware } from 'astro:i18n'
import { defineMiddleware, sequence } from 'astro:middleware'
import { paraglideMiddleware } from './paraglide/server'

const paraglideAstroMiddleware = defineMiddleware((context, next) => {
  return paraglideMiddleware(context.request, () => next())
})

export const sluggingMiddleware = defineMiddleware(async (context, next) => {
  const locale = context.currentLocale
  const path = context.url.pathname

  if (locale != null) {
    context.locals.root = getRelativeLocaleUrl(locale, '/')
    context.locals.slug = path.replace(new RegExp(`^/${locale}`), '')
  } else {
    context.locals.root = '/'
    context.locals.slug = path
  }

  return await next()
})

export const onRequest = sequence(
  paraglideAstroMiddleware,
  sluggingMiddleware,
  i18nMiddleware({
    prefixDefaultLocale: false,
    redirectToDefaultLocale: false,
    fallbackType: 'rewrite'
  })
)
