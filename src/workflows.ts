import { proxyActivities } from '@temporalio/workflow';
import type * as activities from './activities';

const { listFiles, summarizeFile } = proxyActivities<typeof activities>({
  startToCloseTimeout: '30 seconds',
  retry: { maximumAttempts: 5 },
});

const { writeReport } = proxyActivities<typeof activities>({
  startToCloseTimeout: '120 seconds',
  retry: { maximumAttempts: 5 },
});

export async function undeadAgent(dir: string): Promise<string> {
  const files = await listFiles(dir);
  const summaries: string[] = [];
  for (const f of files) {
    summaries.push(await summarizeFile(f));
  }
  return writeReport(summaries);
}