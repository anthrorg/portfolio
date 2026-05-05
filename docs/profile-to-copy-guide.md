# How to Use the Profile to Write Site Copy

A working guide for turning `jim-personal-profile.md` into portfolio copy that flexes without overselling.

---

## The core principle

The profile is a **source document**, not a script. It contains two kinds of material:

- **Observations** — things Jim said, did, built, or worked on. Verifiable. Citable.
- **Characterizations** — adjectives, framings, and "what kind of person this makes him" interpretations.

**Write copy from the observations. Treat the characterizations as suspect.** If the site copy needs flex, the flex should come from a stronger observation, not from a stronger adjective.

---

## The editing rule

> Cut every adjective. If the sentence still flexes, keep it. If it collapses, the adjective was doing the load-bearing work — replace it with a stronger fact.

### Examples

❌ "He has rare architectural taste."
   → cut "rare" → "He has architectural taste" → collapses.
   → rewrite: *"Renamed and restructured his cognitive architecture project three times when the design demanded it."*

❌ "Exceptional senior frontend engineer with 8+ years of experience."
   → cut "exceptional" → "Senior frontend engineer with 8+ years of experience" → still works, "exceptional" was empty.
   → keep the trimmed version.

❌ "Visionary thinker pushing the boundaries of cognitive architecture."
   → all adjectives, no facts. Replace entirely.
   → rewrite: *"Building a cognitive architecture where LLMs are voice boxes, not decision-makers."*

✅ "Led AI tooling adoption company-wide at Mediavine."
   → no adjectives doing load-bearing work. Keep.

✅ "Built Mediavine Journey end-to-end with a small team."
   → "end-to-end" is doing real work (it's a fact about scope). Keep.

---

## What's safe to lean on

These are facts, not flattery. Use them freely:

- **8+ years senior frontend engineering**, TypeScript / React
- **Built Mediavine Journey** (onboarding, analytics engine, publisher dashboards) end-to-end with a small team
- **Primary developer** for Mediavine's analytics & data visualization dashboard platform
- **Led AI tooling adoption** company-wide at Mediavine
- **Built two MCP servers** (codebase-pkg with 6 tools; conversation-history sovereignty concept)
- **Independent research on Sylphie**, a cognitive architecture with no LLM in the runtime path
- **12-axis homeostatic drive engine**, originally targeting ESP32 hardware at 10Hz UDP
- **Type 1 / Type 2 dual-process reasoning** with multi-LLM focus-group deliberation
- **TimescaleDB + pgvector** for episodic memory, **Neo4j** for the World Knowledge Graph (WKG / KG-Self / KG-Other)
- **SensoryFrame intermediate-fusion** multimodal architecture (text + video + drives)
- **Self-imposed CANON-enforcing reviews** on his own pull requests, under a written constitutional document
- **Promoted to Team Lead in 9 months** at Legal Associations Management; built a Node.js membership system that drove $50K annual ad revenue and $22.5K savings
- **Fastbreak AI take-home** built in ~3.5 hours: Next.js 16, Supabase, Tailwind v4, shadcn/ui
- **Sylphie Labs LLC** formed; sylphie.live registered; AGPL-3.0 license plan
- **Sylphie's architectural convergence** with LeCun's JEPA roadmap, MIT Picower's predictive categorization work, and Anthropic's interpretability research on emotion vectors

These are the load-bearing facts. Build the copy around them.

---

## What's risky to lean on

These are characterizations from the profile that need to be either rewritten as observations or cut. They sound flattering but they don't survive scrutiny:

- ❌ "Rare ability to derive academic conclusions from first principles" → too self-mythologizing. Rewrite as the underlying fact: *"Designs systems by reasoning about the problem rather than borrowing from prior art."*
- ❌ "Architectural taste demonstrated repeatedly" → vague. Rewrite as: *"Restructured the project's core architecture three times when the design demanded it, including dropping language services in favor of an LLM replacement."*
- ❌ "Self-imposed discipline rare even at staff level" → cut the comparison. The thing itself is the flex: *"Reviews his own pull requests against a written architectural constitution."*
- ❌ "Most AI engineers cannot build a product surface that doesn't feel like a Gradio demo" → punchy but unverifiable and slightly arrogant. Replace with: *"Eight years of senior frontend engineering brought into AI work."*
- ❌ "Hard-won self-knowledge" → personal trait dressed up as professional credential. Doesn't belong on the site at all.
- ❌ "Miscalibrated about his own profile" → meta-commentary that sounds insightful but doesn't earn its place in copy.

---

## Voice and tone

The site should sound like Jim on a confident day, not like a PR firm describing him.

**Reference points:**

- The plain, direct technical writing of [Andrej Karpathy](https://karpathy.ai), [Simon Willison](https://simonwillison.net), or the writing on [Anthropic's blog](https://www.anthropic.com/news)
- Anthropic's and Sakana's own job postings — warmth without adjectives
- pszostak.pl for visual / structural inspiration

**Avoid:**

- "Visionary," "exceptional," "rare," "world-class," "passionate"
- Stacked adjectives ("a thoughtful, principled, deeply curious engineer")
- Vague claims of impact without numbers
- Anything that reads like a LinkedIn endorsement

**Lean into:**

- Specific systems, specific decisions, specific outcomes
- First person where it fits ("I built…" / "I'm working on…")
- A sentence rhythm that's confident but not breathless
- A few well-chosen technical terms used correctly — these signal fluency without bragging

---

## Section-by-section guidance

### Hero / above-the-fold

This is the first thing a hiring manager sees. It should answer one question fast: *what does this person do, and why should I keep reading?*

**Pull from:** the technical work + the AI pivot.

**Avoid:** opening with adjectives or a "passionate about" sentence.

**Draft pattern:**
> Senior frontend engineer pivoting into AI. Eight years of TypeScript and React, two years of independent research on cognitive architecture. Building [Sylphie] — an autonomous system where LLMs are voice boxes, not decision-makers.

That's three sentences. Each one carries a fact. No adjective is doing load-bearing work.

### About / longer-form bio

**Pull from:** Sections 2 (How He Thinks), 7 (What He Brings), and the work history appendix.

**Trim aggressively.** The profile has a lot of warm framing that works in a private document but reads as oversell on a public site. Cut anything that sounds like it was written *about* you rather than *by* you.

**Draft pattern:**
> I'm a senior frontend engineer based in Charlotte, NC. I spent four years at Mediavine building their Journey product and leading AI tooling adoption across the company. I'm currently building Sylphie, a cognitive architecture I started as independent research and am now opening up.
>
> The thing that interests me most is the gap between LLMs and cognition. Most agent systems put a language model in the decision loop. Sylphie doesn't — the LLM is a voice box, the cognition lives in a graph database, a drive engine, and a dual-process reasoning system. It's a long bet, and I've been working on it for two years.

That reads like Jim on a confident day. No "rare," no "visionary," no "exceptional." The flex is in what's described.

### Sylphie / project page

This is where the technical detail lives. Use the appendix freely. Reader-facing sections to consider:

1. **The thesis in one paragraph** — what's different about it
2. **The architecture in one diagram** — the CANON image
3. **The drive engine** — what it is, why it matters
4. **The dual-process design** — Type 1 / Type 2
5. **What's working, what isn't** — Jim's own honest critique (N+1 queries, fragile clustering, no graph pruning yet) reads as credible engineering self-awareness, not as weakness

**Important:** the honest critique section is one of the strongest moves on the site. Most portfolios pretend everything is finished. Yours doesn't, and that's a signal of senior judgment.

### codebase-pkg / MCP work

**Pull from:** Appendix C and the Sylphie-pkg facts. List the six tools by name. Describe the three layers (code structure, runtime observations, change history) plainly.

This section signals 2026 vocabulary fluency and should be short and dense.

### Writing / blog

**Three flagship posts to plan around:**

1. *"Building Sylphie: A cognitive architecture without an LLM in the runtime path"* — your strongest topic
2. *"From layoff to Tokyo: planning a 10-year career pivot"* — personal, will get shared
3. Either *"Reading the JEPA papers as a frontend engineer"* OR *"What I learned leading AI tooling adoption at a media company"* — pick based on what audience you most want to reach

### Contact / footer

Keep it minimal. Email, GitHub, LinkedIn. No "let's connect!" — that's recruiter-speak.

---

## What to leave OUT of the public site

Things in the profile that belong in the source document but **not** on the site:

- The co-parenting situation, divorce, custody arrangement
- Therapy / Marcus Robinson
- The early-life experience flagged in §5.5
- The "kids would probably hate me" line
- Financial squeeze, child support modification, severance details
- The Japan-as-partly-escape framing (the Japan dream itself can show up if you want it to)
- Specific compensation targets ($180k–$260k base, $350k–$550k+ TC)
- Discord interactions and the names of community members
- The "miscalibrated about his own profile" framing

Hiring managers don't need any of this. Some of it is genuinely yours and not for the public; some of it is just irrelevant to the question "should I interview this person."

---

## Workflow for feeding this to Claude Code

When you prompt it, lead with the constraint, not the goal. Something like:

> I'm writing portfolio copy. Here's a profile of me. Use the **observations** (facts, projects, decisions, work history) to write the copy. Treat the **characterizations** (adjectives, "what kind of person this makes him" framings) as suspect — only use them if you can replace them with a specific observation that supports the same point.
>
> Voice: plain, direct, confident without adjective stacking. Reference points: Karpathy, Simon Willison, Anthropic's job postings.
>
> Editing rule: cut every adjective. If the sentence still flexes, keep it. If it collapses, replace the adjective with a stronger fact.
>
> Don't put on the site: anything personal (family, therapy, finances, kids), specific compensation targets, Discord names, or meta-framing about my own profile.

Then iterate. The first pass will overdo it. The second pass will be closer. The third pass is usually the one.

---

## Order of operations

The order you write the sections in matters more than it should. Whichever section you draft first sets the energy level, and every section after it calibrates to that baseline.

**Write the hero first, and get it clean before moving on.**

If the hero ends up adjective-heavy or oversold on pass one, the about page will inherit that tone, the project pages will inherit it from the about page, and by the time you get to the technical sections you'll be reading copy that sounds like a press release. Going back to fix it is harder than getting it right at the top — partly because you'll have already gotten used to the inflated voice and stopped hearing it.

The order I'd suggest:

1. **Hero / above-the-fold.** Three sentences. No adjectives doing load-bearing work. This is the tuning fork for everything else.
2. **About / longer-form bio.** Calibrate to the hero's voice.
3. **Sylphie / project page.** Now you can lean on the technical detail because the voice is already established.
4. **codebase-pkg, smaller projects, writing.** Short and dense, easy once the voice is set.
5. **Contact / footer.** Trivial once everything else is right.

Don't draft them in parallel. Don't let Claude Code generate the whole site in one shot. Lock the hero, then move down.

---

## A short calibration test

Before publishing any section, read it back and ask:

1. Would this sentence survive if a senior engineer at Anthropic read it?
2. If I cut every adjective, is anything left?
3. Does this sound like me on a confident day, or like someone selling me?
4. Is there a number, a system, or a specific decision I could substitute for an adjective?

If the answers are yes / yes / me / yes-and-it'd-be-stronger — ship it.

If not — one more pass.
