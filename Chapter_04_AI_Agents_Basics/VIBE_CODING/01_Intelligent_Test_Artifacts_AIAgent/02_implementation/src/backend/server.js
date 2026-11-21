// Local server: API + the built React app (npm run build). On Vercel, api/index.js is used instead.
import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import app from './app.js';
import { APP_ROOT, PORT, ENV_FILE, envLoaded, TEMPLATE_DIR } from './config.js';
import { templateStatus } from './templates.js';

const server = express();
server.use(app);
const dist = path.join(APP_ROOT, 'dist');
if (fs.existsSync(dist)) {
  server.use(express.static(dist));
  server.get(/^\/(?!api).*/, (req, res) => res.sendFile(path.join(dist, 'index.html')));
}

server.listen(PORT, () => {
  console.log(`Test Artifacts Studio on http://localhost:${PORT}`);
  console.log(`Config: ${envLoaded ? 'loaded' : 'NOT FOUND'} ${ENV_FILE}`);
  console.log(`Templates: ${TEMPLATE_DIR}`);
  templateStatus().forEach((t) => console.log(`  ${t.type}: ${t.ok ? 'ok' : 'MISSING'} (${t.path})`));
});
