import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const vitePrerender = require('vite-plugin-prerender')

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    vitePrerender({
      staticDir: path.join(__dirname, 'dist'),
      routes: ['/', '/services', '/projects', '/contact', '/404'],
      renderer: new vitePrerender.PuppeteerRenderer({
        renderAfterTime: 5000,
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true,
      }),
    }),
  ],
  server: {
    host: true,
    allowedHosts: ['pouring-unveiled-elevator.ngrok-free.dev'],
  },
})
