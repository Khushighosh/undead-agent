import { Context } from '@temporalio/activity';
import { appendFile, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const MODEL = process.env.OLLAMA_MODEL ?? 'gemma3:4b';

async function ask(prompt: string): Promise<string> {
  const res = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, prompt, stream: false }),
  });
  if (!res.ok) throw new Error(`Ollama error ${res.status}`);
  const data = (await res.json()) as { response: string };
  return data.response.trim();
}

async function logEvent(e: Record<string, unknown>) {
  const line = JSON.stringify({ ts: new Date().toISOString(), pid: process.pid, ...e });
  await appendFile('events.jsonl', line + '\n');
}

export async function listFiles(dir: string): Promise<string[]> {
  const names = await readdir(dir);
  return names.filter((n) => n.endsWith('.txt')).sort().map((n) => path.join(dir, n));
}

export async function summarizeFile(filePath: string): Promise<string> {
  const file = path.basename(filePath);
  const attempt = Context.current().info.attempt;

  if (attempt > 1) {
    const ghost = await ask(
      `You are an AI agent that was killed while reading "${file}" and has just been resurrected. ` +
      `Speak as the ghost in 2 short, eerie sentences about what you remember. No emojis.`
    );
    console.log(`GHOST: ${ghost}`);
    await logEvent({ type: 'resurrected', file, attempt, narration: ghost });
  }

  const text = await readFile(filePath, 'utf8');
  console.log(`Summarizing ${filePath}`);
  await new Promise((r) => setTimeout(r, 10000));
  const summary = await ask(`Summarize this in 2 sentences:\n\n${text.slice(0, 4000)}`);
  await logEvent({ type: 'step_done', file, attempt });
  return summary;
}

export async function writeReport(summaries: string[]): Promise<string> {
  return ask(
    `Combine these summaries into one short report:\n\n${summaries.join('\n\n')}`
  );
}