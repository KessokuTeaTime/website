import { defineConfig } from 'astro/config'
import path from 'path'
import vue from '@astrojs/vue'
import mdx from '@astrojs/mdx'
import devtoolsJson from 'vite-plugin-devtools-json'

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
    },
    plugins: [
      // https://github.com/Alexandre-Fernandez/astro-i18n/issues/87#issuecomment-2929474869
      devtoolsJson()
    ]
  },
  devToolbar: {
    enabled: false
  }
})
