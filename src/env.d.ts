/// <reference types="@quasar/app-vite" />

interface Window {
  USE_MOCK_SERVICES?: boolean;
}

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}
