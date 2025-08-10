import { defineConfig } from 'astro/config'
import path from 'path'
import vue from '@astrojs/vue'
import mdx from '@astrojs/mdx'

export default defineConfig({
  integrations: [vue(), mdx()],
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
    fallback: {
      zh: 'en'
    },
    routing: 'manual'
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
