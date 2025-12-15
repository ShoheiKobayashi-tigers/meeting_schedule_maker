import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
      proxy: {
        //
        // 目的: /api から始まるリクエストを http://localhost:8080 へ転送する
        //
        '/api': {
          target: 'http://localhost:8080', // Spring BootのURL
          changeOrigin: true,            // ホストヘッダーをターゲットのURLに合わせる
          secure: false,                 // ターゲットがHTTPSでない場合はfalse
          rewrite: (path) => path.replace(/^\/api/, '') //
          // 必要であれば、転送時に /api をURLから削除する（例: /api/Scheduler -> /Scheduler）
          // Spring Boot側が /api を想定しないエンドポイント名の場合は有効にしてください。
        },
      },
    },
})
