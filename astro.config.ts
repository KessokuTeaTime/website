import { defineConfig } from 'astro/config'
import path from 'path'
import vue from '@astrojs/vue'
import mdx from '@astrojs/mdx'

export default defineConfig({
  integrations: [vue(), mdx()],
  i18n: {
    locales: [
      {
        path: 'en',
        codes: ['en']
      },
      {
        path: 'zh',
        codes: ['zh']
      }
    ],
    defaultLocale: 'en',
    fallback: {
      zh: 'en'
    },
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
      fallbackType: 'rewrite'
    }
  },
  vite: {
    resolve: {
      alias: {
        '@': path.resolve('./src')
      }
    }
  },
  devToolbar: {
    enabled: false
  }
})
