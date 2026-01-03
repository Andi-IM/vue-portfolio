<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <img :src="notFoundImage" alt="404 - Page Not Found" style="max-width: 400px; width: 100%" />

      <div class="text-h2" style="opacity: 0.4">
        {{ t('module.not_found.message') }}
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        :label="t('module.not_found.go_home')"
        no-caps
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import notFoundImage from '@/images/404-illustration.png';

const { t } = useI18n();
</script>
