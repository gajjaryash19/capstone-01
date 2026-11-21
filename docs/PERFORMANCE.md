# Valora Frontend Performance Optimization

This document tracks performance optimizations, bundle analysis, and Core Web Vitals measurements across each phase of the optimization plan.

---

## Baseline (Phase 0)

All baseline measurements were collected under standard evaluation conditions:
- **Build toolchain**: Vite 8.3.8 + Rolldown (`npm run build` in `/frontend`)
- **Server**: `vite preview` running on `http://127.0.0.1:4173`
- **Lighthouse**: v13.6.0 CLI running mobile preset (`formFactor: mobile`, simulated network and CPU throttling, headless Chrome)

---

### 1. Build Chunk Inventory (`vite build`)

Total chunks emitted by production build:

| Chunk File | Resource Type | Raw Size | Gzip Size | Notes / Content |
| :--- | :--- | :--- | :--- | :--- |
| `dist/assets/index-DjtP1SEb.js` | JS | 686.95 kB (686,954 B) | 221.18 kB (221,183 B) | **Entry Chunk** (Includes React, Router, GSAP, ScrollTrigger, Lenis, and LandingPage eager import) |
| `dist/assets/useChartTheme-BhBbx-5m.js` | JS | 393.06 kB (393,056 B) | 111.05 kB (111,046 B) | Recharts library & chart theme wrapper |
| `dist/assets/index-E1kLBm0F.css` | CSS | 81.76 kB (81,762 B) | 13.65 kB (13,652 B) | Global Tailwind CSS stylesheet |
| `dist/assets/OverviewPage-D4eWHeOh.js` | JS | 61.86 kB (61,864 B) | 16.84 kB (16,841 B) | Overview route view |
| `dist/assets/customers-XqxH93jW.js` | JS | 56.55 kB (56,549 B) | 12.54 kB (12,538 B) | Customer data & query definitions |
| `dist/assets/SegmentsPage-CPwDgyzJ.js` | JS | 51.91 kB (51,911 B) | 11.25 kB (11,250 B) | Segments route view |
| `dist/assets/AppLayout-CyjSnH8K.js` | JS | 51.62 kB (51,621 B) | 15.05 kB (15,047 B) | Authenticated application layout & navigation shell |
| `dist/assets/InsightsPage-B_Acl7uj.js` | JS | 47.55 kB (47,548 B) | 9.97 kB (9,968 B) | Insights route view |
| `dist/assets/segmentAnalytics-COIhLuXW.js` | JS | 43.45 kB (43,446 B) | 13.70 kB (13,698 B) | Segment analysis domain logic |
| `dist/assets/PredictionsPage-Da24JTw1.js` | JS | 40.52 kB (40,518 B) | 9.40 kB (9,403 B) | Predictions route view |
| `dist/assets/vendor-icons-DmrbW_On.js` | JS | 29.94 kB (29,942 B) | 10.32 kB (10,324 B) | Lucide React icons manual chunk |
| `dist/assets/insightsAnalytics-DfphTq5b.js` | JS | 28.39 kB (28,389 B) | 9.27 kB (9,268 B) | Insight calculations & analytics utilities |
| `dist/assets/utils-T5_d3BFw.js` | JS | 28.01 kB (28,007 B) | 8.86 kB (8,864 B) | Shared application helpers & query client setup |
| `dist/assets/Combination-CeQ6ADJF.js` | JS | 13.20 kB (13,196 B) | 5.06 kB (5,063 B) | UI filter combinations & primitives |
| `dist/assets/system-C3S2r7UL.js` | JS | 8.47 kB (8,465 B) | 3.21 kB (3,207 B) | System monitoring / status indicators |
| `dist/assets/SignupPage-Bq28oXEs.js` | JS | 7.01 kB (7,007 B) | 2.16 kB (2,157 B) | Signup auth route |
| `dist/assets/SettingsPage-DzdHsR6D.js` | JS | 6.07 kB (6,069 B) | 1.89 kB (1,892 B) | Settings route view |
| `dist/assets/ResetPasswordPage-CR7-Oxbi.js` | JS | 5.24 kB (5,238 B) | 1.78 kB (1,779 B) | Password reset route |
| `dist/assets/LoginPage-ClI4wqF_.js` | JS | 4.61 kB (4,605 B) | 1.66 kB (1,659 B) | Login auth route |
| `dist/assets/CustomersPage-B2Quec07.js` | JS | 4.57 kB (4,573 B) | 1.65 kB (1,654 B) | Customers list route view |
| `dist/assets/ForgotPasswordPage-DzluXrbg.js` | JS | 4.24 kB (4,242 B) | 1.53 kB (1,529 B) | Forgot password route |
| `dist/assets/AppLayout-DRX0hDpa.css` | CSS | 3.82 kB (3,822 B) | 1.12 kB (1,116 B) | AppLayout scoped styles |
| `dist/assets/Symbols-DJjIP3o0.js` | JS | 3.49 kB (3,490 B) | 1.57 kB (1,571 B) | Chart symbols and glyph components |
| `dist/index.html` | HTML | 2.62 kB (2,620 B) | 1.04 kB (1,038 B) | Entry HTML file |
| `dist/assets/Table-Bwxro_UM.js` | JS | 1.98 kB (1,975 B) | 0.74 kB (739 B) | Shared Table UI component |
| `dist/assets/CustomerProfilePage-CZpvnSfe.js` | JS | 1.82 kB (1,815 B) | 0.80 kB (800 B) | Customer detail profile route view |
| `dist/assets/Input-BXg53IlK.js` | JS | 1.81 kB (1,810 B) | 0.86 kB (857 B) | Shared Input UI component |
| `dist/assets/Card-CBrYvxxa.js` | JS | 1.38 kB (1,377 B) | 0.59 kB (589 B) | Shared Card UI component |
| `dist/assets/Badge-DWIT2vjN.js` | JS | 1.34 kB (1,338 B) | 0.56 kB (562 B) | Shared Badge UI component |
| `dist/assets/NotFoundPage-BmvXnMu9.js` | JS | 1.16 kB (1,156 B) | 0.56 kB (559 B) | 404 page route |
| `dist/assets/PageHeader-Bs8dc6_P.js` | JS | 0.84 kB (843 B) | 0.45 kB (450 B) | Shared PageHeader UI component |
| `dist/assets/rolldown-runtime-XKyaHtl9.js` | JS | 0.73 kB (726 B) | 0.43 kB (429 B) | Rolldown runtime module loader |
| `dist/assets/motion-QEAV1sPb.js` | JS | 0.57 kB (571 B) | 0.35 kB (345 B) | Motion utility stub |

**Critical Observation**: `index-DjtP1SEb.js` is **686.95 kB raw / 221.18 kB gzip**, containing LandingPage, GSAP, ScrollTrigger, and Lenis.

---

### 2. Cold Visit JavaScript Payload

Total JS loaded on initial cold page loads (including route-triggered prefetching):

| Route | Cold Load Chunks Transferred | Total JS Raw Size | Total JS Transfer (Wire) |
| :--- | :--- | :--- | :--- |
| **`/` (Landing)** | `index-*.js`, `rolldown-runtime-*.js`, `vendor-icons-*.js`, `utils-*.js`, plus prefetched `LoginPage-*.js`, `Input-*.js`, `SignupPage-*.js` | **741.3 kB** (759,051 B) | **242.7 kB** (248,484 B) |
| **`/login`** | `index-*.js`, `rolldown-runtime-*.js`, `vendor-icons-*.js`, `utils-*.js`, `LoginPage-*.js`, `Input-*.js` | **734.4 kB** (752,044 B) | **240.2 kB** (245,957 B) |
| **`/app` (Overview)** | Entry bundles + `AppLayout-*.js`, `OverviewPage-*.js`, `useChartTheme-*.js` (Recharts), and prefetched workspace views | **1,527.6 kB** (1,564,238 B) | **465.5 kB** (476,716 B) |

*Note: For a pure `/login` visit, 221.7 kB of transfer (90% of all JS) is entirely consumed by the entry bundle carrying GSAP and the Landing Page.*

---

### 3. Lighthouse Performance Baseline

Simulated mobile throttling (`formFactor: mobile`, network: Slow 4G / 150 ms RTT / 1.6 Mbps down / 750 kbps up, CPU: 4x slowdown):

| Target Route | Performance Score | LCP (Largest Contentful Paint) | TBT (Total Blocking Time) | CLS (Cumulative Layout Shift) | Total Transfer Size |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`/` (Landing)** | **69** | **4.65 s** | **358 ms** | **0.001** | **724.0 kB** (741,363 B) |
| **`/login`** | **75** | **4.08 s** | **329 ms** | **0.000** | **370.7 kB** (379,576 B) |
| **`/app/customers`** | **69** | **5.75 s** | **374 ms** | **0.001** | **597.5 kB** (611,814 B) |
| **`/app` (Overview)** | **59** | **6.25 s** | **355 ms** | **0.197** | **597.5 kB** (611,814 B) |

---

### Key Bottlenecks Identified for Subsequent Phases

1. **Phase 1 Target**: Eager loading of `LandingPage` in `router.tsx` pollutes the entry chunk for all routes with GSAP, ScrollTrigger, and Lenis (687 kB raw / 221 kB gzip). `/login` and `/app` should not load this code.
2. **Phase 2 Target**: Product showcase images on the landing page are unoptimized PNGs (269–440 kB each), delaying LCP and inflating total payload.
3. **Phase 3 Target**: Google Fonts `<link>` tags in `index.html` block rendering via external network requests to `fonts.googleapis.com` and `fonts.gstatic.com`.
4. **Phase 4 Target**: Landing hero animations hide the H1 with `opacity: 0` inside `useEffect`, holding back LCP until JS initializes and the animation sequence triggers.
5. **Phase 5 Target**: Heavy dashboard components and Recharts vendor cost (393 kB raw) load upfront with unmemoized renders and prefetching overhead.

---

## Phase 1 — Stop Shipping Landing Page to Everyone

### Objectives & Strategy
1. **Lazy-load `LandingPage`**: Extracted LandingPage from the synchronous entry graph into its own dynamic chunk. Reused `routeLoaders.landing()` on root load and pointer hover to eliminate Suspense fallback flashing.
2. **Eliminate `@/lib/motion` barrel imports**: Extracted lightweight media query detection (`prefersReducedMotion`, `isTouchOrMobileDevice`) into a standalone `device.ts` with zero animation dependencies. Migrated `LineSidebar.tsx` and all landing components to explicit subpath imports so GSAP and Lenis are strictly quarantined inside the landing bundle.
3. **Rolldown Chunk Optimization**: Configured `build.rolldownOptions.output.codeSplitting.groups` for separate stable chunks:
   - `vendor-react`: `react`, `react-dom`, `scheduler` (218.8 kB raw / 68.3 kB gzip)
   - `vendor-router`: `react-router`, `react-router-dom`, `@remix-run/router` (39.3 kB raw / 14.1 kB gzip)
   - `vendor-query`: `@tanstack/react-query`, `@tanstack/query-core` (33.0 kB raw / 9.8 kB gzip)
   - `vendor-utils`: `clsx`, `tailwind-merge` (27.5 kB raw / 8.7 kB gzip)
   - `vendor-recharts`: `recharts`, `victory-vendor`, `d3-*` (457.9 kB raw / 128.1 kB gzip)
   - `vendor-gsap-lenis`: `gsap`, `lenis` (132.0 kB raw / 49.5 kB gzip)
   - `vendor-supabase`: `@supabase/supabase-js` (dynamic)
   - `vendor-icons`: `lucide-react` (22.2 kB raw / 7.5 kB gzip)
4. **Isolate Recharts from Non-Chart Routes**: De-coupled `CustomersPage` from the customers barrel that re-exported `CustomerValueAnalysisCard`. Recharts now loads strictly on the four chart views (`Overview`, `Segments`, `Predictions`, `Insights`) and customer profile.
5. **Evaluate `LazyMotion`**: Evaluated replacing `motion` with `m` + `LazyMotion` + `domAnimation`. Because entry JS gzip fell to **74.84 kB** (far below the 120 kB acceptance threshold), refactoring 15 components across the dashboard was evaluated and skipped to avoid any regression in route exit presence, and will be tackled alongside runtime profiling in Phase 5.

---

### Key Chunk Comparison (Before vs. After Phase 1)

| Chunk Role / Package | Baseline (Phase 0) | Phase 1 | Change |
| :--- | :--- | :--- | :--- |
| **Entry JS Bundle** (`index-*.js`) | 686.95 kB raw / 221.18 kB gzip | **222.89 kB raw / 74.84 kB gzip** | **-67.6% (-146.34 kB gzip)** |
| **Landing View Chunk** | Bundled in entry | **54.89 kB raw / 12.54 kB gzip** | Fully isolated |
| **GSAP & Lenis Chunk** | Bundled in entry | **131.98 kB raw / 49.48 kB gzip** | Fully isolated to landing |
| **React Vendor Chunk** | Bundled in entry | **218.75 kB raw / 68.27 kB gzip** | Stable cached vendor |
| **Router Vendor Chunk** | Bundled in entry | **39.33 kB raw / 14.08 kB gzip** | Stable cached vendor |
| **Query Vendor Chunk** | Bundled in entry | **33.00 kB raw / 9.84 kB gzip** | Stable cached vendor |
| **Recharts Vendor Chunk** | 393.06 kB raw / 111.05 kB gzip | **457.93 kB raw / 128.13 kB gzip** | Isolated from cold entry/auth |

---

### Cold Visit JS Transfer Payload (Before vs. After)

| Route | Baseline JS Transfer (Wire) | Phase 1 JS Transfer (Wire) | Payload Reduction |
| :--- | :--- | :--- | :--- |
| **`/login` (Auth Entry)** | 240.2 kB (245,957 B) | **186.1 kB** (190,569 B) | **-22.5% (-54.1 kB)** |
| **`/` (Landing Page)** | 242.7 kB (248,484 B) | **250.1 kB** (256,074 B) | Chunks split into parallel requests |
| **`/app` (Overview)** | 465.5 kB (476,716 B) | **406.6 kB** (416,345 B) | **-12.7% (-58.9 kB)** |
| **`/app/customers`** | 465.5 kB (476,716 B) | **406.6 kB** (416,345 B) | **-12.7% (-58.9 kB)** |

*Acceptance Threshold*: Cold entry JS gzip < 120 kB. Real achieved entry bundle: **74.84 kB gzip** (**PASSED**).

---

### Lighthouse Metrics Comparison (Mobile Preset, Simulated Throttling)

| Route | Metric | Baseline (Phase 0) | Phase 1 | Improvement |
| :--- | :--- | :--- | :--- | :--- |
| **`/login`** | Performance Score | 75 | **89** | **+14 points** |
| | LCP | 4.08 s | **3.34 s** | **-740 ms (-18.1%)** |
| | TBT | 329 ms | **197 ms** | **-132 ms (-40.1%)** |
| | Total Transfer Size | 370.7 kB | **316.7 kB** | **-54.0 kB (-14.6%)** |
| **`/` (Landing)** | Performance Score | 69 | **69** | Stable (hero animation LCP target for Phase 4) |
| | LCP | 4.65 s | **4.08 s** | **-570 ms (-12.3%)** |
| | Total Transfer Size | 724.0 kB | **422.1 kB** | **-301.9 kB (-41.7%)** |
| **`/app/customers`** | Performance Score | 69 | **70** | +1 point |
| | LCP | 5.75 s | **4.91 s** | **-840 ms (-14.6%)** |
| | Total Transfer Size | 597.5 kB | **538.6 kB** | **-58.9 kB (-9.9%)** |

