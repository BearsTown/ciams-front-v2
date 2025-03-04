import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import tsconfigPaths from 'vite-tsconfig-paths'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { ConfigEnv, defineConfig, loadEnv, UserConfig } from 'vite'
import ckeditor5 from '@ckeditor/vite-plugin-ckeditor5'
import { fileURLToPath } from 'url'
import Unocss from 'unocss/vite'
import {
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

import { proxy } from './src/config/proxy'
import { wrapperEnv } from './src/utils/getEnv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = resolve(__filename, '..')

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, `${process.cwd()}/env`)
  const viteEnv = wrapperEnv(env)

  console.log(viteEnv)

  const {
    VITE_APP_PORT,
    VITE_APP_PREVIEW,
    VITE_APP_CONTEXT,
    VITE_APP_USE_CONSOLE,
    VITE_APP_USE_SOURCEMAP,
  } = viteEnv

  return {
    base: `/${VITE_APP_CONTEXT}`,
    plugins: [
      vue(),
      tsconfigPaths(),
      createSvgIconsPlugin({
        iconDirs: [
          resolve(process.cwd(), 'public/assets/svg'),
          resolve(process.cwd(), 'src/assets/img'),
          resolve(process.cwd(), 'src/assets/svg'),
        ], //
        symbolId: 'icon-[dir]-[name]',
      }),
      // Unocss({
      //   presets: [
      //     presetUno(),
      //     presetAttributify(),
      //     presetIcons({
      //       scale: 1.2,
      //       warn: true,
      //     }),
      //   ],
      //   transformers: [transformerDirectives(), transformerVariantGroup()],
      // }),
      ckeditor5({ theme: resolve('node_modules/@ckeditor/ckeditor5-theme-lark') }),
    ],
    // define: {
    //   global: '',
    // },
    resolve: {
      alias: [{ find: '@', replacement: '/src' }],
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    server: {
      port: VITE_APP_PORT,
      open: VITE_APP_PREVIEW,
      proxy: proxy(),
    },
    esbuild: {
      drop: VITE_APP_USE_CONSOLE ? [] : ['console', 'debugger'],
    },
    build: {
      outDir: 'dist',
      minify: 'esbuild',
      sourcemap: VITE_APP_USE_SOURCEMAP,
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        external: ['**/*.mp4'],
        input: {
          main: resolve(__dirname, 'index.html'),
          '3d': resolve(__dirname, '3d.html'),
        },
      },
    },
    preview: {
      open: true,
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          // additionalData: `@use "@/styles/element/index.scss" as *;`,
        },
      },
    },
  }
})
