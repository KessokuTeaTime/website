import { defineConfig } from 'astro/config'
import node from '@astrojs/node'
import path from 'path'
import vue from '@astrojs/vue'
import mdx from '@astrojs/mdx'
import remarkGfm from 'remark-gfm'

export default defineConfig({
  adapter: node({ mode: 'standalone' }),
  integrations: [
    vue(),
    mdx({
      remarkPlugins: [remarkGfm]
    })
  ],
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
  },
  output: 'static'
})
