import { defineConfig } from 'vite';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Parse .env file directly — avoids any loadEnv prefix-filtering issues
function loadDotenv() {
  try {
    const envPath = resolve(process.cwd(), '.env');
    const content = readFileSync(envPath, 'utf-8');
    const vars = {};
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      vars[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
    }
    return vars;
  } catch {
    return {};
  }
}

function smsProxy() {
  const env = loadDotenv();

  return {
    name: 'sms-proxy',
    configureServer(server) {
      const key = env.TEXTBELT_KEY;
      if (!key) {
        console.warn('[sms-proxy] WARNING: TEXTBELT_KEY not found in .env file');
      } else {
        console.log('[sms-proxy] TEXTBELT_KEY loaded successfully');
      }

      server.middlewares.use('/api/sms', async (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
          return;
        }

        try {
          // Read the request body
          const chunks = [];
          for await (const chunk of req) chunks.push(chunk);
          const body = JSON.parse(Buffer.concat(chunks).toString());

          // Inject the API key server-side
          body.key = key;

          // Forward to Textbelt
          const tbRes = await fetch('https://textbelt.com/text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });
          const data = await tbRes.json();

          res.writeHead(tbRes.status, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(data));
        } catch (err) {
          console.error('[sms-proxy] Error:', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'SMS proxy error' }));
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [smsProxy()],
});
