# Long-Term Memory For Claude Code

**How `memory-pkg` turns every coding session into queryable, time-indexed history — and surfaces it back into the next session automatically.**

*Design and implementation walkthrough, not an install tutorial. Install steps will land when the NPM package ships; for now the code lives in the `drift-detector` monorepo and is referenced here by file path.*

---

## The problem

There are two kinds of forgetting that hurt a coding agent.

The first is **structural forgetting**: the agent doesn't know what your codebase looks like. It re-greps and re-reads files every session to reconstruct who calls whom, what types live where, which functions are entry points. That's what graph-backed codebase tools — `sylphie-pkg` and its drift-detector port `codebase-pkg` — solve. Encode the codebase's structure once; let the agent query it.

The second is **episodic forgetting**: the agent doesn't remember the *work*. Two weeks ago you and the agent worked out why TimescaleDB beat plain Postgres for your use case. Today you're asking "should I add pgvector or use Pinecone for embeddings?" and the agent will not consult that prior reasoning. It will re-derive an answer from scratch, sometimes contradicting itself, often hedging.

Claude Code's `MEMORY.md` auto-memory file partly addresses this, but it's hand-curated — you decide what to remember. That's the right tool for stable preferences and user facts. It's the wrong tool for *"what did we try last Thursday and why did it not work?"* That kind of recall needs the full transcript, indexed and searchable.

`memory-pkg` fills that second gap. It reads the official Claude Code transcript JSONL files, extracts events, persists them to TimescaleDB, and injects relevant historical events into every new user prompt — automatically, transparently, without the developer doing anything.

One thing worth flagging up front: the fast path is plain SQL trigram search against a Postgres GIN index. For well-formed prompts it short-circuits the rest of the pipeline at score ≥ 0.7 — which surprised me, and may surprise you. The semantic-embedding tier exists in the code but is dormant in the live config. Trigram lexical retrieval, plus an entity tier that reads the last 20 lines of the active transcript, is enough most of the time. The next sections explain why.

## What `memory-pkg` is

`memory-pkg` is a TimescaleDB-backed long-term session memory store under [`drift-detector/packages/memory-pkg/`](https://github.com/). Its own description: *"Long-term session memory for Claude Code work on drift-detector. JSONL buffer + TimescaleDB hypertable + fuzzy search + temporal windowing and unwind."* ([`packages/memory-pkg/package.json:6`](https://github.com/))

Five pieces hold it together:

1. **A capture hook** that reads the transcript tail on every `Stop` event and appends new events to a local JSONL buffer. ([`drift-detector/.claude/hooks/memory-capture.cjs`](https://github.com/))
2. **An ingester** that rotates the buffer atomically and bulk-inserts into a Timescale hypertable. ([`packages/memory-pkg/src/ingest/ingester.ts`](https://github.com/))
3. **A multi-tier retrieval pipeline** that fires on every `UserPromptSubmit`. It includes an **entity tier that reads the last 20 lines of the active transcript** so pronoun-shaped prompts like *"ok let's do that"* still find the right history. ([`packages/memory-pkg/src/inject/generate.ts`](https://github.com/), [`packages/memory-pkg/src/inject/tiers/entity.ts`](https://github.com/))
4. **An MCP server** with four tools — `searchMemory`, `getMemoryContext`, `unwindFromEvent`, `getSessionTimeline` — registered in [`drift-detector/.mcp.json`](https://github.com/) so the agent can deliberately drill in when auto-injection isn't enough. ([`packages/memory-pkg/src/mcp-server/index.ts:29-92`](https://github.com/))
5. **A rationale-synthesis job** that compresses each turn into a 2-3 sentence "why" event at ingest time, so future searches for "why did we…" match the reasoning instead of the actions. ([`packages/memory-pkg/src/rationale/synthesize.ts`](https://github.com/))

It lives in the `drift-detector` monorepo. Unlike `codebase-pkg` — which was ported into drift-detector from sylphie's `sylphie-pkg` — `memory-pkg` was written fresh for drift-detector. There is no ancestor of it in the sylphie repo.

## Architecture at a glance

Two views worth showing. The first is the system as designed — every retrieval tier engaged. The second is the live configuration today, which intentionally runs only the cheap tiers.

### Designed flow

```
┌─ Claude Code session ──────────────────────────────────┐
│   ~/.claude/projects/<sanitized-path>/<sess>.jsonl    │  ← source of truth
└─────┬──────────────────────────────────────────┬───────┘
      │ Stop hook reads tail via byte cursor     │ UserPromptSubmit
      ▼                                          │ hook
┌─ .claude/memory/ ──────────────────────────┐   │
│  buffer.jsonl       (append-only)          │   │
│  cursors/<sess>.json (lastUuid, byteOffset)│   │
└─────┬──────────────────────────────────────┘   │
      │ Ingester (async after Stop)              │
      ▼                                          │
┌─ TimescaleDB ──────────────────────────────────┴───────┐
│  memory_events hypertable                              │
│  ├─ GIN trigram index on search_text                   │
│  ├─ HNSW index on embedding vector(384)                │
│  ├─ subsystem column + index                           │
│  └─ unique (session_id, transcript_uuid, ts)           │
└─────┬───────────────────────────────────┬──────────────┘
      │ Multi-tier retrieval (parallel)   │ MCP stdio
      ▼                                   │ (4 tools)
┌─ Inject pipeline ──────────────────────┐│
│  Fast path:    trigram + entity        ││ ┌─ Claude Code ─┐
│  Rescue:       embedding + classifier  ││ │  deliberate   │
│                + kg                    ││ │  recall via   │
│  Optional rerank (Haiku, off-default)  ││ │  MCP tools    │
│  Format <memory-context> markdown      ││ └───────────────┘
└─────┬──────────────────────────────────┘│
      │ additionalContext (up to 4 kB)    │
      ▼                                   │
   Next user prompt arrives with memory pre-loaded
```

### Live config today

```
┌─ Inject pipeline (live registry) ──────────────────────┐
│  Fast path:   trigram + entity            ← active     │
│  Rescue:      (empty array)               ← dormant    │
│  Optional rerank:  disabled by default                 │
└────────────────────────────────────────────────────────┘
```

`embedding`, `classifier`, and `kg` tiers are imported into the registry but explicitly dormant — `void embeddingTier; void classifierTier; void kgTier;` ([`packages/memory-pkg/src/inject/tiers/index.ts:20-31`](https://github.com/)). The orchestration plumbing, the schema columns (`embedding`, `subsystem`), and the per-tier code are intact. Flipping any rescue tier back on is a one-line registry edit.

Two databases sit underneath: TimescaleDB for the time-series memory store, and Neo4j (shared with `codebase-pkg`) for the optional knowledge-graph retrieval tier. Both come up via `docker compose`.

## The capture path

When a session ends, Claude Code fires its `Stop` event. The hook reads the official transcript JSONL at `~/.claude/projects/<sanitized-path>/<sessionId>.jsonl`, advancing a per-session cursor that tracks both byte offset and last-seen UUID — partial-line writes during reads are safely re-read on the next turn, and crash recovery is idempotent. ([`memory-capture.cjs:258-314`](https://github.com/)) Five event types are emitted: `user_prompt`, `assistant_thinking`, `assistant_text`, `tool_call`, `tool_result`. Each carries four text representations sized for different jobs — `summary` (~160 chars), `excerpt` (300–600 chars, used for injection), `search_text` (up to 2000 chars, trigram-indexed), and `payload` (full JSONB). The buffer rotates atomically before ingest; failed batches move to `buffer.failed.jsonl` rather than being silently dropped. ([`ingester.ts:120-146`](https://github.com/)) Deduplication is enforced by a unique index on `(session_id, transcript_uuid, ts)`. ([`schema.ts:91-94`](https://github.com/))

## The schema

The `memory_events` hypertable partitions on `ts`. Key columns: `excerpt`/`search_text`/`payload` carry the three retrieval surfaces (injection, fuzzy search, full detail); `embedding vector(384)` carries semantic search when the embedding tier is enabled; `subsystem` carries classifier-tagged retrieval. Indexes cover `(session_id, ts)`, `(event_id)`, `(event_type, ts)`, `(file_path, ts)` partial, `(subsystem, ts)` partial, GIN trigram on `search_text`, and HNSW cosine on `embedding`. The schema script is idempotent — safe to re-run on every deploy. Full DDL: [`packages/memory-pkg/src/schema.ts:31-95`](https://github.com/).

The 384 dimension is set by the embedding model — `Xenova/bge-small-en-v1.5`, which runs locally via `@huggingface/transformers`. ([`packages/memory-pkg/src/embed.ts:5-18`](https://github.com/))

## The retrieval pipeline

Every new user prompt fires `memory-inject.cjs`. ([`drift-detector/.claude/hooks/memory-inject.cjs`](https://github.com/)) The hook spawns the compiled CLI with the prompt text, waits up to 30 seconds (overridable via `DRIFT_MEMORY_HOOK_TIMEOUT_MS`), and emits whatever the CLI prints as `additionalContext` on a `UserPromptSubmit` hook event. If the CLI isn't built, the DB is down, or anything errors, the hook silently exits — it never blocks the user's message. ([`memory-inject.cjs:42-71`](https://github.com/))

Inside the CLI, `generateInjection()` runs a tiered retrieval system. Five tiers are implemented; the live registry returns `[trigramTier, entityTier]` for the fast path and an empty rescue array. ([`tiers/index.ts:20-31`](https://github.com/))

**Tier 1 — Trigram lexical** ([`tiers/trigram.ts`](https://github.com/)). Pure SQL. Postgres `word_similarity(query, search_text)` against the GIN trigram index. Pulls top 20 above 0.2 similarity, ordered by score then recency. Zero LLM cost.

**Tier 2 — Entity-aware lexical** ([`tiers/entity.ts`](https://github.com/)). Same engine, different inputs. Pure trigram fails when the prompt is a pronoun ("ok let's do that"). The entity tier extracts identifiers — backticked terms, double-quoted phrases, file paths, CamelCase, snake_case — from both the current prompt *and the last 20 lines of the active transcript*. Identifiers from the prompt are weighted double over transcript mentions; the top-ranked entities get one trigram query each, in parallel. ([`entity.ts:91-268`](https://github.com/)) Metadata is surfaced — queried entities, dropped ones, overflow counts — so the orchestrator can hint *"more matches exist for `<entity>`; call `searchMemory` to widen."* ([`generate.ts:198-214`](https://github.com/))

**Tier 3 — Semantic embedding** ([`tiers/embedding.ts`](https://github.com/)). Embeds the query via `bge-small-en-v1.5` (local ONNX), runs an HNSW-accelerated cosine KNN against the `embedding` column. Score is `1 - cosine_distance`.

**Tier 4 — Classifier-driven** ([`tiers/classifier.ts`](https://github.com/), [`inject/classify.ts`](https://github.com/)). Shells out to a local `claude` CLI (Haiku) with a tmpdir cwd and a flag set that keeps Max-OAuth and trims startup. Haiku returns strict JSON `{intent, subsystems, files, entities, confidence}`. Files validate against the filesystem to drop hallucinations; subsystems validate against a whitelist built from `DISTINCT subsystem` in `memory_events`. Score is `classifier_confidence × exp(-age_days / 7)`. Classifications cache on disk for 24 hours (override via `DRIFT_MEMORY_CLASSIFIER_CACHE_TTL_MS`). ([`classify.ts:30-37, 114-163`](https://github.com/))

**Tier 5 — Knowledge graph** ([`tiers/kg.ts`](https://github.com/)). Reads the classifier's cached file list, expands each file by one hop through codebase-pkg's Neo4j `IMPORTS` edges in both directions, queries `memory_events` for events on expanded files within 30 days. Score is `classifier_confidence × 0.7 × exp(-age_days / 7)` — the 0.7 discount reflects that the KG candidates are expanded outward from primary hits. ([`kg.ts:33, 122-132`](https://github.com/))

Each tier returns `{event_id, score, source_tier}` candidates. The merger ([`merger.ts`](https://github.com/)) combines them by weighted average (default `weighted` strategy; alternatives: `union`, `intersection`). Default weights: trigram 0.2, entity 0.3, embedding 0.3, classifier 0.4, kg 0.1. An event surfaced by multiple tiers wins on agreement, not just raw score.

**Fast-path short-circuit.** If trigram + entity produce a merged candidate at score ≥ 0.7, the rescue phase is skipped entirely — no Haiku call, no graph expansion. ([`generate.ts:99-114`](https://github.com/)) For well-formed prompts the answer comes back as pure SQL.

**Output.** Up to 3 candidates (default; configurable 1–10; capped at 4 KB total chars) are formatted into a `<memory-context>` markdown block. Each entry shows score, event type, tool name, file path, date, and source tiers (`[trigram+entity]`). The block is wrapped: *"These are from previous sessions, not the current conversation. Use them as reference, not as current state."* ([`generate.ts:188-194, 246`](https://github.com/))

### A worked example

Real prompt: *"what did we decide about the classifier cache TTL?"*

| Stage | What happens |
|---|---|
| **Trigram** | `word_similarity("what did we decide about the classifier cache TTL?", search_text)` against the GIN index. Hits on past `assistant_text` and `turn_rationale` events containing "classifier" and "cache". Top hits in the ~0.35–0.45 range. |
| **Entity** | Extracts `classifier`, `cache`, `TTL` from the prompt. Queries each as a separate `word_similarity` lookup in parallel. The `classifier` and `TTL` queries hit more focused content; `cache` returns noisier matches. Top merged entity score around 0.5. |
| **Merger** (weighted, trigram 0.2 / entity 0.3) | An event surfaced by *both* tiers — say, a prior `turn_rationale` that explained the 24h TTL choice — wins on agreement. Top merged candidate ~0.47, below the 0.7 strong threshold but well above the 0.2 floor. |
| **Output** | Up to 3 candidates formatted into the `<memory-context>` block. The prompt arrives at the model with the prior decision pre-loaded as historical context. |
| **Cost** | ~600 ms of SQL. Zero LLM tokens during retrieval. |

(Score ranges are illustrative — actual values depend on what's in your store. The pipeline shape is faithful to the code in `generate.ts`.)

## Surfacing memory deliberately — the MCP path

Auto-injection is the primary path; every user prompt fires it. But the model can also reach for memory deliberately via four MCP tools exposed over stdio and registered in `.mcp.json`:

| Tool | What it does |
|---|---|
| `searchMemory(query, limit?, sessionId?, eventType?, since?)` | Trigram fuzzy search ranked by similarity and recency |
| `getMemoryContext(eventId, before?, after?)` | Scale forward/backward in time around an event |
| `unwindFromEvent(eventId, limit?)` | Replay every event in the session from start up to the anchor |
| `getSessionTimeline(sessionId, eventType?, limit?)` | Full chronological dump of one session |

The pattern: auto-injection surfaces a hit; the model decides it wants more; the model calls `getMemoryContext` to scale around it, or `unwindFromEvent` to replay how the session got there. This is `temporal-recall` ([`drift-detector/CLAUDE.md:68`](https://github.com/)) — the model isn't just pattern-matching, it's navigating its own history.

The MCP wiring itself is one stanza of [`drift-detector/.mcp.json`](https://github.com/):

```json
"memory-pkg": {
  "command": "node",
  "args": ["packages/memory-pkg/dist/mcp-server/index.js"],
  "env": {}
}
```

That's all Claude Code needs to discover the server, spawn it as a child process, and call its tools.

## Rationale synthesis — the original idea

The transcript captures *what happened*. It does not, by default, capture *why*. A `tool_call` event with summary `Edit packages/foo/bar.ts` will not match a future fuzzy search for *"why did we change the timeout?"* The event doesn't contain the word "timeout" or "why" anywhere. It just shows that an edit happened.

This is what rationale synthesis fixes. A separate post-ingest job walks through turns and synthesizes a 2-3 sentence "why" summary, inserting it as a `turn_rationale` event in the same searchable hypertable. ([`packages/memory-pkg/src/rationale/synthesize.ts`](https://github.com/))

### Before and after

**Without rationale**, the only persisted record of a timeout change looks like this:
```
event_type:   tool_call
summary:      Edit packages/memory-pkg/src/inject/classify.ts
search_text:  tool_call Edit packages/memory-pkg/src/inject/classify.ts
```
A future trigram search for *"why did we change the timeout"* matches **none** of those tokens.

**With rationale**, the same turn produces an additional event synthesized at ingest:
```
event_type:   turn_rationale
summary:      We bumped the classify.ts CLI timeout from 5s to 12s because
              the Haiku call's P95 was around 8s and the prior 5s timeout
              was silently failing the classifier tier on cold runs.
search_text:  turn_rationale We bumped the classify.ts CLI timeout from 5s
              to 12s because the Haiku call's P95 was around 8s and the
              prior 5s timeout was silently failing the classifier…
```
A future trigram search for *"why did we change the timeout"* now matches on `bumped`, `timeout`, `because`, `silently failing` — high overlap on the reasoning vocabulary, not just the edit vocabulary.

### Cost model

One Haiku call per turn, paid once at ingest time, amortized across every future retrieval. ([`synthesize.ts:156-205`](https://github.com/)) The call uses the local `claude` CLI without the `--bare` flag, which keeps Max-subscription OAuth as the auth path; no `ANTHROPIC_API_KEY` is consumed in the default setup. Synthesis is idempotent — turns that already have a rationale are skipped via the `transcript_uuid` of `rationale:<session>:<userPromptId>` — and the job runs on demand (`pnpm memory:rationale`) or on a cron, not on every Stop. So the cost ceiling is bounded by how often you choose to run it.

### Episodic compression at write time

The framing that makes this work: **episodic compression at write time**. The expensive part of recall — extracting narrative meaning from a turn's worth of prompts, replies, and tool calls — happens once, when the events are fresh and the model that wrote them is the right model to summarize them. After that, the rationale lives as a normal indexed row, searchable by the same SQL trigram tier that handles everything else. The first search costs the same as the millionth.

Run this for six months and the memory store accumulates a searchable archive of *decisions*, not just *actions*. Git already has the actions. The rationale layer is what makes the store worth more than `git log -p`.

## What this costs

**What you pay.** Storage is cheap — Postgres on Docker, hypertable chunking keeps old chunks compressible, `excerpt` capped at 600 chars and `search_text` at 2000 chars to keep indexed columns small. Embedding inference is zero in dollars — `bge-small-en-v1.5` is local CPU; the embed module documents ~30–80 ms per call after warmup with a ~1–2 s cold-load on the first call ([`embed.ts:6-7`](https://github.com/) — values stated in source, not independently measured). LLM retrieval cost in the live config is **zero**: trigram and entity tiers are pure SQL. If you enable the classifier or rerank tier, both use Haiku via the local `claude` CLI under Max OAuth, no API key consumed, and classifications cache on disk for 24 hours. Rationale synthesis is the same pattern — Haiku via Max, one call per turn at ingest, amortized forever after.

Latency budget (documented in `memory-inject.cjs:13-18` as a design target, not measured here):
- Fast path (trigram + entity, SQL only): ~600 ms – 1.5 s
- Warm classifier cache hit: ~1–2 s
- Cold classifier (Haiku call): ~6–10 s
- Rerank: +4–8 s (default-disabled)

The fast-path short-circuit at score ≥ 0.7 is intended to keep the typical prompt in the first bucket.

**What you save.** Without injection, the developer either re-explains context every session — expensive in human time and tokens — or the agent operates without it: poorer decisions, more clarifying questions, more tokens spent re-deriving prior reasoning. With injection, every turn gets up to 4 KB of pre-fetched targeted history for free; injection cost is fixed per turn, while the cost of *not* having it grows with project complexity. I don't have a calibrated token-saved benchmark, and it depends heavily on what work is being done. The structural argument: 4 KB of pre-targeted history retrieved by a ~600 ms SQL pipeline replaces ad-hoc re-explanation and re-derivation that costs both wall time and tokens. The ratio favors injection by a wide margin.

## Where the code lives

| Component | Path | Repo |
|---|---|---|
| Package root | `packages/memory-pkg/` | drift-detector |
| Schema | `packages/memory-pkg/src/schema.ts` | drift-detector |
| Capture hook | `.claude/hooks/memory-capture.cjs` | drift-detector |
| Injection hook | `.claude/hooks/memory-inject.cjs` | drift-detector |
| Hook config | `.claude/settings.json` (hooks block) | drift-detector |
| Ingester | `packages/memory-pkg/src/ingest/ingester.ts` | drift-detector |
| Injection orchestrator | `packages/memory-pkg/src/inject/generate.ts` | drift-detector |
| Tier registry | `packages/memory-pkg/src/inject/tiers/index.ts` | drift-detector |
| Trigram tier | `packages/memory-pkg/src/inject/tiers/trigram.ts` | drift-detector |
| Entity tier | `packages/memory-pkg/src/inject/tiers/entity.ts` | drift-detector |
| Embedding tier | `packages/memory-pkg/src/inject/tiers/embedding.ts` | drift-detector |
| Classifier tier | `packages/memory-pkg/src/inject/tiers/classifier.ts` | drift-detector |
| Merger | `packages/memory-pkg/src/inject/merger.ts` | drift-detector |
| Embedder | `packages/memory-pkg/src/embed.ts` | drift-detector |
| Rationale synthesis | `packages/memory-pkg/src/rationale/synthesize.ts` | drift-detector |
| MCP server | `packages/memory-pkg/src/mcp-server/index.ts` | drift-detector |
| MCP wiring | `.mcp.json` | drift-detector |
| README | `packages/memory-pkg/README.md` | drift-detector |

`memory-pkg` is original to drift-detector — no earlier version exists in the sylphie repo. The complementary `codebase-pkg` package in the same monorepo *was* ported from sylphie's `sylphie-pkg`, and is what the (currently dormant) KG retrieval tier consults at `bolt://localhost:7688`. Once `memory-pkg` is published as an NPM package, any other project — sylphie included — can pull it in as a workspace dependency.

## What this doesn't do (yet)

- **Cross-project memory federation.** Memory is per-project. Two repos with related work don't share a store.
- **Continuous aggregates and compression.** Timescale supports both; the README's roadmap notes them as future work. ([`packages/memory-pkg/README.md:166-168`](https://github.com/)) Today the table grows linearly.
- **Vector embedding backfill at scale.** The `backfillEmbeddings()` helper exists ([`embed.ts:69-108`](https://github.com/)) but is meant to be run deliberately; nothing automatically enforces that every event gets embedded.
- **Public NPM distribution.** That's the next milestone, and it's why this isn't an install tutorial.

## Why it matters

Git remembers what changed. `memory-pkg` remembers *why* — and surfaces it back automatically, on the next prompt, without anyone asking. The agent gets continuity; the developer stops being the agent's notebook.

That's worth more than the disk it takes up.
