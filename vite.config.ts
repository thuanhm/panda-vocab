import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/panda-vocab/', // Đảm bảo tên này trùng với tên repository trên GitHub của bạn
})
