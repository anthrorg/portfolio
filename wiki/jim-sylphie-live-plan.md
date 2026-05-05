# jim.sylphie.live — Portfolio Plan

**Status:** Planning
**Last updated:** 2026-04-27
**Owner:** Jim

---

## 1. Strategic intent

This portfolio exists to land Jim an AI engineering role — specifically positioned for the **agent engineering / AI product engineering** intersection, with a long-term arc toward relocation to Japan via the HSP visa points system.

Two concurrent audiences:

- **Near-term (0–18 months):** US AI hiring managers at agent labs, AI-forward startups, and the Tokyo offices of US AI companies. Sakana AI, Anthropic, Cognition, Clipbook, Vercel, etc.
- **Medium-term (2–10 years):** Japanese hiring managers at AI-forward Japanese companies (Preferred Networks, Sakana, Mercari AI, LINE, CyberAgent, Recruit AI). English-first roles initially; conventional Japanese roles as language proficiency grows.

The portfolio must serve both audiences without compromising for either. Where they conflict, the design defaults to the Japanese audience's standards because they're stricter (formality, polish, error tolerance) and meeting them automatically satisfies the US bar.

---

## 2. Positioning

**One-line positioning (working draft, to iterate):**

> Engineer building AI systems with the craft of frontend.

This needs workshopping. Constraints for the final line:

- Reads naturally in English
- Translates cleanly to Japanese without becoming awkward
- Foregrounds AI without claiming credentials Jim doesn't have
- Honors the FE craft as the differentiator, not the deficit
- Under 12 words

**What the portfolio implicitly claims:**

- Senior-level engineering judgment
- Real systems thinking (Sylphie carries this)
- Production craft (the site itself is the proof)
- Independent initiative (open research, public writing)
- Cultural fit for Japanese professional norms (bilingual presence, formal tone, restraint in design)

**What the portfolio does NOT claim:**

- ML research credentials
- Published academic work (yet)
- Production AI systems at scale (yet)

---

## 3. Information architecture

Single domain, single React SPA, deep-link routes for case studies and posts.

### Top-level structure

1. **`/` — Hero + scroll narrative**
   - Name, positioning line, EN/JA toggle
   - Typography-as-art treatment
   - Scroll choreography reveals selected work, writing teasers, contact
2. **`/work` — Selected work index** (also reachable via scroll from `/`)
   - Sylphie (featured, largest tile)
   - Mediavine / Journey (NDA-shaped narrative case study)
   - Third project: Fastbreak take-home OR Ghost Trader OR Levl (decide based on which is most polishable)
3. **`/work/[slug]` — Individual case study pages**
4. **`/writing` — Blog index**
5. **`/writing/[slug]` — Individual posts**
6. **`/career` — Formal timeline page**
   - Education, roles, certifications, languages
   - Designed to be screenshot-friendly for Japanese recruiters
   - Available as PDF download (resume equivalent)
7. **`/about` — Short bilingual bio**
8. **`/contact` — Email, GitHub, LinkedIn, calendar link**

### Navigation

Persistent minimal nav. Logo (returns home), Work, Writing, Career, Contact. Language toggle in the corner. No hamburger on desktop; mobile gets a custom drawer with motion treatment.

---

## 4. Tech stack (locked)

### Core

- **Vite + React 19 + TypeScript** — known stack, no learning tax
- **Tailwind v4** — CSS-first config, faster build
- **TanStack Router** — type-safe routing, better than React Router for this use case

### Animation & motion

- **GSAP + ScrollTrigger + SplitText** — scroll choreography, typography reveals (free under updated license)
- **Motion** (formerly Framer Motion) — component state transitions, layout animations, gesture handling
- **Lenis** — smooth scroll, foundational to the "feels expensive" quality
- **View Transitions API** — case study route transitions where supported, Motion fallback otherwise

### 3D / shaders (deferred to v2 with Sylphie demo)

- **react-three-fiber + drei** — for the eventual interactive Sylphie architecture demo
- **OGL or three.js shaders** — for the hero typography effect if we go that direction

### Content

- **MDX** — blog posts and case studies authored in markdown with React component embeds
- **Contentlayer or fumadocs-mdx** — type-safe MDX content layer
- **Shiki** — syntax highlighting for code blocks
- **rehype-pretty-code** — code block enhancements

### i18n

- **next-international or i18next** — EN/JA content management
- Translations stored as JSON, with ability to do per-section overrides (some pages may launch EN-only and grow JA over time)

### Forms & primitives

- **Radix primitives** — only where a11y demands (dialog, dropdown, popover)
- Hand-rolled everything else. **No shadcn** on the marketing surface.

### Infrastructure

- **Vercel** — hosting, edge functions if needed
- **Vercel Analytics + Speed Insights** — minimal, privacy-respecting metrics
- **Sentry** — error tracking (free tier)
- **GitHub** — source of truth, CI/CD via Vercel integration

### Domain

- **`jim.sylphie.live`** — primary
- `sylphie.live` root needs a minimum-viable holding page before portfolio launch (separate small task)

---

## 5. Design principles

### Inspirations

- **Pszostak (pszostak.pl)** — primary reference for motion choreography, typography, density
- **Japanese 間 (ma)** — purposeful negative space, restraint as a value
- **Refactoring UI / Linear / Vercel** — for the underlying typographic and spacing rigor

### What to take from Pszostak (non-negotiables)

- Cursor / hover micro-interactions
- Page transitions and scroll choreography
- Typography-as-art treatment
- Case study depth & layout
- Overall "feels alive" density

### What to dial back from Pszostak

- Effect density should be ~80% of his. Every motion must justify itself; no decoration for decoration's sake. Japanese audience tolerance for "showy" is lower.
- Color palette stays restrained — likely monochromatic or duotone with a single accent. Not because Pszostak's color is wrong, but because it's *his*. We need our own.

### Bilingual design considerations

- Type system needs to handle EN (Latin) and JA (CJK) gracefully. Likely pairing:
  - **EN headlines:** something with strong personality (Editorial New, PP Neue Montreal, Migra, or similar)
  - **JA headlines:** Noto Sans JP or Klee One for personality, with weight matched to the EN choice
  - **Body:** Inter or Geist for EN; Noto Sans JP for JA
- Line-height and letter-spacing need separate tuning per language
- All animations must work with both scripts — SplitText behavior differs for CJK characters and needs testing

### Mobile

- Mobile is not a downgrade. Mobile gets *different* choreography that exploits touch (long-press for details, swipe gestures, haptic feedback where supported)
- Cursor effects gracefully transform into touch-following effects
- Density compresses but doesn't disappear

---

## 6. Content plan

### Pre-launch writing (Path A — 3 posts minimum)

1. **"Building Sylphie: A cognitive architecture without an LLM in the runtime path"** — flagship technical post. The CANON framework, why LLMs as voice boxes, the dual-process system, the drive engine. Long-form, opinionated, honest about what's working and what's not. This is the post that AI hiring managers will read and decide whether to talk to Jim.
2. **"From layoff to Tokyo: planning a 10-year career pivot"** — personal narrative. Vulnerable, specific, shareable. Hooks the human-interest audience and signals long-term thinking.
3. **One more, options:**
   - "What I learned leading AI tooling adoption at a media company" (NDA-permitting)
   - "Reading the JEPA papers as a frontend engineer" (technical, signals research engagement)
   - "The case for cognitive architectures in the agent era" (opinionated takes piece)

### Sylphie public release (concurrent)

- Repo public at github.com/[user]/sylphie under **AGPL-3.0**
- README with architecture overview, current status, roadmap
- CONTRIBUTING.md (even if no contributors expected — signals professionalism)
- LICENSE
- CANON diagram in repo and embedded in flagship blog post
- Link prominently from portfolio

### Case studies

- **Sylphie** — featured. Architecture overview, key design decisions, what's built, what's next. Links to repo and flagship post.
- **Mediavine / Journey** — narrative case study, NDA-shaped. Frame at the level of "led AI tooling adoption" / "built internal product X." Decision pending NDA review.
- **Third slot** — TBD. Recommend Fastbreak take-home (clean, owned, recent, demonstrable) over Ghost Trader (interesting but harder to present) or Levl (concept only).

### Career page

- Education, roles with dates and one-line summaries
- Certifications (AWS if applicable, JLPT progress, anything else formal)
- Language: English (native), Japanese (learning, current level honestly stated)
- Downloadable as PDF, formatted to be rirekisho-adjacent without literally being one

---

## 7. Build order

Each phase ends with a deployable, working state. No phase blocks merging to main.

### Phase 0 — Foundations (week 1)

- Repo, Vite, TS, Tailwind v4, basic routing
- Deploy to Vercel, custom domain configured
- GSAP, Motion, Lenis baseline integrated
- EN/JA i18n scaffolding with placeholder content
- MDX content pipeline working end-to-end with one dummy post
- Custom cursor + magnetic interactions as a global system
- **Concurrent task:** ship sylphie.live root holding page

### Phase 1 — Hero (week 2)

- Hero component with typography-as-art treatment
- Positioning line locked (workshop separately)
- Scroll-into-page transition
- Language toggle functional
- This phase establishes the visual language for everything else

### Phase 2 — Work index + first case study (week 3)

- Work section laid out
- One case study fully built (Sylphie, since content is most ready)
- Case study route transitions
- Mobile choreography for case studies

### Phase 3 — Remaining case studies (week 4)

- Mediavine case study (post-NDA review)
- Third case study
- Cross-linking between cases

### Phase 4 — Writing + Career (week 5)

- Writing index and post template
- Three flagship posts published
- Career timeline page
- PDF resume download

### Phase 5 — Polish (week 6)

- Lighthouse audit, perf tuning
- Accessibility audit (real screen reader testing, not just axe)
- SEO + OG images for every page and post
- Native Japanese speaker review of all JA copy
- Cross-browser testing (Safari is the silent assassin)

### Phase 6 — Launch (end of week 6)

- Public announcement
- Submit to portfolio aggregators (Awwwards, etc. — though don't count on it)
- Cross-post flagship blog post to Hacker News, relevant subreddits, LinkedIn
- Begin outreach to AI roles in earnest

**Total: ~6 weeks if working at it consistently.** Realistic for someone employed full-time elsewhere; aggressive but doable for someone in active job-search mode.

---

## 8. Parallel deliverables (not portfolio code, but launch-blocking)

- **sylphie.live root page** — single static page, link to portfolio and GitHub. Half-day of work.
- **Sylphie GitHub repo public** — README, LICENSE (AGPL-3.0), CONTRIBUTING, CANON diagram. Day of work plus repo audit.
- **Three flagship blog posts written** — bulk of pre-launch content effort, 2-3 weeks parallel to coding.
- **Mediavine NDA review** — Jim uploads, Claude reviews, we scope what's permissible. Same week.
- **Native JA speaker review** — find a reviewer (iTalki tutor, language exchange contact, or paid service like Gengo for the bio/contact pages specifically). Phase 5 task but lining up the reviewer should happen earlier.
- **Domain DNS for jim.sylphie.live** — five-minute task, do it now to avoid propagation delays at launch.

---

## 9. Open decisions

These need answers before or during the build:

1. **Positioning line** — current draft is placeholder. Workshop separately.
2. **Color palette** — needs to be its own design exercise, probably alongside Phase 1.
3. **Type pairing** — needs commitment before Phase 1 starts.
4. **Third case study** — Fastbreak vs Ghost Trader vs Levl. Recommend Fastbreak.
5. **Sound design** — yes/no. Trend-y but divisive. Default off if included.
6. **Analytics** — Vercel Analytics is fine; do we want anything richer (Plausible, PostHog)?
7. **Newsletter** — does a "subscribe" CTA make sense for the writing section, or skip for v1?

---

## 10. Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Scope creep, never ships | Hard 6-week timeline, phase-gated deploys, ship something every week |
| Pszostak comparisons inviting "just a clone" criticism | Distinct color/type system, original case study content, restraint in motion density |
| NDA limits gut Mediavine case study | Pre-scoped narrative-level treatment; Fastbreak as backup featured slot |
| JA copy reads wrong to native speakers | Mandatory native review before launch, no machine translation in production |
| Sylphie repo not actually launch-ready | Time-box repo audit; if not ready, link to private repo with "available on request" rather than delay |
| Blog posts take longer than coding | Start writing in Phase 0, treat them as parallel work, not sequential |
| Browser perf on motion-heavy pages | Per-phase Lighthouse checks, willingness to cut effects that don't earn their cost |

---

## 11. Success criteria

The portfolio launch is successful if, within 90 days post-launch:

- 3+ inbound conversations from AI roles
- 1+ inbound conversation involving Japan (remote or relocation)
- Flagship Sylphie post gets meaningful engagement (HN front page or equivalent reach)
- Site passes Lighthouse 95+ on perf/a11y/SEO across all pages
- Native JA reviewer signs off on all Japanese copy

The career pivot is succeeding if, within 6 months post-launch:

- Jim is in offer conversations for AI engineering roles
- At least one of those conversations is with a company that has Japan presence

---

## 12. Next actions (immediate)

1. Confirm Path A (delay launch for writing) vs Path B (launch lean, write after)
2. Lock the positioning line (separate working session)
3. Set up the repo and DNS this week
4. Schedule NDA upload + review
5. Begin draft of flagship Sylphie post in parallel with Phase 0 coding
