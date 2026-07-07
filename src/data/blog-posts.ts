export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    date: string; // ISO date
    tags: string[];
    content: string; // markdown
}

export const blogPosts: BlogPost[] = [
    {
        slug: "portfolio-v2-hardening-spa-navigation",
        title: "Portfolio v2 hardening: CI gates, bundle budgets, and a SPA navigation bug",
        excerpt:
            "A three-phase pass on reliability and performance — deploy gated on CI, server-component sections, Playwright smoke tests — and the subtle opacity bugs that broke the homepage on client-side navigation back from other routes.",
        date: "2026-07-08",
        tags: ["Next.js", "Performance", "CI/CD", "Debugging"],
        content: `
This site shipped a **v2.0 hardening pass** across deploy reliability, homepage performance, analytics honesty, and test coverage. Most of it is invisible when things work — which is the point — but one bug only showed up during real navigation: **Home → Work → Home** changed the URL correctly while parts of the homepage stayed invisible.

## Phase 0 — stop shipping broken deploys

Three production footguns were fixed first:

- **Deploy waits for CI** — the \`gh-pages\` workflow now runs only after the CI workflow succeeds on \`main\`, instead of racing it in parallel.
- **Resume binaries in the pipeline** — \`generate:resume\` (Playwright + Python) runs in CI and deploy so PDF/DOCX links don't 404 on the live site.
- **Docs and dead code** — README drift (Node 26, blog route, footer reality) was synced; the pre-Next.js \`docs-legacy/\` tree and unused Supabase server stubs were removed.

\`predev\` now runs \`generate:brand\` so local dev doesn't serve broken manifest/OG icon paths on a fresh clone.

## Phase 1 — homepage bundle diet (without breaking UX)

Four homepage sections — **About, Skills, Experience, Testimonials** — moved from client components to **server components**. Animation wrappers (\`TiltCard\`) stay client-only where interactivity is needed; the text and structure render as static HTML at build time.

A bundle gate tightened from **400 KB → 340 KB gzip** (measured baseline ~335 KB). Lighthouse performance floor moved from a **0.5 warn** to a **0.7 error** (homepage LHCI baseline ~0.71 on desktop preset).

## Phase 2 — honest analytics and smoke tests

Analytics was consolidated around clearer tiers:

- **Plausible** — primary privacy-friendly page analytics (when configured).
- **Supabase** — optional cross-device visitor sync for the status dashboard demo.
- **CountAPI** — now opt-out via \`NEXT_PUBLIC_COUNTAPI_ENABLED=false\`; the UI shows "unavailable" instead of silently displaying zero.

**Playwright** smoke tests were added to CI (home, work, status, blog, skip link, and a round-trip navigation check). The status dashboard now labels probe history as **this browser only** — not a global SLA.

## The bug: some sections visible, some not

The worst issue appeared only on **client-side navigation back to /**\`. First load looked fine. Leaving and returning left a patchwork — Hero and About might show, Projects and Contact invisible until you scrolled (or forever, depending on the browser).

Three separate mechanisms stacked \`opacity: 0\`:

### 1. CSS \`animation-timeline: view()\`

Scroll-driven reveal CSS sets \`opacity: 0\` before the animation runs. On a full page load the timeline advances as you scroll. On SPA remount the timeline **does not reliably restart**, so sections can remain at opacity zero even though they're in the DOM.

**Fix:** remove scroll-driven opacity reveals from the critical path. \`Reveal\` is now a plain wrapper.

### 2. Framer \`whileInView\` with \`once: true\`

\`FadeIn\` used \`whileInView={{ opacity: 1 }}\` with \`viewport={{ once: true }}\`. When a section remounts **already in the viewport**, Framer may never re-fire the in-view trigger, leaving \`initial={{ opacity: 0 }}\` stuck.

**Fix:** drop opacity-based scroll fades entirely on homepage sections. Content is always visible; motion is limited to safe transforms (e.g. Hero title word slide) or removed where it conflicted with SPA navigation.

### 3. Route enter/exit opacity on \`AppShell\`

\`AnimatePresence\` wrapped every page in an opacity fade. Combined with the section-level bugs above, the whole main column could appear blank on return.

**Fix:** remove route enter opacity; keep a simple \`key={pathname}\` wrapper without fading the entire page in from zero.

## What we kept

- Server-component sections for static content (smaller JS, faster first paint).
- Bundle and Lighthouse CI gates.
- Playwright round-trip test asserting **all seven homepage sections** stay at \`opacity: 1\` after navigation.
- Deploy gated on green CI.

## Lesson

On a **static export + client navigation** site, any pattern that hides content at \`opacity: 0\` and waits for scroll or mount-time animation is a latent SPA bug. Progressive enhancement should mean "extra motion when it works," not "invisible until JavaScript animation fires."

For a portfolio, **reliability beats scroll theatrics**. The animations can come back later — behind a client-only Intersection Observer that resets on route change, or as transform-only effects that never hide content.
`,
    },
    {
        slug: "static-portfolio-with-client-only-analytics",
        title: "Building a fully static portfolio with client-only visitor analytics",
        excerpt:
            "How this site runs entirely as a Next.js static export on GitHub Pages, yet still ships a live visitor map, uptime dashboard, and system telemetry — with no server at all.",
        date: "2026-03-14",
        tags: ["Next.js", "Static Export", "Supabase", "Architecture"],
        content: `
This site (im-rihan.github.io) is a **Next.js 16 static export** hosted on GitHub Pages — there is no server, no API routes, and no middleware in production. Every "backend" feature you see on the **/status** page — the visitor world map, uptime history, link health checks, and system telemetry — runs entirely in the browser.

## Why static?

GitHub Pages is free, fast via its CDN, and has zero maintenance burden. The trade-off is that anything dynamic has to be pushed to the client or to a third-party service that accepts requests directly from the browser.

## The analytics stack

Visitor analytics uses a layered fallback approach so the feature degrades gracefully:

- **Geo lookup** — [ipwho.is](https://ipwho.is) resolves an approximate country/city client-side, no API key needed.
- **Local persistence** — every visit is written to \`localStorage\` immediately, so the dashboard always has *something* to show, even offline.
- **Cross-device sync (optional)** — if Supabase env vars are configured at build time, visits are also inserted into a Postgres table via the anon/publishable key, and read back for a global view across devices.
- **Global counters** — a public CountAPI counter tracks total visits without needing any backend at all.

\`\`\`ts
async function trackVisit() {
  const geo = await lookupGeo();
  const visit = buildVisitRecord(geo);
  persistLocally(visit);
  await pushSupabaseVisit(visit); // no-op if not configured
  await incrementGlobalCounter();
}
\`\`\`

## Status page without a server

The **/status** dashboard runs client-side link probes against every route and external asset on an interval, using \`fetch\` with a timeout and classifying results into \`online\`, \`slow\`, \`offline\`, or \`unknown\`. Results are aggregated into an overall health banner and a rolling uptime history stored in \`localStorage\` — a lightweight status page that costs nothing to run and needs no monitoring service.

## Trade-offs

Nothing here is free of downsides:

- Anonymous Supabase reads mean the publishable key is visible in the client bundle — RLS policies have to assume any anonymous caller can send arbitrary requests, so writes must be validated with \`check\` constraints at the database level, not just in application code.
- Every environment variable is baked in at **build time**. Rotating a key means rebuilding and redeploying, not just changing a runtime secret.
- Third-party services (\`ipwho.is\`, CountAPI) have no SLA, so every call is wrapped in a try/catch that fails silently rather than breaking the page.

For a personal portfolio, these trade-offs are the right call — the whole point is near-zero operational cost while still demonstrating real production patterns.
`,
    },
    {
        slug: "debugging-backdrop-filter-android-tablets",
        title: "Debugging a GPU compositing bug: blank glass cards on Android tablets",
        excerpt:
            "A Redmi Pad Pro user reported 'skeleton-like' pages and misplaced shadows while scrolling. The root cause: backdrop-filter and 3D transforms don't composite reliably together on some Android GPUs.",
        date: "2026-06-02",
        tags: ["CSS", "Performance", "Mobile", "Debugging"],
        content: `
A user on a **Redmi Pad Pro** reported that while scrolling this site, glass cards would render as blank "skeletons" with shadows detached from their boxes — a visual bug that never showed up on desktop or on my own test devices.

## Narrowing it down

The common thread across the affected cards (\`.glass-card\`, the navbar, tilt-effect project cards) was two CSS features stacked together:

\`\`\`css
.glass-card {
  backdrop-filter: blur(20px);
  transform-style: preserve-3d; /* from a parent tilt wrapper */
}
\`\`\`

Individually, both are well supported. Combined — on certain Android GPU/driver combinations — the compositor can fail to recompute the blurred backdrop layer correctly during scroll, leaving a stale or blank frame with its box-shadow rendered at the wrong offset. This is a known class of bug on mobile Chromium/WebView compositors, not something unique to this codebase.

## Why width-based breakpoints didn't help

My first instinct was "just disable effects below \`768px\`." That's wrong for this bug: a Redmi Pad Pro in landscape is **wider than most desktop breakpoints**, so width-based media queries never catch it — the tablet kept receiving full desktop styling, including mouse-oriented 3D tilt effects it can't hover to trigger anyway.

The right signal isn't screen size, it's **input capability**:

\`\`\`css
@media (hover: none), (pointer: coarse) {
  .glass-card {
    backdrop-filter: none;
    transform-style: flat;
    background: var(--bg-card-solid);
  }
}
\`\`\`

\`(hover: none)\` and \`(pointer: coarse)\` both describe touch-first input, regardless of viewport width — a large tablet in landscape still matches, while a mouse-driven ultrawide monitor doesn't.

## The full fix

Three changes, applied consistently:

1. A small \`prefersReducedEffects()\` utility combining \`(prefers-reduced-motion: reduce)\`, \`(hover: none)\`, and \`(pointer: coarse)\` into one check.
2. Framer Motion wrappers (\`FadeIn\`, \`TiltCard\`) read that utility on mount and render a plain, static element instead of the animated one on touch-first devices.
3. CSS media queries mirror the same logic to drop \`backdrop-filter\`/\`preserve-3d\` and fall back to solid backgrounds wherever glassmorphism is used — navbar, dropdown, cards.

The result: touch-first devices get flat, fast, correctly-composited UI, and desktop/mouse users keep the full glass + tilt experience. No visual regression, no more skeleton cards.
`,
    },
    {
        slug: "hub-and-spoke-visitor-world-map",
        title: "From tangled lines to a hub-and-spoke visitor map",
        excerpt:
            "The status page's world map connected visitor countries sequentially, producing a tangled zig-zag instead of readable arcs. Here's how a hub-and-spoke projection fixed it.",
        date: "2026-05-18",
        tags: ["Data Viz", "SVG", "UX"],
        content: `
The **/status** page includes a small world map showing which countries recent visitors came from, connected by animated arcs. The original implementation connected countries **sequentially** — country 1 to country 2, country 2 to country 3, and so on — which produced a tangled zig-zag with no clear meaning once more than three or four countries were present.

## The fix: hub-and-spoke

Instead of chaining points together, arcs now radiate from a single **hub** — the visitor's home country if present in the data, otherwise whichever country has the most visits — out to up to six other countries, capped to keep the map legible:

\`\`\`ts
const HOME_HUB_CODE = "IN";
const MAX_SPOKES = 6;

const hub = countries.find((c) => c.code === HOME_HUB_CODE) ?? countries[0];
const spokes = countries.filter((c) => c.code !== hub.code).slice(0, MAX_SPOKES);
\`\`\`

This reads immediately as "traffic radiating from home base" rather than an arbitrary path through the data.

## Unifying pin and arc projection

A second, subtler bug: pins and arc endpoints used **different math** to convert a country's \`[lon, lat]\` into pixel coordinates, so a pin and the arc that was supposed to terminate at it didn't actually line up. The fix was a single \`projectMapPoint()\` helper used everywhere a coordinate needs to become an \`{ xPct, yPct }\` position, so pins and arcs always agree.

## Filtering unknown countries

The geo lookup service occasionally returns an \`"XX"\` unknown-country sentinel (VPNs, some mobile carriers, or lookup failures). Before the fix, \`"XX"\` was silently plotted at \`[0, 0]\` — off the coast of West Africa — which showed up as a confusing phantom visitor. Now, a small \`hasCountryCoords()\` guard filters out any country without real coordinates before it ever reaches the map or the arc generator.

Small, unglamorous bugs like these — sequential vs. hub-and-spoke, mismatched projection math, a magic sentinel value — are usually more impactful to fix than they are interesting to write about, but they're exactly the kind of thing that separates a demo from something that actually reads correctly with real, messy production data.
`,
    },
];

export function getBlogPost(slug: string): BlogPost | undefined {
    return blogPosts.find((post) => post.slug === slug);
}

export function sortedBlogPosts(): BlogPost[] {
    return [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function formatBlogDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function estimateReadingMinutes(content: string): number {
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 220));
}
