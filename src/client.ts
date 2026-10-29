import { Client, Connection } from '@temporalio/client';
import { undeadAgent } from './workflows';

async function run() {
  const connection = await Connection.connect();
  const client = new Client({ connection });
  const handle = await client.workflow.start(undeadAgent, {
    taskQueue: 'undead-agent',
    workflowId: `undead-agent-${Date.now()}`,
    args: ['./docs'],
  });
  console.log('Started', handle.workflowId);
  console.log(await handle.result());
}

run().catch(console.error);