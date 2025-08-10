import {
  getRelativeLocaleUrl,
  middleware,
  redirectToDefaultLocale,
  redirectToFallback
} from 'astro:i18n'
import { defineMiddleware, sequence } from 'astro:middleware'

export const redirectWithLocalMiddleware = defineMiddleware(async (context, next) => {
  if (context.currentLocale && !context.url.pathname.startsWith(`/${context.currentLocale}`)) {
    return context.redirect(getRelativeLocaleUrl(context.currentLocale, context.url.pathname))
  } else {
    return await next()
  }
})

export const onRequest = sequence(
  // redirectWithLocalMiddleware,
  middleware({
    prefixDefaultLocale: true,
    redirectToDefaultLocale: false,
    fallbackType: 'rewrite'
  })
)
