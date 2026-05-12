# Analytics setup — PostHog (heatmaps) + GA4

**Status:** Implementation wired; awaiting keys.
**Owner:** Jim

The site is already plumbed for both PostHog and Google Analytics 4. Both stay completely silent until their respective env vars are set, so committing this code with empty keys is safe and local dev stays clean.

This doc walks through getting the keys, putting them in the right places, and verifying both tools are firing.

---

## What's already wired

In `src/lib/analytics.ts`:

- Reads `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`, `VITE_PUBLIC_GA_MEASUREMENT_ID` from the build environment.
- Initializes PostHog if its key is set; loads `gtag.js` if the GA ID is set; no-ops cleanly if neither is set.
- Subscribes to TanStack Router's `onResolved` event and fires a `$pageview` (PostHog) and `page_view` (GA) on every SPA navigation, since the page doesn't actually reload between routes.
- Guards everything with `isPrerender()` so the build-time crawl never logs as a real visitor.

Initialization happens in `src/main.tsx` immediately after `createRouter(...)`.

---

## 1. PostHog (heatmaps + recordings)

### 1a. Create the account and project

1. Go to https://posthog.com and sign up. Pick **US Cloud** for lower latency in North America, or **EU Cloud** if you want EU residency. The default in this repo is US.
2. Create a project. Name it `jim.sylphie.live`.
3. After landing in the project, go to **Settings → Project → General**. The **Project API Key** (starts with `phc_...`) is the value you want. Copy it.

### 1b. Adjust project defaults

While you're in Settings:

- **Autocapture:** ON (default). This is what powers heatmaps without any per-element instrumentation — PostHog records every click, scroll, and form submit automatically.
- **Session recordings:** ON (default). Free tier is 5,000 recordings/month, plenty for portfolio launch.
- **Recordings → Sampling:** leave at 100% until you start seeing meaningful volume; sample down later if needed.
- **Recordings → Mask all inputs:** ON. Defense-in-depth against accidentally capturing anything sensitive (contact form, etc.).
- **Data management → Person profiles:** the code already sets `person_profiles: "identified_only"`, so no anonymous profiles are created. Means heatmaps and recordings work without burning profile quota.

### 1c. Set the key

Locally:

```bash
# .env.local (gitignored)
VITE_PUBLIC_POSTHOG_PROJECT_TOKEN=phc_your_actual_key_here
```

On the deploy host (Vercel/Netlify/Cloudflare Pages):

- Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` as a build environment variable in the project dashboard.
- Optional: also add `VITE_PUBLIC_POSTHOG_HOST` if you're using EU cloud (`https://eu.i.posthog.com`).
- Trigger a new deploy. PostHog only loads when the env var is present at build time.

### 1d. Verify

1. Open the deployed site in an incognito window.
2. Click around a few routes.
3. Back in PostHog, go to **Activity → Live events**. You should see `$pageview` and `$autocapture` events streaming in within ~10 seconds.
4. Heatmaps: **Web analytics → Heatmaps → New** → enter `https://jim.sylphie.live/` → load. The view renders an overlay of click density on your live site. Each route is a separate heatmap.
5. Recordings: **Activity → Recordings**. Recordings appear after a session ends (page close or 30 min of inactivity).

---

## 2. Google Analytics 4

### 2a. Create the property

1. Go to https://analytics.google.com and sign in.
2. **Admin → Create → Property**.
   - Property name: `jim.sylphie.live`
   - Time zone: your operating time zone (affects daily rollups)
   - Currency: USD (or whatever)
3. **Business details:** small / under 100 visitors per day for now.
4. **Create a stream:** select **Web**. Enter `https://jim.sylphie.live` and a stream name (`jim.sylphie.live web`).
5. After creation, the stream detail page shows your **Measurement ID** (format: `G-XXXXXXXXXX`). Copy it.

### 2b. Adjust stream defaults

While in the stream detail:

- **Enhanced measurement:** ON. GA4 will track outbound clicks, scrolls, file downloads, and site search automatically. Useful baseline.
- **Configure tag → Define internal traffic:** add your own IP (or skip if your IP is dynamic — you can rely on the GA4 "developer/internal traffic" filter via gtag debug mode instead).

### 2c. Set the measurement ID

Locally:

```bash
# .env.local (gitignored)
VITE_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

On the deploy host: add `VITE_PUBLIC_GA_MEASUREMENT_ID` to the project's build env vars. Trigger a new deploy.

### 2d. Verify

1. In GA, go to **Admin → Property settings → DebugView** (left sidebar under "Property").
2. Open the deployed site in Chrome with the **Google Analytics Debugger** extension on (or hit the site with `?gtm_debug=x` appended).
3. Click between routes. DebugView shows events streaming in within a few seconds — look for `page_view` events with the right `page_path`.
4. After ~24 hours, **Reports → Realtime** will show traffic; standard reports populate after about a day.

### 2e. SPA pageview note

`gtag.js` does NOT auto-track SPA route changes — it only fires `page_view` on initial page load by default. The code in `src/lib/analytics.ts` handles this by setting `send_page_view: false` in the config call and then firing `gtag('event', 'page_view', { page_path })` manually on every TanStack Router `onResolved` event. Don't undo this — without it, GA only sees the landing page of each session.

---

## 3. Privacy disclosure

Both tools use cookies / local storage and qualify as analytics tracking under GDPR, CCPA, and Japan's APPI. Recommended minimum for the JP audience:

- Add a short privacy note to the footer or a `/privacy` route stating: site uses anonymous analytics (Google Analytics 4, PostHog) for traffic and UX research; no personal data is collected or sold; users may opt out via browser DNT settings or by blocking the respective domains.
- The JP audience is forgiving of analytics on a small personal site as long as it's disclosed. A full cookie consent banner is overkill at this stage and adds friction.
- PostHog: the `person_profiles: "identified_only"` config already prevents creation of identifiable visitor profiles. Recordings have all input fields masked by default.
- GA4: anonymizes IP by default in EU; configure same for other regions via **Admin → Data Streams → Configure tag → More tagging settings → Define internal traffic / Reporting identity** if you want stricter anonymization.

When ready to add a privacy page, draft separately — it's not gated on the analytics setup.

---

## 4. Prerender hygiene

The build-time crawl in `scripts/prerender.mjs` sets `window.__PRERENDER__ = true` before the React app boots. `initAnalytics()` checks this and bails out before initializing either tool, so:

- No analytics scripts get baked into the prerendered HTML.
- No fake "session" appears in PostHog/GA each time we build.

If you add other tracking later (Mixpanel, Sentry, etc.), guard each behind `isPrerender()` the same way.

---

## 5. Local development

Local dev doesn't need analytics firing. Two ways to keep it quiet:

- **Don't set the env vars in `.env.local`** — the cleanest option. Code no-ops.
- **Or use separate dev keys**: create a second PostHog project (`jim.sylphie.live (dev)`) and stash its key in `.env.local` if you want to validate the wiring against real network calls.

The build env vars on Vercel/Netlify only apply to deploy builds, so production keys never leak into local dev unless you copy them yourself.

---

## 6. Where to look in the code

- `src/lib/analytics.ts` — initialization, route-change pageview firing.
- `src/lib/is-prerender.ts` — the prerender gate.
- `src/main.tsx` — invokes `initAnalytics(router)`.
- `.env.example` — env var reference.
- `src/vite-env.d.ts` — TypeScript types for the env vars.

If something stops firing, start by checking that the env vars are actually present in the deploy environment (they're build-time, not runtime — a new build is required after adding them).
