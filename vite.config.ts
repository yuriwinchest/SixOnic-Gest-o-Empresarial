import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      'process.env.DATABASE_URL': JSON.stringify(env.DATABASE_URL),
      'process.env.POSTGRES_URL': JSON.stringify(env.POSTGRES_URL),
      'process.env.POSTGRES_USER': JSON.stringify(env.POSTGRES_USER),
      'process.env.POSTGRES_HOST': JSON.stringify(env.POSTGRES_HOST),
      'process.env.POSTGRES_PASSWORD': JSON.stringify(env.POSTGRES_PASSWORD),
      'process.env.POSTGRES_DATABASE': JSON.stringify(env.POSTGRES_DATABASE)
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false
        }
      }
    }
  };
});