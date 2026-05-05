# Japanese copy — native review brief

**Status:** Awaiting native speaker review
**Owner:** Jim
**Last updated:** 2026-04-28

The Japanese copy on `jim.sylphie.live` was authored by a non-native (translation-aided). This file is the brief for the native reviewer.

## Where the copy lives

- `src/locales/ja/common.json` — UI chrome (nav, hero, work, writing, career, footer, language)
- `src/content/cases.ts` — there is no JA copy here; case copy is in the locale file
- `src/content/career.ts` — bilingual `{ en, ja }` per row; placeholder rows currently
- `src/content/writing/*.mdx` — per-post; each post sets its own `lang` in `meta`
- `src/content/work/*.mdx` — currently the only authored case (`sylphie.mdx`) is EN; JA copy for the case study layout chrome lives in `src/locales/ja/common.json` under `work.*`

## Specific spots to scrutinize

The reviewer should pay particular attention to these strings — they are the ones most likely to read awkward, overly-literal, or untrue-to-tone for a Japanese-audience portfolio aimed at AI-engineering / product-engineering hiring managers.

### 1. The hero tagline

`hero.tagline` — `フロントエンドの工芸で<highlight>AIシステム</highlight>を築くエンジニア。`

- Concern: `工芸 (kōgei)` for "craft" is high-register and may read as antiquated or pretentious. `匠の技 (takumi no waza)` is one alternative but also lofty. `丁寧な (teinei na)` understates. The English ("the craft of frontend") frames craftsmanship as a positive differentiator; the JA needs to do the same without sounding self-important.
- Concern: `築く (kizuku)` for "build" — fine literally but slightly grand for software. `作る (tsukuru)` is simpler. Consider tone fit.

### 2. Section headers in the work index

`work.intro` — `三つのプロジェクト。一貫しているのは、複雑な領域へシステム思考を適用する姿勢です。`

- Concern: `システム思考` for "systems thinking" is borrowed phrasing. Native readers will recognize it but may want to confirm it lands as intended (engineering systems thinking, not management consulting jargon).

### 3. Case role/summary copy

In `work.cases.*.role` / `summary`:
- `認知アーキテクチャ` (Sylphie role) — likely fine but confirm.
- `実行経路にLLMを置かない認知アーキテクチャ。二重プロセス推論、ドライブによる注意制御、思考ではなく発声装置としての言語モデル。` — dense, technical. Audience is engineering hiring managers so density is OK, but check for naturalness.
- `AIツール導入` (Mediavine role) — flat. Maybe `AIツールの導入推進` reads more active.
- `第三のケース` (placeholder title) — literally "third case". Will be replaced when Jim picks the third project.

### 4. Career page

`career.intro` — `職歴・学歴・資格・言語。スクリーンショットでの共有を想定したレイアウト。`

- Concern: `スクリーンショットでの共有を想定したレイアウト` — explicit. The intent (rirekisho-adjacent, easy to share) may be fine to leave implicit. Reviewer's call.
- All `career.sections.*` labels (`職歴 / 学歴 / 資格 / 言語`) — standard. Should be uncontroversial.

### 5. Writing intro

`writing.intro` — `仕事の記録 — 認知アーキテクチャ、エージェント設計、フロントエンドの工芸、そして日本へ。`

- Concern: same `工芸` flag as the hero. Be consistent with whatever choice is made for the hero.
- `日本へ` — "toward Japan" — sets up the long arc. Reads OK but should confirm it doesn't sound performative to a JP audience.

### 6. Empty states + UI labels

- `writing.empty` — `投稿はまだありません。最初の長文記事は執筆中です。`  Direct, fine.
- `nav.openMenu / closeMenu` — accessibility labels, not visible. Standard.
- `nav.menuDescription` — sr-only, screen reader only.

### 7. Untranslated strings (intentional)

- `footer.rights` — left as `All rights reserved.` in JA. Standard practice for copyright notices, but reviewer may prefer `無断複写・転載を禁じます。` if they want fully localized.

## What does NOT need translation review

- Brand "Jim Tisdale" stays Latin in both languages
- The placeholder writing post (`src/content/writing/placeholder.mdx`) is EN-only by design — posts are authored per-language, not mirrored
- The Sylphie case study MDX (`src/content/work/sylphie.mdx`) is EN-only; if Jim wants a JA version of the case study, it would be a separate piece authored fresh

## Process for the reviewer

1. Read each string in context on the live site (toggle to JA via the nav)
2. Mark suggested edits inline in this file (or a copy)
3. Hand back; Jim applies the edits to `src/locales/ja/common.json` and `src/content/career.ts`

## Reviewer credentials worth confirming

- Native Japanese speaker
- Familiar with software industry / startup register
- Comfortable judging whether the tone is appropriate for a Japanese AI-startup hiring manager (formal-leaning but not stiff; competent without bragging)
