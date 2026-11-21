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
