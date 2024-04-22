import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mkcert from 'vite-plugin-mkcert'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import pugPlugin from "vite-plugin-pug"

export default defineConfig({
  server: { https: true },
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    mkcert(),
    quasar({
      sassVariables: 'src/quasar-variables.sass'
    }),
    pugPlugin(),
  ],
})
