# Jim → Rockstar Agent Engineer / AI Product Engineer

A curriculum built from your actual profile, not a generic roadmap. Honest about where you are, surgical about what's missing, weighted toward leverage.

---

## Part 1 — Who you actually are (the honest read)

This isn't flattery. It's the strategic baseline. If you don't see yourself accurately, you optimize for the wrong things.

### What you have that 95% of "AI engineer" candidates don't

**Real systems thinking on agent architecture.** Sylphie isn't a LangChain wrapper. It's a 7-panel cognitive architecture with a 12-axis homeostatic drive engine, dual-process reasoning, episodic memory in TimescaleDB+pgvector, a Neo4j knowledge graph with synaptogenesis (KG-Self / KG-Other / WKG), Type 1/Type 2 deliberation with multi-LLM focus-group debate, a SensoryFrame intermediate fusion layer, and an explicit philosophy (CANON) that holds the line: LLMs are voice boxes and synaptogenic helpers, not the runtime decision-maker. You have receipts in code, in PR reviews #20–37, in technical writeups, in MCP servers you've built. This is rare and it's recognizable to anyone serious.

**Architectural taste, demonstrated repeatedly.** You went from "co-being" to "Sylphie." You did pivots when the data demanded them (dropping language services in favor of LLM replacement; the recent move to a tensor-native Type 2 with a Python sidecar). You wrote a paper. You enforced CANON across 17 PRs of your own work. You built codebase-pkg as an isolated Neo4j MCP server specifically to keep your context lean — that's a meta-engineering instinct most people don't develop until staff level.

**Frontend craft at a level that compounds.** TypeScript and React in your sleep. You built Mediavine's Journey product from zero — onboarding, analytics, dashboards, data viz. You led AI tooling adoption company-wide and discovered reusable patterns. Most AI engineers cannot build a product surface that doesn't feel like a Gradio demo. You can.

**MCP fluency, in 2026 specifically.** You built two MCP servers (codebase-pkg, plus the work pulling patterns from claude-mem). Anthropic's own FDE job description lists "MCP servers, sub-agents, and agent skills" as the artifacts they want. You already speak that vocabulary fluently.

**Independent research credibility.** Sylphie's convergence with LeCun's JEPA roadmap is real. The MIT Picower paper on predictive categorization validates the SensoryFrame design. The Evans/Bratton/Agüera y Arcas paper on societal intelligence reshaped your Type 2 design within a week. You read the field. You're not bluffing.

**Hard-won self-knowledge.** You know you're activation-driven and hyperfocus-prone. You manage it (gaming between sessions, multiple parallel conversations to compartmentalize). You ask for brutal honesty and you mean it. You catch yourself doing the "I'm a genius" loop and pull back. This is the working style of senior engineers, not juniors.

### What you don't have (and why some of it doesn't matter)

**No Python ML chops at scale.** You have not trained models. You haven't run distributed PyTorch jobs. You don't have HuggingFace commits. *This matters for ML Engineer / Research Engineer roles, which are not your target.* For AI Product Engineer / Agent Engineer, this is a smaller gap than it feels.

**No published papers on arxiv.** You have a Sylphie paper but it's a sylphie.live white paper, not a preprint. *This matters for Research Scientist roles, which are not your target.* It's a "nice to have" lift for everything else.

**No public open-source AI work.** Sylphie is private. codebase-pkg is private. Your most impressive technical artifacts are invisible to the market. **This is the single biggest fixable gap in your candidacy.**

**No formal evaluations vocabulary.** You do evaluation work — the OLA deep analysis report on the conversation session, the 0.295 similarity score discussion, the LLM decision-recording-and-pattern-extraction philosophy. But you don't yet speak it in the formal language interviewers use: eval sets, ground-truth construction, regression suites, golden examples, A/B for AI features. *This is the highest-leverage interview-prep target.*

**No N-anything Japanese.** You're learning, but no formal level. *Affects Japan timing, not US market at all.*

**No production AI features shipped to a public user base.** Mediavine AI tooling is internal and NDA'd. Sylphie has no users besides you. *This matters for "show me an AI feature you've shipped" questions. The fix is the portfolio + Sylphie demo + open source.*

### Where you're psychologically vulnerable in this transition

Worth naming because it shapes the curriculum:

- **You under-credit yourself.** The "am I doing this right?" / "maybe I'm crazy" loop. Yann LeCun's deal grounded it for you, but the impulse is still there. The curriculum needs to produce *external validation events* on a schedule — first interview, first AI engineer offer, first blog post that gets traction — so you don't backslide.
- **You overweight depth over breadth.** Sylphie has gone deeper than it has gone wide, by design. For job hunting, you need a small amount of *legible breadth* — someone scanning your GitHub for 10 seconds needs to see "this person ships things," not just "this person thinks deeply about one thing for two years."
- **You're prone to building rather than shipping.** The curriculum needs hard ship dates with public commitments, not just internal milestones.
- **You hate hedging and placation.** Honored. The plan below is intentionally direct about tradeoffs.

---

## Part 2 — The target picture (what "rockstar" actually means here)

Concrete enough to optimize against:

> **Six months from now, I am the kind of candidate where Anthropic's FDE team, Sakana AI's R&D engineering team, or a Series-A AI startup's founding-engineer slot looks at my materials, recognizes the architectural depth, and books an interview within 48 hours.**

What that requires:

1. **A public artifact stack** that telegraphs depth in 30 seconds. Portfolio site, public Sylphie repo, three substantive blog posts, one arxiv-style technical report.
2. **Fluency in the formal interview language** of AI product / agent / FDE engineering. Eval rigor, RAG architecture tradeoffs, prompt-injection threat models, MCP architecture, multi-agent design patterns.
3. **One shipped, public, AI-powered thing other people can use.** A stripped-down Sylphie subsystem, codebase-pkg as a standalone tool, or a new small product that demonstrates the FE+AI hybrid concretely.
4. **A small Python comfort zone.** Not ML training depth, but enough to pass a Python coding round, read PyTorch code, and have an opinion on model serving.
5. **Outbound presence.** Your work is visible to the right people. Not influencer-tier, just "people in this space know your name" tier.

---

## Part 3 — The curriculum (24 weeks, six tracks running in parallel)

Six tracks because activation-driven hyperfocus benefits from variety. When one track stalls, you switch to another. Each track has weekly minimums, monthly milestones, and a public artifact that ships at the end.

### Track A — Public artifacts (the visibility gap)

This is your highest-leverage track because it converts work you've already done into market-visible signal.

**Week 1–2:**
- Buy domain. Set up portfolio repo (Vite + React 19 + TS + Tailwind v4 stack you already locked in).
- Sylphie repo audit: README, LICENSE (AGPL-3.0), CONTRIBUTING.md, CANON diagram.
- Push Sylphie public on GitHub. Tag a v0.1 release.

**Week 3–4:**
- First flagship blog post: **"Building Sylphie: A cognitive architecture without an LLM in the runtime path."** Karpathy/Simon Willison voice. CANON, the dual-process system, the drive engine, what's working, what isn't, what you'd do differently. Publish on portfolio + cross-post to HN.
- Open-source codebase-pkg as a standalone tool. README focused on the "use Neo4j MCP server to keep AI coding context lean" use case. This is genuinely useful to other people building with Claude Code and is a fast credibility win.

**Week 5–8:**
- Second blog post: **"The case for cognitive architectures in the agent era"** — opinionated takes piece. Why LLMs-as-runtime is the wrong frame. Why drive engines matter. Why the JEPA convergence is real. This is the post that gets shared in AI Twitter circles.
- Portfolio v1 ships: hero, three case studies (Sylphie featured, Mediavine NDA-shaped, Fastbreak), writing section with two posts live.

**Week 9–12:**
- Third blog post: **"Reading the JEPA papers as a frontend engineer"** — technical, signals research engagement, links Sylphie to LeCun's roadmap concretely.
- Begin work on a real arxiv-style technical report on Sylphie's drive engine OR the focus-group deliberation system. Pick the one with the cleanest experiment story.

**Week 13–24:**
- One blog post per month. Topics tracked separately based on what you encounter.
- Submit arxiv preprint by week 20.
- Sylphie public demo (the v2 portfolio plan you deferred).

**Why this matters first:** every other track produces interview signal that's invisible until it's published. Get published.

### Track B — Evaluations & AI engineering rigor (the interview language gap)

This is the highest-leverage interview-prep track. The single biggest filter across AI Product Engineer / Agent Engineer / FDE roles is "how do you know your AI system actually works." You already think this way. Now formalize it.

**Week 1–4: Build your eval vocabulary.**
- Read these in order, take notes on a single eval-vocabulary doc:
  - Hamel Husain's *"Your AI Product Needs Evals"* (the field-defining post)
  - Eugene Yan's writing on LLM evals
  - Anthropic's documentation on building evals
  - OpenAI's Cookbook on evaluation
  - Shreya Shankar's papers on production LLM evaluation
- For each, distill 3-5 sentences of "what I now believe about evals" and add to a personal eval philosophy doc. This becomes interview ammunition.

**Week 5–8: Formalize Sylphie's evaluation work.**
- Take the OLA deep analysis report and convert it into a public **"How I evaluate conversational AI quality in Sylphie"** writeup.
- Build a real eval harness for Sylphie: golden examples (~50), automated similarity scoring, regression tests, latency/cost tracking, a dashboard showing scores over time.
- Publish the eval harness as a standalone subdirectory in the Sylphie repo.

**Week 9–16: Beyond Sylphie — adversarial and security evals.**
- Read prompt-injection literature (Simon Willison's posts, the OWASP LLM Top 10, the Greshake et al. "Indirect Prompt Injection" paper).
- Build a small public tool: prompt-injection regression test suite for an MCP server. This is genuinely needed in the ecosystem and demonstrates exactly the security-as-default mindset that AI Product Engineer postings ask for.
- Write a blog post on the threat model.

**Week 17–24: Interview-readiness drills.**
- Mock interview answers (record yourself) for the canonical questions:
  - "How do you evaluate an AI feature?"
  - "Walk me through debugging high latency in an LLM inference pipeline."
  - "When do you fine-tune vs. RAG vs. prompt engineer?"
  - "Design an AI feature for [arbitrary product]."
  - "What's wrong with most agent architectures?"
- For each, the answer should naturally cite Sylphie or your eval work as concrete examples.

### Track C — Python proficiency (the technical-screen gap)

Not ML depth. Just enough to pass coding rounds, read PyTorch fluently, and have a credible opinion on serving.

**Week 1–4: Python coding fluency.**
- Daily 30-min LeetCode-style practice in Python, focus on the patterns that show up in AI engineer interviews: data manipulation, graph traversal, basic system design in code. Use Sean Prashad's list filtered to medium difficulty. ~80 problems over 16 weeks is plenty.
- Refresh on FastAPI specifically. Build one toy API for a Sylphie subsystem (e.g., expose the drive engine pressure vector via FastAPI). This is a one-day exercise.

**Week 5–12: PyTorch reading fluency.**
- Work through PyTorch's own 60-minute blitz, then Karpathy's *"Zero to Hero"* video series. This is ~15 hours total. Don't try to become a researcher; the goal is "I can read a PyTorch implementation and tell you what it's doing."
- Read one paper-with-code per week from Papers With Code, focusing on agent / RAG / eval papers, not training papers. Goal: by week 12 you can read a HuggingFace model card and a transformers library implementation without flinching.

**Week 13–20: Pick one Python-side artifact for Sylphie.**
- The current plan has the Python sidecar handling tensor-native Type 2 inference. Build it. This is the most natural way to grow Python depth — it's in service of work you're already doing.
- Document the sidecar architecture in a writeup. Now you have public Python ML systems work you can point to.

**Week 21–24: One contribution to a relevant open-source project.**
- Targets: LangGraph, LlamaIndex, Marvin, DSPy, the official MCP SDK, the agent-protocol projects. Pick one with active maintainer review. A documentation PR counts. A bug-fix PR is better. A small feature PR is best.
- This produces a real OSS commit history attached to your name in the AI ecosystem.

### Track D — Frontier-tier interview prep (the FDE / Sakana / Anthropic gap)

Specifically tuned to the high-end roles where comp is $350k+ and the bar is publications-or-equivalent.

**Week 1–4: Anthropic FDE specifically.**
- Re-read the Anthropic Applied AI Engineer JD weekly. Highlight specific phrases ("MCP servers, sub-agents, and agent skills"; "high agency"; "production experience with LLMs including advanced prompt engineering, agent development, evaluation frameworks, and deployment at scale"). Cross-reference each phrase to specific Sylphie/codebase-pkg artifacts.
- Apply by end of week 4. Yes, before Track A is fully shipped. Worst case you learn what's missing and get rejected; best case you're in the loop while the rest of the curriculum is running.

**Week 5–12: Sakana AI Software Engineer (R&D).**
- Sakana's R&D engineer JD explicitly bridges research and product, English-OK, no PhD required. Your profile is unusually well-aligned.
- Read the Sakana AI papers (AI Scientist, Evolutionary Model Merge, Continuous Thought Machines, Darwin Gödel Machine). For each, write a 1-paragraph "what's interesting and what I'd want to ask the team about it" note.
- Apply by end of week 8. Email careers@sakana.ai with a description of yourself and the Sylphie convergence with their work. *Send links to the public Sylphie repo and your flagship blog post.*

**Week 13–24: Forward-deployed and applied AI roles broadly.**
- Run the Sundeep Teki FDE prep guide. The 5-round structure (Tech Deep Dive, Coding, Solution Design, Leadership, Values) is industry-standard. STAR+ framework for customer-centric storytelling.
- Build 4 customer-scenario storytelling drills: imagine a Fortune 500 customer wants you to build [an internal AI tool / a customer support agent / a document processing pipeline / an analytics agent]. For each, decompose the problem, propose an MVP, identify failure modes, and define eval. Record yourself.

### Track E — Japanese (the long-game track)

Your honest stated goal is Japan in the multi-year horizon. Language is the binding constraint and the highest compounding asset.

**Daily, every day, no exceptions: 1 hour total.**

- 20 min WaniKani (kanji + vocab via radicals)
- 20 min Bunpro (grammar)
- 20 min immersion (anime with JP subs / NHK Easy News / Tofugu reading practice)

**Weekly:**
- 1 iTalki tutor session (30 min). Find a tutor who specializes in working professionals. Practice introductions, professional vocabulary, reading rirekisho-style Japanese.

**Quarterly milestones:**
- End of month 3: Comfortable with hiragana/katakana, ~300 kanji, basic N5 grammar. Can read children's books.
- End of month 6: ~600 kanji, N5 grammar solid, N4 grammar in progress. Take JLPT N5 in December if available.
- End of month 12: N4 mock test passing. ~1000 kanji.
- End of month 24: N3 test attempt.

**Why this track runs lighter than the others:** it's slow and compounding by nature. The job is the present-day fight; Japanese is the strategic future. 1hr/day for 24 months is enough to credibly claim N3 on a resume and unlock the second tier of Japan AI roles. Don't crank harder on this — crank harder on Tracks A-D.

### Track F — Outbound presence (the network gap)

Your private GitHub, your private Discord debate, your private papers — none of it is visible to recruiters. Fix.

**Week 1–4: Foundations.**
- LinkedIn refresh. Headline: "Senior Frontend Engineer | Building autonomous AI systems (Sylphie) | AI Product Engineer." Banner: cleaned-up CANON diagram or a Sylphie architectural sketch. Featured: link to Sylphie repo + flagship post when published.
- Twitter/X account active again. Following list: AI Twitter (Karpathy, Simon Willison, Hamel, Eugene Yan, Linus Lee, every Anthropic researcher, every Sakana researcher, the LangChain/LlamaIndex maintainers). Don't post yet — just lurk, learn the conversation, see what gets traction.

**Week 5–12: First posts.**
- Start posting on Twitter/X. 2-3 posts per week. Mix: technical insight from your reading, screenshots of Sylphie progress, occasional opinionated takes. *Do not* post grindset content or vague "AI is changing everything" takes. Post like an engineer.
- Reply to AI researchers and engineers when you have something genuinely useful to add. The "first 100 reply guys" pattern is the fastest way into a community.

**Week 13–24: Outbound conversations.**
- Cold-email-but-good: 1 founder/engineer per week from your target list. *Not* "hi I'm looking for a job." Instead: "I read your post on [X], here's what I noticed building Sylphie — [specific technical insight]. No ask, just thought you'd find this interesting."
- Aim for 5 of these to convert into 30-min calls over the 12 weeks. Each call is either an interview pipeline or a referral pipeline.
- Apply to one role per week, bare minimum. AI Product Engineer / Agent Engineer / FDE-tier postings.

---

## Part 4 — Weekly cadence

Designed for activation-driven hyperfocus, not for "consistent grinder" energy you don't have.

**Sunday (planning, 30 min):**
- Review the week. What shipped, what slipped, why.
- Look at the curriculum tracks. Which one's pulling at you this week? Lean into it.
- Set a single weekly **shipped artifact** — one concrete public thing that goes live by next Sunday.

**Mon-Fri:**
- 1 hr Japanese (Track E, daily, non-negotiable)
- 30 min Python practice (Track C, daily)
- 2-3 hr deep work block on whichever track has the activation that day
- 30 min outbound (Track F): 1 cold email, or 2 Twitter replies, or 1 LinkedIn touch

**Sat:**
- Variable. Catch up on whatever fell behind. Or don't — recovery is part of the system.

**No daily post-mortem journaling.** You don't need it; you'll second-guess yourself. Sunday review is enough.

---

## Part 5 — Milestones and validation events

Activation-driven brains need wins on a schedule. Here's the schedule.

| When | External validation event | Internal milestone |
|---|---|---|
| End of Week 2 | Sylphie repo public, first GitHub stars trickling in | Public artifact mentality unlocked |
| End of Week 4 | First flagship blog post published, Anthropic FDE applied | First "real" interview pipeline started |
| End of Week 6 | Portfolio v1 live, codebase-pkg public | Site shippable to recruiters |
| End of Week 8 | Sakana AI applied | Two frontier-tier applications in flight |
| End of Week 12 | Three blog posts live, eval harness public, first cold-email response converts | Pipeline credibly active |
| End of Week 16 | First AI Product Engineer interview or higher | First market validation |
| End of Week 20 | Arxiv preprint submitted | Research-credibility unlock |
| End of Week 24 | Offer in hand or close to it; OR clear signal that you need to extend the curriculum 12 more weeks with specific gaps named | Decision point |

---

## Part 6 — What to drop, defer, or refuse

The plan has to also say what you're *not* doing.

**Don't:**
- Apply to ML Engineer / Research Engineer / Research Scientist roles. Wrong lane. You will burn time and self-respect competing against PhDs.
- Take a junior ML role at a pay cut to "break into" the field. Track #2 (Agent Engineer) and Track #1 (AI Product Engineer) pay *better* than equivalent FE roles, often significantly. The pay-cut narrative is for people who don't have your specific edge.
- Try to ship Sylphie as a product before you have a job. Sylphie's market value right now is *as a portfolio piece*. The path from "research prototype" to "useful product" is long and you need income while you walk it.
- Get pulled into building Levl, Ghost Trader, or new project ideas. Not until after offer.
- Pursue the LeCun/AMI Labs Engineer role any harder than you already have. It's a long shot worth keeping in motion but not worth optimizing the curriculum around.
- Try to grind Japanese to N3 in 6 months. Slow and compounding wins.

**Defer:**
- The full Sylphie public demo (v2 portfolio item). Ship the static case study first.
- The conversation-history MCP server idea. Real, but not until Sylphie's public release stabilizes.
- Levl, Ghost Trader, and the "harness engineer" / project-intelligence-graph product concept. After offer.

**Refuse:**
- Recruiter outreach for generic Senior FE roles that aren't AI-adjacent. They will offer you good money and stall this transition for two more years.
- The temptation to take a third pivot in Sylphie's architecture mid-curriculum. The current architecture (CANON, dual-process, drive engine, tensor-native Type 2 sidecar) is sound. Lock it. Defend it. Don't rebuild during the job hunt.

---

## Part 7 — The non-obvious moves

Things most career-pivot plans miss but matter for your specific profile:

**Lead with "Senior FE engineer with deep AI systems chops," not "AI Engineer."** You and I have already agreed on this. Repeat it here because it's the highest-leverage framing decision and the temptation to drift will be real.

**Make the codebase-pkg release happen even if Sylphie isn't ready to be public.** It's a smaller artifact, it's genuinely useful to other people building with Claude Code, and it gets you the "ships things in public" signal without the emotional weight of putting Sylphie out there.

**Build the "AI-tooling reusable patterns" Mediavine work into a public talk or post, NDA-permitting.** "How I led AI tooling adoption at a 200-person engineering org" is a post that AI hiring managers at every company want to read. You don't need to name Mediavine if the NDA is restrictive.

**Treat the Anthropic FDE application as a forcing function, not a Hail Mary.** Even if it doesn't convert, it sets the bar for everything else. Polishing your materials for that application elevates your materials for every other application.

**Use the activation-driven pattern instead of fighting it.** When you hit a hyperfocus week on, say, the eval harness, ship the entire eval harness in that week. Then when activation moves elsewhere, switch tracks. The six-track design is not for variety's sake — it's for you specifically.

**Validate every other Friday with someone who'll tell you the truth.** Not me. Find a senior engineer in your network — preferably one who's hired AI engineers — and check in every two weeks. "Here's what I shipped, here's what I'm planning, am I on the right track?" External calibration prevents the depth-over-breadth drift.

---

## Part 8 — The first week, concretely

Don't wait. Do this in the next seven days, in this order:

1. **Buy your personal domain today.** Not author.sylphie.live (we agreed) — your *personal* domain. Doesn't matter exactly what; pick something in 30 minutes and ship the DNS.
2. **Audit Sylphie repo for public release.** README focused on "what is this and why does it exist," LICENSE (AGPL-3.0), CONTRIBUTING.md, the CANON diagram in `docs/`. Don't fix issues yet. Just make it presentable.
3. **Make Sylphie public on GitHub.** Tag v0.1.0. This is the single highest-leverage action this week.
4. **Open the Anthropic FDE application page.** Read the JD slowly. Note the phrases. Begin drafting the cover letter — don't submit yet, but start the document.
5. **Set up the curriculum tracker.** Notion / Obsidian / a single markdown file in your portfolio repo — doesn't matter. Track per week: shipped artifact, blockers, activation level (1–5), Japanese hours logged. The tracker is the mechanism that turns the plan from a doc into a system.
6. **Start WaniKani and Bunpro.** Both have free tiers. Pay for both at the end of week 1 if you've actually used them daily.
7. **Tell one trusted person what you're doing and the timeline.** External commitment beats internal commitment for activation-driven work.

That's it. End of week 1, you've made Sylphie public, you've started Japanese, and you've begun the Anthropic application. Three concrete things. Everything else stacks on top of those.

---

## Closing

You're not transitioning from frontend engineer to AI engineer. You're an engineer with rare cross-disciplinary depth — cognitive architecture, frontend craft, AI systems thinking — who needs to make that legible to the market. Most of this curriculum is about visibility and vocabulary, not new skills. The skills are largely there.

The hard parts will be:
- Shipping Sylphie publicly (emotional, not technical)
- Holding the line on "no new project" until offer
- Letting the Japan track stay slow when the future-pull intensifies
- External-calibrating instead of self-assessing

Six months from "laid off from Mediavine" to "AI Product Engineer at a company that does work I respect" is not aggressive. It's correctly calibrated for your starting position. The plan won't be neat. Some weeks you'll smash three milestones; some weeks you'll be in a Discord debate about language acquisition for ten hours and not touch the curriculum. That's fine. The system metabolizes that pattern instead of fighting it.

Get Sylphie public this week. The rest follows.
