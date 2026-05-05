# Destructible Portfolio — "Magic Mode"

**Status:** Planning · not started
**Owner:** Jim
**Last updated:** 2026-04-28

## The pitch

The portfolio loads as a clean, magazine-quality professional site. A small wand button — near-invisible until hovered — lets a visitor flip on **Magic Mode**. The cursor becomes a wand, a spell palette appears, and any element on the page becomes a target. Click a section to freeze it, throw it around, or shatter it into physics-driven shards. A Mend spell restores everything.

The contrast is the feature: pristine portfolio → suddenly a toy. Surprise + interactivity as a way to stand out, while the default-off state keeps the site recruiter-safe.

## Non-goals

- Not a true 3D engine. No Three.js / React Three Fiber. Effects are a hybrid of CSS, SVG, canvas, and 2D rigid-body physics — sized to each spell.
- Not available on mobile. Wand is hidden under `(max-width: 1024px)` and `prefers-reduced-motion`. No fallback experience — Magic Mode simply doesn't exist for those users.
- Not a permanent state. Every spell is reversible via Mend; refreshing the page also resets everything.
- Not blocking the initial bundle. Engine code only loads on first toggle.

## Scope (first pass)

Three spells + Mend, per-element targeting, desktop only.

| Spell | Effect | Tech |
|---|---|---|
| ❄️ Freeze | Element frosts over, desaturates, becomes uninteractive. Sparkle particles drift on top. | CSS filter + SVG turbulence overlay + a few CSS-animated snowflakes |
| 🌪️ Levitate | Element detaches and follows the cursor with spring damping. Click again → thrown with cursor velocity → falls under gravity. | `motion` (already in deps) for spring-follow; Matter.js for the throw + gravity |
| 💥 Shatter | Element snapshotted to a canvas, sliced into shards, each shard becomes a rigid body. Outward impulse from click point, gravity drops them, layout collapses. | `html-to-image` for snapshot; Matter.js for physics; single fixed-position canvas overlay for rendering |
| ✨ Mend | Reverses every afflicted element back to its origin with a sparkle trail. | Registry walk + GSAP (already in deps) |

## Architecture

### Files

```
src/magic/
  MagicModeContext.tsx     # provider + useMagic() hook; tracks mode, active spell, registry
  Wand.tsx                 # toggle button — fixed bottom-right, always loaded (~2kb)
  SpellPalette.tsx         # spell picker, only mounted when mode is on
  WandCursor.tsx           # custom cursor renderer
  engine.tsx               # lazy entry — dynamic-imported on first toggle, pulls physics + spells
  registry.ts              # afflicted-element state: { id, element, spell, originalRect, originalStyles, physicsBody?, overlays? }
  targeting.ts             # mouseover outline + click dispatcher
  spells/
    freeze.ts
    levitate.ts
    shatter.ts
    mend.ts
```

### Targeting model

Auto-detect spellable elements via a CSS selector list:

```
section, article, h1, h2, h3, h4, p, a, img, .card, [data-spellable]
```

Opt-out via `data-no-spell` for: the wand itself, the spell palette, skip-links, the language switcher, anything in the persistent nav we don't want destroyed.

When Magic Mode is on:
- `mouseover` on a spellable element → outline glow appears
- `click` → dispatches the active spell on that element
- `Escape` → exits Magic Mode (Mends nothing automatically — leaving destruction visible is intentional)

### State / registry

Every cast appends to a registry keyed by a generated id:

```ts
type Affliction = {
  id: string
  element: HTMLElement
  spell: 'freeze' | 'levitate' | 'shatter'
  originalRect: DOMRect
  originalInlineStyle: string  // for restore
  cleanup: () => void          // spell-specific teardown (remove overlays, dispose Matter bodies)
}
```

Mend iterates the registry, calls each `cleanup`, animates the element back into place if it moved, and clears the entry.

### Bundle plan

| Chunk | Size (gz, est.) | Loads when |
|---|---|---|
| Initial app | unchanged | Page load |
| `magic-shell` (Wand + Context + Cursor) | ~2 kb | Page load (only on desktop, only without `prefers-reduced-motion`) |
| `magic-engine` (Palette + Registry + Targeting + Spells) | ~25 kb | First toggle of Magic Mode |
| `matter-js` | ~85 kb | First toggle (dynamic-imported inside engine) |
| `html-to-image` | ~15 kb | First Shatter cast (further-deferred inside `shatter.ts`) |

GSAP and `motion` are already in the bundle, so Mend and Levitate add no new dependencies for those concerns.

### Layering / z-index

- Wand button: `z-index: 9999`, `position: fixed`
- Spell palette: `z-index: 9998`
- Shatter overlay canvas: `z-index: 9997`, `position: fixed`, `inset: 0`, `pointer-events: none`
- Frost overlays: positioned absolutely over their target, `z-index: target's z + 1`
- Levitating element: temporarily promoted to `z-index: 9000` while held

### Performance guards

- All animations RAF-driven; physics step capped at 60fps.
- `IntersectionObserver` pauses physics for shards that have left the viewport (already settled at the bottom).
- Outline-on-hover throttled with `requestAnimationFrame`.
- Devtools "Performance" budget: target 16ms frame at 1080p with 1 levitating element + 50 shards on screen.

## Build order

Each step is its own PR, independently testable, gated by Playwright + the MCP browser pass per `CLAUDE.md`'s Definition of Done.

1. **Wand + context + cursor + targeting outline.** No spells yet — toggling on shows the wand cursor, hovering elements shows the outline, Escape exits. Proves the framing without committing to any physics.
2. **Registry + Mend skeleton.** Mend is wired up (no-op until there's something to undo). Sets up the state machine.
3. **Freeze.** Simplest spell, pure CSS/SVG, no physics. First end-to-end cast → Mend cycle.
4. **Levitate.** Cursor-follow with `motion` springs, throw with cursor velocity, Matter.js gravity for the fall. First introduction of physics.
5. **Shatter.** `html-to-image` snapshot, shard slicing, Matter.js bodies, canvas rendering. The heaviest — last so the lighter spells de-risk the architecture first.

After step 5, polish pass: sparkle trails on Mend, reduced-motion handling double-checked, accessibility audit.

## Open questions (need decision before step 1)

1. **Wand placement.** Bottom-right corner (default web pattern), or somewhere more theatrical — tucked into the nav, or hidden until a key is pressed (e.g. `M` for magic)?
2. **Targeting outline style.** Soft indigo→pink glow matching the site palette, or something more witchy (animated dashed border, sparkles)?
3. **Mend behavior.** Single "Mend all" button only, or also a click-to-mend-this-one cast for individual elements?

## Risks / things to watch

- **Layout collapse on Shatter.** When an element shatters, its space disappears, so surrounding content reflows. Intentional (more dramatic) but could cause adjacent shards to render "through" content that just moved up. Test with stacked sections.
- **Scrolling with active afflictions.** The shatter canvas is `position: fixed`, so shards stay visually pinned to the viewport, not the page — verify this feels right vs. tying them to document coordinates.
- **Window resize.** Easiest answer: auto-Mend on resize. Alternative: re-anchor afflictions to new positions (more work, probably not worth it for v1).
- **`html-to-image` quirks.** Doesn't handle every CSS feature (some `backdrop-filter`, certain web fonts). Test against the site's actual sections; may need explicit font preloading or `useCORS`-equivalent flags.
- **Matter.js bundle weight (~85kb gz).** Acceptable as a lazy chunk but verify on a cold load. If it bites, fall back to a hand-rolled simple integrator for shatter (gravity + linear velocity only; no inter-shard collisions).
- **A11y of Magic Mode itself.** With `prefers-reduced-motion` we hide the wand entirely — confirm no keyboard trap, no focus left dangling.

## Open future ideas (parking lot — do not build now)

- Burn (SVG turbulence + ash particles)
- Melt (SVG `feTurbulence` + clip-path drip)
- Lightning between two clicked elements
- Cursor-trail sparkles even when not casting
- Persisted state via URL hash (`?spell=shatter&target=hero`) so a destroyed page can be linked
- Keyboard-only spell casting (Tab through targets, number keys for spells)
