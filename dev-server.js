import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import sendEmailHandler from './api/send-email.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadEnv = () => {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return;

  const raw = fs.readFileSync(envPath, 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
};

loadEnv();

const apiPort = 3001;
const frontendPort = 5173;

const startApiServer = () => new Promise((resolve) => {
  const server = http.createServer(async (req, res) => {
    const mockRes = {
      _statusCode: 200,
      status(code) {
        this._statusCode = code;
        return this;
      },
      json(payload) {
        const code = this._statusCode || 200;
        res.writeHead(code, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(payload));
        return this;
      },
      send(payload) {
        res.writeHead(this._statusCode || 200, { 'Content-Type': 'application/json' });
        res.end(typeof payload === 'string' ? payload : JSON.stringify(payload));
        return this;
      },
      setHeader(name, value) {
        res.setHeader(name, value);
        return this;
      },
      end(payload) {
        res.end(payload);
        return this;
      },
    };

    try {
      const url = new URL(req.url, `http://localhost:${apiPort}`);

      if (url.pathname !== '/api/send-email') {
        mockRes.status(404).json({ error: 'Route not found.' });
        return;
      }

      let rawBody = '';
      for await (const chunk of req) {
        rawBody += chunk;
      }

      if (rawBody) {
        try {
          req.body = JSON.parse(rawBody);
        } catch (error) {
          mockRes.status(400).json({ error: 'Invalid JSON body.', rawBody });
          return;
        }
      } else {
        req.body = {};
      }

      await sendEmailHandler(req, mockRes);
    } catch (error) {
      mockRes.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  server.listen(apiPort, '0.0.0.0', () => {
    console.log(`API server running at http://localhost:${apiPort}`);
    resolve(server);
  });
});

const startVite = () => {
  const viteBin = path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
  const child = spawn(process.execPath, [viteBin, '--host', '0.0.0.0', '--port', String(frontendPort)], {
    cwd: __dirname,
    stdio: 'inherit',
    env: { ...process.env, BROWSER: 'none' },
  });

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });

  return child;
};

const main = async () => {
  const apiServer = await startApiServer();
  const viteProcess = startVite();

  viteProcess.on('exit', (code) => {
    apiServer.close(() => process.exit(code ?? 0));
  });
};

main();
