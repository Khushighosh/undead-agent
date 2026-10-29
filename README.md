# Undead Agent

A local AI agent that survives being killed. It summarizes files with Gemma (via Ollama), runs on Temporal durable workflows, and resumes from the exact step where it died. A ghost narrates each resurrection. A morgue dashboard shows every life and death.

## Run it
1. Install Ollama and pull a Gemma model (default: gemma3:4b)
2. Install the Temporal CLI, then run: temporal server start-dev
3. npm install
4. npx tsx src/keepalive.ts
5. npx tsx src/dashboard.ts (open http://localhost:3000)
6. npx tsx src/client.ts
7. Click Kill it on the dashboard and watch the agent come back

Put .txt files in docs/ for it to summarize.

## Stack
Gemma (open-weight model), Ollama, Temporal, Render (demo page)
