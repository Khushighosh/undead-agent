import http from 'node:http';
import { readFile } from 'node:fs/promises';

const PORT = 3000;

async function readEvents(): Promise<any[]> {
  try {
    const raw = await readFile('events.jsonl', 'utf8');
    return raw.split('\n').filter(Boolean).flatMap((l) => {
      try { return [JSON.parse(l)]; } catch { return []; }
    });
  } catch {
    return [];
  }
}

http
  .createServer(async (req, res) => {
    if (req.url === '/events') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(await readEvents()));
    } else if (req.url === '/kill' && req.method === 'POST') {
      const events = await readEvents();
      const last = events[events.length - 1];
      if (!last) { res.writeHead(404); res.end('no worker seen yet'); return; }
      try {
        process.kill(last.pid, 'SIGKILL');
        res.writeHead(200); res.end('killed ' + last.pid);
      } catch {
        res.writeHead(500); res.end('could not kill ' + last.pid);
      }
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(await readFile('public/index.html', 'utf8'));
    }
  })
  .listen(PORT, '127.0.0.1', () => console.log(`Morgue open at http://localhost:${PORT}`));