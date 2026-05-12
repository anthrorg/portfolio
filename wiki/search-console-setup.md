# Search engine console setup

**Status:** Foundation deployed; consoles not yet registered.
**Owner:** Jim

The site already publishes everything Googlebot and Bingbot need (`sitemap.xml`, `robots.txt`, prerendered HTML per route with valid `<title>`, `<meta description>`, `<link rel="canonical">`). What's still missing is *registering ownership* with each search engine so you can monitor crawl coverage, see what queries surface your pages, and proactively submit the sitemap.

This doc walks through both Google Search Console (GSC) and Bing Webmaster Tools (BWT) — BWT also feeds Yahoo Japan, which matters for the medium-term JA audience.

---

## 1. Google Search Console

### 1a. Add the property

1. Go to https://search.google.com/search-console while signed into the same Google account you'll use long-term.
2. **Add property**. Two property types:
   - **Domain property** (`sylphie.live`) — covers all subdomains and protocols. Requires DNS TXT record verification. Pick this if you have DNS access to `sylphie.live`.
   - **URL prefix property** (`https://author.sylphie.live`) — scoped to that exact origin. Easier verification via HTML meta tag.
3. Recommended: **URL prefix property** for `https://author.sylphie.live` right now (fastest), and add the **Domain property** for `sylphie.live` later if you stand up additional subdomains.

### 1b. Verify ownership

GSC will offer several verification methods. Pick **HTML tag** — it's the lowest-friction option for this setup:

1. GSC will show a string like `<meta name="google-site-verification" content="abc123..." />`.
2. Copy just the `content` value (`abc123...`).
3. Send it to me, or paste it into `index.html` yourself. The `<meta>` needs to live inside the `<head>` of `index.html`. Because we prerender every route, the tag will end up on *every* prerendered HTML file automatically — no per-route work needed.
4. Trigger a deploy (push any commit, or `railway redeploy`).
5. Back in GSC, click **Verify**. Confirms within a few seconds.

Alternative methods if you'd rather:
- **Google Analytics** — if your GA4 measurement ID is already wired (it isn't yet), GSC can verify via that. Skip until GA is set up.
- **DNS TXT record** — only path for Domain properties. Slower (DNS propagation), but covers the whole apex domain.

### 1c. Submit the sitemap

After verification:

1. In GSC, left nav → **Sitemaps**.
2. Enter `sitemap.xml` (GSC will prepend the property origin).
3. Submit. Status should flip to "Success" within minutes; Google starts crawling listed URLs over the next 24–72h.

### 1d. Sanity checks

- **URL Inspection tool** (top search bar in GSC): paste `https://author.sylphie.live/work/sylphie` → "Test live URL" → "View tested page" → "HTML". You should see the prerendered HTML with the H1 and meta tags. If you see `<div id="root"></div>` empty, the prerender didn't run or didn't get served — debug the deploy.
- **Coverage** report (after ~48h): expect 6 valid URLs (matches `sitemap.xml`).
- **Performance** report (after ~7 days): impressions and clicks per query.

### 1e. Settings worth flipping

- **Settings → Users and permissions** — add any collaborators (probably none for now).
- **Settings → Email preferences** — leave on; GSC emails about critical issues (manual actions, crawl errors).
- **Settings → International targeting → Country** — for v1, leave **unset / "doesn't list"**. Geo-targeting is for sites that should *only* surface in one country, which you don't want.

---

## 2. Bing Webmaster Tools (+ Yahoo Japan)

Yahoo Japan uses Bing's index for organic results. Skipping BWT means giving up free traffic from one of the top Japanese search engines.

### 2a. Register

1. Go to https://www.bing.com/webmasters and sign in (Microsoft account works).
2. **Add a site** → enter `https://author.sylphie.live`.
3. **Easy mode:** click "Import from Google Search Console" once you've completed GSC verification above. BWT pulls the property + sitemap automatically. Done in 30 seconds.
4. **Manual mode** (skip if Import worked):
   - BWT will offer XML file upload, meta tag, or CNAME verification.
   - Same as GSC, the meta tag option is easiest. Send me the token if you want it embedded.

### 2b. Submit sitemap manually if needed

If the Import didn't bring it across: **Sitemaps → Submit sitemap** → `https://author.sylphie.live/sitemap.xml`.

---

## 3. IndexNow (instant indexing for Bing/Yandex)

Optional but cheap: IndexNow is a protocol where you POST a list of changed URLs and Bing/Yandex pull them immediately rather than waiting to crawl. Useful when you publish a blog post.

Not implemented in this repo yet. If/when you want it, the shape is:

```
POST https://api.indexnow.org/indexnow
{ "host": "author.sylphie.live", "key": "<api-key>", "urlList": ["https://author.sylphie.live/writing/new-post"] }
```

Defer until you have a publishing pipeline. Google does NOT participate in IndexNow.

---

## 4. What's NOT here yet — open follow-ups

- **JA-locale crawlability.** Current architecture has one URL per page; only English content is indexed. When you're ready to push for the JA audience seriously, add URL-prefixed locales (`/ja/...`) and `hreflang` tags on every route. Both GSC and BWT will then index both locales as distinct pages.
- **Structured data (JSON-LD).** Person + Organization schema for the home page, Article schema for blog posts, BreadcrumbList for case studies. Adds rich-result eligibility (sitelinks, breadcrumbs in SERP). Not blocking but a free polish layer.
- **OG image per route.** Currently every route uses `og-default.png`. Per-route OG cards would lift social CTR meaningfully — generate at prerender time using a Vite plugin or a small headless-Chromium step.
- **Internal linking audit.** Once a few case studies and posts exist, run GSC's "Links" report to see how Google sees the link graph. Tweak hub pages accordingly.

---

## 5. Cadence

- **Day 1–2 (after deploy):** verify GSC + BWT, submit sitemaps, run URL Inspection on every route to confirm prerendered HTML is being served.
- **Week 1:** check GSC Coverage daily; resolve any "Discovered – currently not indexed" pages by improving internal links to them.
- **Month 1:** review Performance report — what queries are surfacing the site? Which pages get clicks vs. impressions? Use this to tune the next round of writing.
- **Quarterly:** review crawl stats (Settings → Crawl stats). Confirm Googlebot is fetching the prerendered HTML, not just the JS bundle.

---

## 6. Where the technical foundation lives

For reference, in case anything stops working:

- `scripts/prerender.mjs` — generates the per-route HTML at build time.
- `scripts/generate-sitemap.mjs` — emits `dist/sitemap.xml`.
- `public/robots.txt` — allows all crawlers, points to sitemap.
- `src/lib/use-head.ts` — per-route `<title>`, description, canonical, OG.
- `scripts/routes-manifest.mjs` — the route list both scripts share.

All run automatically as part of `npm run build`.
