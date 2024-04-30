import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import mkcert from 'vite-plugin-mkcert'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import pugPlugin from "vite-plugin-pug"

export default ({ mode }: any) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  return defineConfig({
    server: {https: true},
    plugins: [
      vue({
        template: {transformAssetUrls}
      }),
      mkcert(),
      quasar({
        sassVariables: 'src/styles/quasar-variables.sass'
      }),
      pugPlugin(),
    ],
    base: '/' + process.env.VITE_APP_PATH + '/'
  })
}
