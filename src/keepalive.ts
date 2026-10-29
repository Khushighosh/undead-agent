import { spawn } from 'node:child_process';

function start() {
  console.log('[keepalive] starting worker');
  const child = spawn('npx', ['tsx', 'src/worker.ts'], { stdio: 'inherit', shell: true });
  child.on('exit', () => {
    console.log('[keepalive] worker died, resurrecting in 5s...');
    setTimeout(start, 5000);
  });
}

start();