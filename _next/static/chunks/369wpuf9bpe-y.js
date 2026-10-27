(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,74503,e=>{"use strict";var t=e.i(43476),a=e.i(24511),s=e.i(72328);e.s(["FadeIn",0,function({children:e,className:o="",delay:r=0}){let i=(0,s.useReducedMotion)();return(0,t.jsx)(a.m.div,{className:o,initial:!i&&{y:12},animate:{y:0},transition:{duration:.22*!i,delay:i?0:r,ease:[.22,1,.36,1]},children:e})}])},61327,89026,49652,e=>{"use strict";let t,a;var s=e.i(42824);function o(e){return(0,s.isObject)(e)&&"ownerSVGElement"in e}function r(e,t,a){if(null==e)return[];if(e instanceof EventTarget)return[e];if("string"==typeof e){let s=document;t&&(s=t.current);let o=a?.[e]??s.querySelectorAll(e);return o?Array.from(o):[]}return Array.from(e).filter(e=>null!=e)}e.s(["isSVGElement",0,o],89026),e.s(["resolveElements",0,r],49652);let i=new WeakMap,n=(e,t,a)=>(s,r)=>r&&r[0]?r[0][e+"Size"]:o(s)&&"getBBox"in s?s.getBBox()[t]:s[a],l=n("inline","width","offsetWidth"),c=n("block","height","offsetHeight");function d({target:e,borderBoxSize:t}){i.get(e)?.forEach(a=>{a(e,{get width(){return l(e,t)},get height(){return c(e,t)}})})}function h(e){e.forEach(d)}let u=new Set;e.s(["resize",0,function(e,s){let o;return"function"==typeof e?(u.add(e),a||(a=()=>{let e={get width(){return window.innerWidth},get height(){return window.innerHeight}};u.forEach(t=>t(e))},window.addEventListener("resize",a)),()=>{u.delete(e),u.size||"function"!=typeof a||(window.removeEventListener("resize",a),a=void 0)}):(!t&&"u">typeof ResizeObserver&&(t=new ResizeObserver(h)),(o=r(e)).forEach(e=>{let a=i.get(e);a||(a=new Set,i.set(e,a)),a.add(s),t?.observe(e)}),()=>{o.forEach(e=>{let a=i.get(e);a?.delete(s),a?.size||t?.unobserve(e)})})}],61327)},2544,e=>{e.v({copy:"PageHeader-module__cS7uea__copy",header:"PageHeader-module__cS7uea__header"})},22706,e=>{"use strict";var t=e.i(43476),a=e.i(24511),s=e.i(60140),o=e.i(30551),r=e.i(86427),i=e.i(65566),n=e.i(71645),l=e.i(60830),c=e.i(87022);function d(e,t){let a,s=()=>{let{currentTime:s}=t,o=(null===s?0:s.value)/100;a!==o&&e(o),a=o};return c.frame.preUpdate(s,!0),()=>(0,c.cancelFrame)(s)}function h(e){return!("u"<typeof window)&&(e?(0,o.supportsViewTimeline)():(0,o.supportsScrollTimeline)())}var u=e.i(61327),p=e.i(83920),g=e.i(25791);let m=()=>({current:0,offset:[],progress:0,scrollLength:0,targetOffset:0,targetLength:0,containerLength:0,velocity:0}),f={x:{length:"Width",position:"Left"},y:{length:"Height",position:"Top"}};function b(e,t,a,s){let o=a[t],{length:r,position:i}=f[t],n=o.current,l=a.time;o.current=Math.abs(e[`scroll${i}`]),o.scrollLength=e[`scroll${r}`]-e[`client${r}`],o.offset.length=0,o.offset[0]=0,o.offset[1]=o.scrollLength,o.progress=(0,p.progress)(0,o.scrollLength,o.current);let c=s-l;o.velocity=c>50?0:(0,g.velocityPerSecond)(o.current-n,c)}e.i(47167);var y=e.i(44230),w=e.i(15923),v=e.i(76959),k=e.i(72846);let x={start:0,center:.5,end:1};function S(e,t,a=0){let s=0;if(e in x&&(e=x[e]),"string"==typeof e){let t=parseFloat(e);e.endsWith("px")?s=t:e.endsWith("%")?e=t/100:e.endsWith("vw")?s=t/100*document.documentElement.clientWidth:e.endsWith("vh")?s=t/100*document.documentElement.clientHeight:e=t}return"number"==typeof e&&(s=t*e),a+s}let P=[0,0],T=[[0,0],[1,1]],C={x:0,y:0},_=new WeakMap,A=new WeakMap,E=new WeakMap,M=new WeakMap,I=new WeakMap,O=e=>e===document.scrollingElement?window:e;function L(e,{container:t=document.scrollingElement,trackContentSize:a=!1,...s}={}){if(!t)return l.noop;let o=E.get(t);o||(o=new Set,E.set(t,o));let r=function(e,t,a,s={}){return{measure:t=>{!function(e,t=e,a){if(a.x.targetOffset=0,a.y.targetOffset=0,t!==e){let s=t;for(;s&&s!==e;)a.x.targetOffset+=s.offsetLeft,a.y.targetOffset+=s.offsetTop,s=s.offsetParent}a.x.targetLength=t===e?t.scrollWidth:t.clientWidth,a.y.targetLength=t===e?t.scrollHeight:t.clientHeight,a.x.containerLength=e.clientWidth,a.y.containerLength=e.clientHeight}(e,s.target,a),b(e,"x",a,t),b(e,"y",a,t),a.time=t,(s.offset||s.target)&&function(e,t,a){let{offset:s=T}=a,{target:o=e,axis:r="y"}=a,i="y"===r?"height":"width",n=o!==e?function(e,t){let a={x:0,y:0},s=e;for(;s&&s!==t;)if((0,k.isHTMLElement)(s))a.x+=s.offsetLeft,a.y+=s.offsetTop,s=s.offsetParent;else if("svg"===s.tagName){let e=s.getBoundingClientRect(),t=(s=s.parentElement).getBoundingClientRect();a.x+=e.left-t.left,a.y+=e.top-t.top}else if(s instanceof SVGGraphicsElement){let{x:e,y:t}=s.getBBox();a.x+=e,a.y+=t;let o=null,r=s.parentNode;for(;!o;)"svg"===r.tagName&&(o=r),r=s.parentNode;s=o}else break;return a}(o,e):C,l=o===e?{width:e.scrollWidth,height:e.scrollHeight}:"getBBox"in o&&"svg"!==o.tagName?o.getBBox():{width:o.clientWidth,height:o.clientHeight},c={width:e.clientWidth,height:e.clientHeight};t[r].offset.length=0;let d=!t[r].interpolate,h=s.length;for(let e=0;e<h;e++){let a=function(e,t,a,s){let o=Array.isArray(e)?e:P,r=0;return"number"==typeof e?o=[e,e]:"string"==typeof e&&(o=(e=e.trim()).includes(" ")?e.split(" "):[e,x[e]?e:"0"]),(r=S(o[0],a,s))-S(o[1],t)}(s[e],c[i],l[i],n[r]);d||a===t[r].interpolatorOffsets[e]||(d=!0),t[r].offset[e]=a}d&&(t[r].interpolate=(0,y.interpolate)(t[r].offset,(0,w.defaultOffset)(s),{clamp:!1}),t[r].interpolatorOffsets=[...t[r].offset]),t[r].progress=(0,v.clamp)(0,1,t[r].interpolate(t[r].current))}(e,a,s)},notify:()=>t(a)}}(t,e,{time:0,x:m(),y:m()},s);if(o.add(r),!_.has(t)){let e=()=>{for(let e of o)e.measure(c.frameData.timestamp);c.frame.preUpdate(a)},a=()=>{for(let e of o)e.notify()},s=()=>c.frame.read(e);_.set(t,s);let r=O(t);window.addEventListener("resize",s),t!==document.documentElement&&A.set(t,(0,u.resize)(t,s)),r.addEventListener("scroll",s),s()}if(a&&!I.has(t)){let e=_.get(t),a={width:t.scrollWidth,height:t.scrollHeight};M.set(t,a);let s=c.frame.read(()=>{let s=t.scrollWidth,o=t.scrollHeight;(a.width!==s||a.height!==o)&&(e(),a.width=s,a.height=o)},!0);I.set(t,s)}let i=_.get(t);return c.frame.read(i,!1,!0),()=>{(0,c.cancelFrame)(i);let e=E.get(t);if(!e||(e.delete(r),e.size))return;let a=_.get(t);_.delete(t),a&&(O(t).removeEventListener("scroll",a),A.get(t)?.(),window.removeEventListener("resize",a));let s=I.get(t);s&&((0,c.cancelFrame)(s),I.delete(t)),M.delete(t)}}let R=[[[[0,1],[1,1]],"entry"],[[[0,0],[1,0]],"exit"],[[[1,0],[0,1]],"cover"],[T,"contain"]],H={start:0,end:1};function N(e){if(!e)return{rangeStart:"contain 0%",rangeEnd:"contain 100%"};for(let[t,a]of R)if(function(e,t){let a=function(e){if(2!==e.length)return;let t=[];for(let a of e)if(Array.isArray(a))t.push(a);else{if("string"!=typeof a)return;let e=function(e){let t=e.trim().split(/\s+/);if(2!==t.length)return;let a=H[t[0]],s=H[t[1]];if(void 0!==a&&void 0!==s)return[a,s]}(a);if(!e)return;t.push(e)}return t}(e);if(!a)return!1;for(let e=0;e<2;e++){let s=a[e],o=t[e];if(s[0]!==o[0]||s[1]!==o[1])return!1}return!0}(e,t))return{rangeStart:`${a} 0%`,rangeEnd:`${a} 100%`}}let j=new Map;function D(e){let t={value:0},a=L(a=>{t.value=100*a[e.axis].progress},e);return{currentTime:t,cancel:a}}function W({source:e,container:t,...a}){let{axis:s}=a;e&&(t=e);let o=j.get(t);o||(o=new Map,j.set(t,o));let r=a.target??"self",i=o.get(r);i||(i={},o.set(r,i));let n=s+(a.offset??[]).join(",");return i[n]||(a.target&&h(a.target)?N(a.offset)?i[n]=new ViewTimeline({subject:a.target,axis:s}):i[n]=D({container:t,...a}):h()?i[n]=new ScrollTimeline({source:t,axis:s}):i[n]=D({container:t,...a})),i[n]}function q(e,{axis:t="y",container:a=document.scrollingElement,...s}={}){let o,r,i;if(!a)return l.noop;let n={axis:t,container:a,...s};return"function"==typeof e?function(e,t){return 2===e.length||t&&(t.target||t.offset)?L(a=>{e(a[t.axis].progress,a)},t):d(e,W(t))}(e,n):(o=W(n),r=n.target?N(n.offset):void 0,i=n.target?h(n.target)&&!!r:h(),e.attachTimeline({timeline:i?o:void 0,...r&&i&&{rangeStart:r.rangeStart,rangeEnd:r.rangeEnd},observe:e=>(e.pause(),d(t=>{e.time=e.iterationDuration*t},o))}))}var F=e.i(47414),U=e.i(74008);let G=()=>({scrollX:(0,r.motionValue)(0),scrollY:(0,r.motionValue)(0),scrollXProgress:(0,r.motionValue)(0),scrollYProgress:(0,r.motionValue)(0)}),z=e=>!!e&&!e.current;function B(e,t,a,o){return{factory:r=>{let i,n=()=>{z(a)||z(o)?s.microtask.read(n):i=q(r,{...t,axis:e,container:a?.current||void 0,target:o?.current||void 0})};return s.microtask.read(n),()=>{(0,s.cancelMicrotask)(n),i?.()}},times:[0,1],keyframes:[0,1],ease:e=>e,duration:1}}var X=e.i(95420),V=e.i(2544);e.s(["PageHeader",0,function({title:e,description:r}){let l=(0,n.useRef)(null),{scrollYProgress:c}=function({container:e,target:t,...a}={}){var r;let l=(0,F.useConstant)(G);r=a.offset,!("u"<typeof window)&&(t?(0,o.supportsViewTimeline)()&&!!N(r):(0,o.supportsScrollTimeline)())&&(l.scrollXProgress.accelerate=B("x",a,e,t),l.scrollYProgress.accelerate=B("y",a,e,t));let c=(0,n.useRef)(null),d=(0,n.useRef)(!1),h=(0,n.useCallback)(()=>(c.current=q((e,{x:t,y:a})=>{l.scrollX.set(t.current),l.scrollXProgress.set(t.progress),l.scrollY.set(a.current),l.scrollYProgress.set(a.progress)},{...a,container:e?.current||void 0,target:t?.current||void 0}),()=>{c.current?.()}),[e,t,JSON.stringify(a.offset)]);return(0,U.useIsomorphicLayoutEffect)(()=>{if(d.current=!1,!(z(e)||z(t)))return h();d.current=!0},[h]),(0,n.useEffect)(()=>{let a;if(!d.current)return;let o=()=>{let s=z(e),o=z(t);(0,i.invariant)(!s,"Container ref is defined but not hydrated","use-scroll-ref"),(0,i.invariant)(!o,"Target ref is defined but not hydrated","use-scroll-ref"),s||o||(a=h())};return s.microtask.read(o),()=>{(0,s.cancelMicrotask)(o),a?.()}},[h]),l}({target:l,offset:["start start","end start"]}),d=(0,X.useTransform)(c,[0,1],[0,-20]);return(0,t.jsx)("header",{className:`page-header container ${V.default.header}`,ref:l,children:(0,t.jsxs)(a.m.div,{className:V.default.copy,style:{y:d},children:[(0,t.jsx)("h1",{children:e}),(0,t.jsx)("p",{children:r})]})})}],22706)},72520,e=>{"use strict";let t=(0,e.i(75254).default)("ArrowRight",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);e.s(["ArrowRight",0,t],72520)},87316,e=>{"use strict";let t=(0,e.i(75254).default)("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);e.s(["Calendar",0,t],87316)},78583,e=>{"use strict";let t=(0,e.i(75254).default)("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);e.s(["FileText",0,t],78583)},53737,e=>{e.v({card:"blog-module__JsT-Oq__card",cardHead:"blog-module__JsT-Oq__cardHead",cta:"blog-module__JsT-Oq__cta",empty:"blog-module__JsT-Oq__empty",excerpt:"blog-module__JsT-Oq__excerpt",filterActive:"blog-module__JsT-Oq__filterActive",filterChip:"blog-module__JsT-Oq__filterChip",filters:"blog-module__JsT-Oq__filters",grid:"blog-module__JsT-Oq__grid",icon:"blog-module__JsT-Oq__icon",listWrap:"blog-module__JsT-Oq__listWrap",meta:"blog-module__JsT-Oq__meta",page:"blog-module__JsT-Oq__page",rssLink:"blog-module__JsT-Oq__rssLink",tag:"blog-module__JsT-Oq__tag",tags:"blog-module__JsT-Oq__tags",toolbar:"blog-module__JsT-Oq__toolbar"})},46583,e=>{"use strict";var t=e.i(43476),a=e.i(71645),s=e.i(22016),o=e.i(72520),r=e.i(87316),i=e.i(78583),n=e.i(74503);let l=[{slug:"catalog-search-kit-nestjs-sse-webhooks",title:"Catalog Search Kit: a public NestJS demo for search, SSE, and signed webhooks",excerpt:"Why the freelance kit exists, how the SSE { type } envelope and zero-hit fallback work, and how HMAC webhooks stay honest on a $0 Render box.",date:"2026-10-27",tags:["NestJS","SSE","Webhooks","Typesense","Freelance"],content:`
The case study at [/work/catalog-search/](/work/catalog-search/) is the sales page: problem, approach, results. This post is the how — the contracts I would rather a client click than hear described.

Live demo: [catalog-search-g7l4.onrender.com](https://catalog-search-g7l4.onrender.com) \xb7 source: [github.com/im-rihan/catalog-search](https://github.com/im-rihan/catalog-search)

## Why a public kit at all

Day-job NestJS, Typesense, and webhook work lives behind private repos. A proposal that says "I have done this" without a URL is a claim. A proposal that links a running search box, a streaming rewrite, and a signed inbox is a test.

The catalog is **64 fake electronics SKUs**. No listings, loans, CRM payloads, or employer schemas. One Nest process serves the API and the UI so a stranger can judge the work in under a minute.

## Two engines, one query

\`GET /api/search?q=studio+headphones\` hits an in-memory index by default. Pass \`engine=ts\` and, if Typesense is actually connected, the same handler swaps the backend. If Typesense is missing, the request does not 500 — it logs a warning and stays on memory. Render stays on the free tier when those env vars are unset.

That toggle is the point. Clients evaluating search work usually ask "can this talk to Typesense later?" The honest answer is a query param, not a rewrite.

## SSE is an envelope, not a token dump

\`GET /api/search/stream\` is \`text/event-stream\`. Each line is \`data: { "type": "...", ... }\`. Types, in order:

| \`type\` | Meaning |
| --- | --- |
| \`token\` | One word of the rewritten query, ~40ms apart so the UI can type |
| \`rewrite\` | Full rewritten string plus \`source: local \\| openai\` |
| \`hits\` | Search payload (engine used, tookMs, products) |
| \`error\` | Rewrite or search failed; stream still closes cleanly |
| \`done\` | Terminal event — the client can stop reading |

Without an OpenAI key the rewrite is **local**: stopwords stripped, a small synonym map (\`ssd → storage\`, \`cans → headphones\`), then the same index. With a key it calls the vendor and falls back to local if the vendor fails. The stream shape does not change.

## Zero hits are not an empty page

If the rewritten query returns nothing and it differs from the original text, search runs again on the original and sets \`fallback: true\`. A rewrite that is "smarter" but empties the grid is worse than no rewrite. The UI can say "showing results for your original query" instead of a blank state that looks like a bug.

## Webhooks copy the Stripe habit, not Stripe

\`POST /api/webhooks/demo\` expects:

\`\`\`text
x-catalog-signature: t=<unix>,v1=<hex>
\`\`\`

\`hex\` is HMAC-SHA256 of \`{timestamp}.{rawBody}\` with the shared secret. Verification:

- missing or malformed header → reject
- \`|now - t| > 300s\` → \`expired\` (replay window)
- digest compared with \`timingSafeEqual\` → \`mismatch\` is \`401\`
- same event \`id\` after a successful accept → \`duplicate\` / **200** (idempotent, not a client error)

Bad HMAC still lands in the on-page inbox so you can see *why* it failed. Retries are a button, not a lecture about queues.

## What this is not

Not a SaaS, not a starter-kit company, not a real-estate tool. It exists so a NestJS + search + webhook proposal can link a running example instead of private production code. If two clients buy the same shape, *then* extract modules. Until then the kit stays one repo, one process, one URL.

Read the [case study](/work/catalog-search/) for the client-facing summary, or open the [demo](https://catalog-search-g7l4.onrender.com) and hit Search / Webhooks / API.
`},{slug:"free-visitor-analytics-and-blog-ux",title:"Free visitor analytics on GitHub Pages — and a sharper blog UX",excerpt:"Restore /status for visit counts, country/region maps, and localStorage-first analytics without a paid API — plus blog tag filters, TOC, and related posts.",date:"2026-09-17",tags:["Analytics","GitHub Pages","Blog","UX","Privacy"],content:`
The portfolio already tracked visits in the browser. The missing piece was making that dashboard reachable again — and making sure SPA navigations count as real page views.

## What “free” means here

- **Visit log** — country, region, city (approximate), device, browser, OS, and page path in \`localStorage\`
- **Geo** — free providers (ipwho.is → ipapi.co → geojs.io), no API key
- **Optional** — Supabase sync and CountAPI totals only when build-time env is set
- **No cookies / no accounts** for the core path

## Multi-page tracking

Previously a session flag recorded only the **first** page in a tab. That hid funnels like Home → Work → Blog. Tracking now uses a **30-minute per-page dedup** so each route can count once without double-writing on React remounts.

## Blog UX

The blog index now filters by tag. Post pages add a table of contents, previous/next navigation, and related posts by shared tags — all static, no backend.

Open **[/status/](/status/)** to see the visitor map and **[/blog/](/blog/)** for the new filters.
`},{slug:"enhancement-phases-a-through-e",title:"Phases A–E + cross-browser hardening: analytics, CI, and Safari/mobile support",excerpt:"A full pass across debt clearance, visitor geo inference, Supabase backfill, and test coverage — followed by six cross-browser phases: backdrop-filter fallbacks, multi-browser CI, WebGL/low-memory gating, PWA install, and browser analytics.",date:"2026-07-09",tags:["Analytics","CI/CD","Supabase","Next.js","Cross-browser","Safari"],ogImage:"/og/blog-enhancement-phases.svg",content:'\nAfter the geo lookup and resume icon fixes, I ran a **five-phase enhancement plan** (A through E) across the whole portfolio codebase — not just bug fixes, but accuracy, reliability, content, and test coverage.\n\n## Phase A — quick wins\n\n- **Resume cache bust** — `RESUME_VERSION` bumped; `generate_resume.py` now auto-patches it from the last git commit date of `resume.html`.\n- **Deprecated API removed** — `suggestedPrompts` dropped from `chat-knowledge.ts`; use `suggestedPromptPool` + `pickSuggestedPrompts()`.\n- **README synced** — `ci.yml`, blog routes, and branch protection docs updated.\n- **Gallery self-hosted** — Unsplash CDN URLs replaced with local SVG tiles under `public/gallery/`.\n\n## Phase B — analytics accuracy\n\n- **Multi-provider geo** — ipwho.is → ipapi.co → geojs.io fallback (from the prior geo PR).\n- **Geo inference** — sibling visits and current-session geo backfill `XX` rows in localStorage.\n- **Supabase backfill** — new SQL migration (`allow-geo-backfill-update.sql`) lets the client PATCH unresolved rows when inference succeeds.\n- **Stale cleanup** — `cleanup-unresolved-visits.sql` purges `XX` rows older than 30 days (manual or pg_cron).\n- **Visit deduplication** — same page within 30 minutes no longer double-counts.\n- **Explicit demo mode** — `NEXT_PUBLIC_DEMO_ANALYTICS=true/false` overrides localhost defaults.\n- **85+ country centroids** — map pins for most real visitor countries.\n\n## Phase C — reliability\n\n- **PR-only CI** — `ci.yml` runs on pull requests; merge triggers **deploy only** (build + gh-pages), not a second full CI suite.\n- **Lighthouse** — `numberOfRuns: 3` for stabler medians; perf floor 0.72 warn.\n- **Service worker** — cache version bumped; HTML stays network-first so deploys are picked up immediately.\n- **3D scene deferral** — React Three Fiber loads after scroll, pointer, or keydown — not on idle — so it does not compete with LCP.\n- **Status health** — LinkedIn/GitHub profile probes are informational only; they no longer mark the site `degraded`.\n\n## Phase D — content depth\n\n- **Chat paraphrase matching** — synonym expansion + bigram similarity so "what technologies does he use?" maps to the tech stack entry.\n- **Case study depth** — expanded write-ups for `estimate-calculator` and `php-3rdpartycomms`.\n- **Per-post OG images** — blog posts and case studies can set a custom `ogImage` for social cards.\n\n## Phase E — tests\n\n- `visitor-analytics.test.ts` — `formatVisitGeo`, `shouldUseDemoAnalytics`\n- `status-check.test.ts` — informational probe exclusion\n- E2E — status map + chat response smoke tests\n- Resume HTML regression — contact icon size attributes\n\n## Supabase migration order\n\nRun in SQL Editor, once each:\n\n1. `visits.sql`\n2. `harden-visits-rls.sql`\n3. `allow-geo-backfill-update.sql`\n4. `cleanup-unresolved-visits.sql` (manual or scheduled)\n\nThe static client never needs server-side code — RLS policies bound what the publishable key can do.\n\n---\n\n# Cross-browser hardening (phases 1–6)\n\nAfter A–E merged, real-world usage exposed how much of the experience was quietly Chrome-first. Global share is roughly **65–70% Chrome, 15–18% Safari** (higher on mobile/tablet), **~5% Edge**, and **~2–3% Firefox** — so Safari and mobile were the biggest gaps. A follow-up ran six focused phases.\n\n## Phase 1 — Safari & touch compatibility\n\n- **Blur fallbacks everywhere** — a shared `touch-blur-fallback.css` plus `@supports not (backdrop-filter)` and `(hover: none)/(pointer: coarse)` guards were added to every glass surface (ContactDock, ChatWindow, SystemMetrics, GalleryGrid, AnalysisOverlay, ThemedSelect, Contact, Education, VisitorMonitor).\n- **Navbar cascade fix** — the mobile `.links` menu no longer re-applied `backdrop-filter` on top of the touch fallback.\n- **Honest telemetry labels** — `SystemMetrics` shows *"Chrome only" / "Not in this browser"* for JS heap, network, and `deviceMemory` instead of pretending Safari/Firefox report them, via a new `browser-capabilities.ts`.\n\n## Phase 2 — multi-browser CI\n\n- **Playwright matrix** — smoke tests now run on Desktop Chrome, **Firefox**, **Mobile Chrome (Pixel 5)**, and **Mobile Safari (iPhone 13/WebKit)**.\n- **Mobile Lighthouse** — a second `lighthouserc.mobile.json` config + `lighthouse-mobile` CI job catches mobile-only perf regressions.\n\n## Phase 3 — viewport & WebGL\n\n- **Safe-area / dynamic viewport** — `100dvh` and `-webkit-fill-available` audited across Hero and the 404 page so iOS Safari\'s collapsing chrome doesn\'t clip content.\n- **WebGL probe** — the 3D scene is gated behind an actual WebGL capability check, not just a preference flag.\n- **UA test coverage** — `device-parse` now recognizes Edge, Samsung Internet, and in-app browsers (LinkedIn/Facebook/Instagram), with tests to match.\n\n## Phase 4 — mobile performance\n\n- **Low-memory gating** — `isLowMemoryDevice()` (`deviceMemory` / `hardwareConcurrency`) disables the 3D scene and cuts particle counts, DPR, and antialiasing on constrained devices.\n- **Decorative-layer skip** — `BackgroundFX` drops aurora/orbs/scanlines on reduced-effect and touch-first devices.\n\n## Phase 5 — modern navigation & PWA\n\n- **View Transitions** — cross-document navigation fades via `@view-transition`, a graceful no-op on unsupported browsers.\n- **Route prefetch off** — navbar links keep `prefetch={false}` on this static export so Next.js does not eagerly preload other routes\' CSS chunks on the homepage (avoids Chrome "preloaded but not used" warnings and wasted bandwidth).\n- **Install hint** — a dismissible, `standalone`-aware `PwaInstallHint` surfaces the native install prompt.\n\n## Phase 6 — browser analytics on /status\n\n- **Browser breakdown** — `visitor-analytics` aggregates a normalized `BrowserStat` (Chrome family / Safari / Firefox / in-app / other), rendered as a share breakdown plus a *"Top browser"* metric on the Visitor Monitor.\n\n## Lint cleanup\n\nThe React Compiler-readiness lint rules in `eslint-plugin-react-hooks` v7 flagged ~40 warnings, almost all inside the react-three-fiber scene modules — mutating the three.js scene graph and refs inside `useFrame`, reading refs during render to mount pooled meshes, seeding geometry with `Math.random`. Those are **correct by design** for r3f, so the four compiler rules are scoped off for `src/components/effects/**`; the genuine warnings elsewhere (unused vars, stale disable directives, `exhaustive-deps`, `setState`-in-effect) were fixed properly. Result: **0 lint warnings**.\n'},{slug:"visitor-geo-inference-and-multi-provider-lookup",title:"Fixing unknown visitor countries: multi-provider geo and sibling inference",excerpt:"When ipwho.is fails, every visit becomes countryCode XX. Here is the fallback chain, iOS UA parsing fix, and how unresolved rows get backfilled from sibling visits.",date:"2026-07-08",tags:["Analytics","Supabase","Debugging"],ogImage:"/og/blog-visitor-geo.svg",content:`
The **/status** dashboard showed \`Unknown\` / \`XX\` for real visitors — especially iPhone Safari sessions. Two separate bugs stacked.

## Single provider fragility

Only **ipwho.is** was queried. Ad blockers, rate limits, and CI headless runs all returned failures → \`countryCode: "XX"\`.

**Fix:** sequential fallback across ipwho.is, ipapi.co, and geojs.io with a short retry pause.

## iOS mislabeled as macOS

iPhone Safari UAs contain \`like Mac OS X\`, so \`parseDevice\` reported \`Mobile \xb7 macOS\` instead of iOS. iPadOS desktop-mode UAs needed \`navigator.maxTouchPoints\` to distinguish from real Macs.

## Inference for old rows

Rows already stored as \`XX\` cannot be re-fetched by IP retroactively. Two heuristics help:

1. **Sibling inference** — if the same browser/OS/device type has a resolved visit within a time window, copy that geo.
2. **Current session** — if this browser now resolves geo, patch older unresolved rows from the same fingerprint.

LocalStorage backfill runs once per session. Supabase rows get the same patch when \`allow-geo-backfill-update.sql\` is applied.

## Display honesty

Unresolved visits show **"Location unavailable"**, are excluded from country share bars, and do not plot at \`0\xb0, 0\xb0\` on the map.
`},{slug:"resume-generation-with-playwright",title:"One HTML source, three exports: resume PDF and Word with Playwright",excerpt:"How resume.html becomes pixel-matched PDF and DOCX exports, syncs to public/ for Next.js, and auto-bumps RESUME_VERSION from git.",date:"2026-07-08",tags:["Python","Playwright","Resume","Tooling"],ogImage:"/og/blog-resume-playwright.svg",content:`
My resume lives as **one HTML file** (\`resume/resume.html\`). Everything else is generated.

## Pipeline

\`python resume/generate_resume.py\`:

1. Sync HTML to \`docs/\` and \`public/\`
2. Render PDF via Playwright + Chromium (A4, print CSS)
3. Rasterize PDF page to PNG at 220 DPI
4. Embed PNG in DOCX so Word matches PDF visually
5. Patch \`src/lib/resume.ts\` \`RESUME_VERSION\` from \`git log\` date of the HTML file

CI and deploy run the same script so live \`/resume.pdf\` never 404s.

## Why Playwright instead of wkhtmltopdf?

The resume uses modern CSS — flexbox sidebar, stroke icons, print media queries. Headless Chromium respects the same layout engine as Chrome print preview.

## Cache busting

Download links append \`?v=YYYYMMDD\` from \`RESUME_VERSION\`. Auto-deriving from git removes the manual bump step that was always forgotten after icon or address edits.

## Contact icon alignment

Lucide-style stroke SVGs at a fixed 12px column keep email, phone, LinkedIn, and GitHub labels aligned in HTML, PDF, and DOCX — verified with a small HTML regression test in CI.
`},{slug:"portfolio-v2-hardening-spa-navigation",title:"Portfolio v2 hardening: CI gates, bundle budgets, and a SPA navigation bug",excerpt:"A three-phase pass on reliability and performance — deploy gated on CI, server-component sections, Playwright smoke tests — and the subtle opacity bugs that broke the homepage on client-side navigation back from other routes.",date:"2026-07-08",tags:["Next.js","Performance","CI/CD","Debugging"],content:`
This site shipped a **v2.0 hardening pass** across deploy reliability, homepage performance, analytics honesty, and test coverage. Most of it is invisible when things work — which is the point — but one bug only showed up during real navigation: **Home → Work → Home** changed the URL correctly while parts of the homepage stayed invisible.

## Phase 0 — stop shipping broken deploys

Three production footguns were fixed first:

- **Deploy waits for CI** — the \`gh-pages\` workflow now runs only after the CI workflow succeeds on \`main\`, instead of racing it in parallel.
- **Resume binaries in the pipeline** — \`generate:resume\` (Playwright + Python) runs in CI and deploy so PDF/DOCX links don't 404 on the live site.
- **Docs and dead code** — README drift (Node 26, blog route, footer reality) was synced; the pre-Next.js \`docs-legacy/\` tree and unused Supabase server stubs were removed.

\`predev\` now runs \`generate:brand\` so local dev doesn't serve broken manifest/OG icon paths on a fresh clone.

## Phase 1 — homepage bundle diet (without breaking UX)

Four homepage sections — **About, Skills, Experience, Testimonials** — moved from client components to **server components**. Animation wrappers (\`TiltCard\`) stay client-only where interactivity is needed; the text and structure render as static HTML at build time.

A bundle gate tightened from **400 KB → 340 KB gzip** (measured baseline ~330 KB). Lighthouse performance is a **0.7 warn** on the homepage (LHCI desktop scores ~0.69–0.71 with run-to-run variance); the **bundle-size script** is the hard regression gate.

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
`},{slug:"static-portfolio-with-client-only-analytics",title:"Building a fully static portfolio with client-only visitor analytics",excerpt:"How this site runs entirely as a Next.js static export on GitHub Pages, yet still ships a live visitor map, uptime dashboard, and system telemetry — with no server at all.",date:"2026-03-14",tags:["Next.js","Static Export","Supabase","Architecture"],content:`
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
`},{slug:"debugging-backdrop-filter-android-tablets",title:"Debugging a GPU compositing bug: blank glass cards on Android tablets",excerpt:"A Redmi Pad Pro user reported 'skeleton-like' pages and misplaced shadows while scrolling. The root cause: backdrop-filter and 3D transforms don't composite reliably together on some Android GPUs.",date:"2026-06-02",tags:["CSS","Performance","Mobile","Debugging"],content:`
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
`},{slug:"hub-and-spoke-visitor-world-map",title:"From tangled lines to a hub-and-spoke visitor map",excerpt:"The status page's world map connected visitor countries sequentially, producing a tangled zig-zag instead of readable arcs. Here's how a hub-and-spoke projection fixed it.",date:"2026-05-18",tags:["Data Viz","SVG","UX"],content:`
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
`}];var c=e.i(53737);e.s(["BlogCardList",0,function({posts:e}){let d=(0,a.useMemo)(()=>(function(){let e=new Map;for(let t of l)for(let a of t.tags)e.set(a,(e.get(a)??0)+1);return[...e.entries()].sort((e,t)=>t[1]-e[1]||e[0].localeCompare(t[0])).map(([e])=>e)})(),[]),[h,u]=(0,a.useState)("all"),p=(0,a.useMemo)(()=>"all"===h?e:e.filter(e=>e.tags.includes(h)),[h,e]);return(0,t.jsxs)("div",{className:c.default.listWrap,children:[(0,t.jsxs)("div",{className:c.default.filters,role:"tablist","aria-label":"Filter posts by tag",children:[(0,t.jsx)("button",{type:"button",role:"tab","aria-selected":"all"===h,className:`${c.default.filterChip} ${"all"===h?c.default.filterActive:""}`,onClick:()=>u("all"),children:"All"}),d.map(e=>(0,t.jsx)("button",{type:"button",role:"tab","aria-selected":h===e,className:`${c.default.filterChip} ${h===e?c.default.filterActive:""}`,onClick:()=>u(e),children:e},e))]}),0===p.length?(0,t.jsx)("p",{className:c.default.empty,children:"No posts match this tag yet."}):(0,t.jsx)("div",{className:c.default.grid,children:p.map((e,a)=>(0,t.jsx)(n.FadeIn,{delay:.06*a,children:(0,t.jsxs)(s.default,{href:`/blog/${e.slug}/`,prefetch:!1,className:`glass-card ${c.default.card}`,"data-cursor":"pointer",children:[(0,t.jsxs)("div",{className:c.default.cardHead,children:[(0,t.jsx)(i.FileText,{size:18,className:c.default.icon,"aria-hidden":!0}),(0,t.jsxs)("span",{className:c.default.meta,children:[(0,t.jsx)(r.Calendar,{size:12,style:{verticalAlign:-2,marginRight:4},"aria-hidden":!0}),new Date(e.date).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})," · ",Math.max(1,Math.round(e.content.trim().split(/\s+/).length/220))," min read"]})]}),(0,t.jsx)("h2",{children:e.title}),(0,t.jsx)("p",{className:c.default.excerpt,children:e.excerpt}),(0,t.jsx)("div",{className:c.default.tags,children:e.tags.map(e=>(0,t.jsx)("span",{className:c.default.tag,children:e},e))}),(0,t.jsxs)("span",{className:c.default.cta,children:["Read post",(0,t.jsx)(o.ArrowRight,{size:16,"aria-hidden":!0})]})]})},e.slug))},h)]})}],46583)}]);