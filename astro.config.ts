import { defineConfig } from 'astro/config'
import path from 'path'
import vue from '@astrojs/vue'
import mdx from '@astrojs/mdx'
import devtoolsJson from 'vite-plugin-devtools-json'
import type { Extension } from 'micromark-util-types'
import { micromarkExtensions } from '@/lib/markdown'
import remarkGfm from 'remark-gfm'

export default defineConfig({
  integrations: [
    vue(),
    mdx({
      remarkPlugins: [
        remarkGfm,
        (_tree, file) => {
          const data = file.data as {
            micromarkExtensions?: Extension[]
          }

          data.micromarkExtensions ??= []
          data.micromarkExtensions.push(...micromarkExtensions)
        }
      ]
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
    },
    plugins: [
      // https://github.com/Alexandre-Fernandez/astro-i18n/issues/87#issuecomment-2929474869
      devtoolsJson()
    ]
  },
  devToolbar: {
    enabled: false
  },
  output: 'static'
})
