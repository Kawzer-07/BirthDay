import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { appendFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.dirname(fileURLToPath(import.meta.url))
const addressLogPath = path.join(projectRoot, 'delivery-addresses.txt')

export default defineConfig({
  plugins: [react(), {
    name: 'birthday-address-terminal',
    configureServer(server) {
      server.middlewares.use('/api/delivery-address', (req, res, next) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Allow', 'POST');
          res.end();
          return;
        }

        let body = '';
        let tooLarge = false;
        req.on('data', (chunk) => {
          body += chunk.toString();
          if (Buffer.byteLength(body, 'utf8') > 4096) {
            tooLarge = true;
            res.statusCode = 413;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Address is too long.' }));
            req.destroy();
          }
        });
        req.on('end', async () => {
          if (tooLarge) return;
          try {
            const payload = JSON.parse(body || '{}');
            const address = String(payload.address || '')
              .replace(/[\r\n\0-\x1f\x7f]/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();
            if (address.length < 5 || address.length > 1500) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Enter a valid delivery address.' }));
              return;
            }

            const timestamp = new Date().toISOString()
            await appendFile(addressLogPath, `${timestamp}\t${address}\n`, 'utf8')
            console.log(`\n[Birthday delivery address · ${new Date().toLocaleString()}]\n${address}\n`)
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true }));
          } catch {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'The address could not be saved. Please try again.' }));
          }
        });
        req.on('error', next);
      });
    },
  }],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['.trycloudflare.com', '.ngrok-free.app', '.loca.lt'],
    port: 3000,
    open: true,
  },
})

