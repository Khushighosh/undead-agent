import { Worker } from '@temporalio/worker';
import { appendFile } from 'node:fs/promises';
import path from 'node:path';
import * as activities from './activities';

async function run() {
  const worker = await Worker.create({
    workflowsPath: path.join(__dirname, 'workflows.ts'),
    activities,
    taskQueue: 'undead-agent',
  });
  console.log('Worker alive');
  await appendFile(
    'events.jsonl',
    JSON.stringify({ ts: new Date().toISOString(), pid: process.pid, type: 'born' }) + '\n'
  );
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});