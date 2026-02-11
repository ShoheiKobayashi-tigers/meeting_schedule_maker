/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // 他に変数が増えたらここに追記
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}