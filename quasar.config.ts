import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from '#q-app/wrappers';
import tailwindcss from '@tailwindcss/vite';
import istanbul from 'vite-plugin-istanbul';
import { codecovVitePlugin } from '@codecov/vite-plugin';
import checker from 'vite-plugin-checker';

export default defineConfig((ctx) => {
  return {
    boot: ['blog-service', 'i18n'],

    css: [],

    extras: ['material-icons'],

    framework: {
      config: {},
      plugins: [],
    },

    animations: [],

    build: {
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
        node: 'node22',
      },

      typescript: {
        strict: true,
        vueShim: true,
      },

      vueRouterMode: 'history',

      alias: {
        '@': path.resolve(__dirname, './src'),
      },

      vitePlugins: [
        [
          '@intlify/unplugin-vue-i18n/vite',
          {
            // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
            // compositionOnly: false,

            // if you want to use named tokens in your Vue I18n messages, such as 'Hello {name}',
            // you need to set `runtimeOnly: false`
            // runtimeOnly: false,

            ssr: ctx.modeName === 'ssr',

            // you need to set i18n resource including paths !
            include: [fileURLToPath(new URL('./src/i18n', import.meta.url))],
          },
        ],
        [checker, { typescript: true, vueTsc: true }],
        [
          istanbul,
          {
            include: 'src/*',
            exclude: ['node_modules', 'test/'],
            extension: ['.js', '.ts', '.vue'],
            requireEnv: true,
          },
        ],
      ],

      extendViteConf(viteConf) {
        // Add plugins that return Plugin[] instead of Plugin via extendViteConf
        viteConf.plugins = viteConf.plugins || [];
        viteConf.plugins.push(tailwindcss());
        viteConf.plugins.push(
          codecovVitePlugin({
            enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
            bundleName: 'deretsolver',
            uploadToken: process.env.CODECOV_TOKEN,
            gitService: 'github',
          }),
        );

        viteConf.build = viteConf.build || {};
        viteConf.build.modulePreload = {
          polyfill: true,
        };
        viteConf.build.rollupOptions = {
          output: {
            manualChunks: {
              'vue-vendor': ['vue', 'vue-router'],
            } as any,
          },
        };
      },
    },

    devServer: {
      port: 5173,
      open: false,
    },

    htmlVariables: {
      title: 'Andi IM',
      description:
        'Andi Irham - Mobile App Developer & AI Enthusiast. Specializing in Android, Kotlin, Flutter development.',
    },
    ssr: {
      prodPort: 3000,
      middlewares: ['render'],
      pwa: false,
    },
    pwa: {
      workboxMode: 'GenerateSW',
    },
    cordova: {},
    capacitor: {
      hideSplashscreen: true,
    },
    electron: {
      preloadScripts: ['electron-preload'],
      inspectPort: 5858,
      bundler: 'packager',
      packager: {},
      builder: {
        appId: 'com.andiirham.andiim',
      },
    },
    bex: {
      extraScripts: [],
    },
  };
});
