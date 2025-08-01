import { defineConfig } from 'astro/config'
import path from 'path'
import vue from '@astrojs/vue'

export default defineConfig({
  integrations: [vue()],
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
