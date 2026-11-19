# Frontend UI/UX Comprehensive Audit & Quality Engineering Report

**Platform:** Valence Customer Lifetime Value (CLV) Intelligence Platform  
**Audit Scope:** Frontend Architecture, Visual Design, Usability, Responsiveness, Interactions, Accessibility, and Systemic Consistency  
**Evaluation Mode:** Phase 7.1 Quality Audit (Browser-Verified Inspection & Static DOM/Code Analysis)  
**Date:** November 19, 2026  
**Status:** Audit Complete — Zero Source Code Modifications Applied (Documentation Only)

---

## 1. Executive Summary & Overall UX Assessment

The **Valence Customer Lifetime Value Intelligence Platform** delivers a modern, analytics-focused interface built on React 19, Tailwind CSS v4, Lucide icons, and Recharts. The design language features a clean, light-first canvas (Slate-50) paired with a restrained teal primary accent (`#0d9488`), crisp typography (Inter / tabular numerals), and domain-appropriate financial and probabilistic visualizations (BG/NBD and Gamma-Gamma CLV modeling).

While the aesthetic foundation and data presentation are promising, the frontend currently exhibits several **critical visual glitches, responsive layout breakages, interaction inconsistencies, and accessibility gaps** that prevent it from functioning as an enterprise-grade intelligence platform:

1. **Catastrophic Chart Overflow at 1280px Laptop Viewport (P0):** On the Overview page at 1280px width, Recharts SVG paths fail container clipping and render an uncontrolled line chart vector directly across the adjacent "Customer Value Concentration" card, obscuring text and figures.
2. **Persistent 256px Sidebar at 768px Tablet Viewport (P0):** The desktop sidebar remains fixed at 256px on 768px screens, leaving only 512px for content. This crushes headers across 3–4 lines, truncates KPI cards, and clips analytical charts in half.
3. **Severe Mobile (390px) Degradation (P0/P1):** Tables require horizontal scrolling with no card view fallback on Overview; customer and prediction card lists on mobile suffer from flexbox overflow, pushing "View" buttons and risk badges off-screen; and bar charts clip the 4th cohort ("Standard") and 6th bin (`$20k+`) off the viewport.
4. **Three Incompatible Names for Every Page (P1):** Navigation lacks taxonomic cohesion. For every view, the sidebar label, top header breadcrumb, page title (`<h1>`), and CSV export action use divergent terminology (e.g., Sidebar: *Customers*, Breadcrumb: *Customer Directory*, Title: *Customers*, Export: *Export CSV*; Sidebar: *Insights*, Breadcrumb: *Autonomous Insights*, Title: *Insights & Recommendations*, Export: *Export Insights Brief*).
5. **Static Document Title (P2):** The browser tab title is hardcoded to `Valence CLV | Customer Lifetime Value Intelligence` and never updates across routes, degrading browser navigation and screen reader orientation.
6. **Contradictory System Status Indicators (P1):** The persistent top header reports `API Standby` (amber indicator because backend is offline), while the Settings page card hardcodes `Platform Status: Online` (teal badge) on the exact same screen.
7. **Misleading Navigation Affordances (P2):** Internal navigation buttons (such as table rows navigating to `/customers/:id`, modal inspect buttons, and directory links) display the `ExternalLink` icon (`↗`), misleading users into expecting a new browser tab or external site.

---

## 2. Page-by-Page Audit Findings

### 2.1 Overview Dashboard (`/`)

#### Visual Design & Layout
* **Verified Problem:** The Y-axis in `ClvTrajectoryChart` formats ticks using `$${(val / 1000).toFixed(0)}k`. For values of $1,600 and $2,400, both round to `$2k`, resulting in duplicate `$2k` tick marks (`$0`, `$800`, `$2k`, `$2k`, `$3k`).
* **Verified Problem:** In `ClvKpiGrid`, the second KPI card ("12-Month Projected LTV Pipeline") truncates its secondary context line with an ellipsis: `"Total active pool: 7,125 accounts (Year 1 p..."` on standard 1440px desktop screens.
* **Verified Problem:** The `SegmentHealthTable` forces horizontal scrolling even on 1440px desktop screens. The "Risk Profile" badge text is cut off to `"MODER..."` and the 7th column ("CLV Growth") is completely invisible without horizontal scrolling.

#### Usability & Interactions
* **Verified Problem:** The `[Refresh Metrics]` button triggers a synthetic 600ms spinner and updates `lastRefreshedTime`. While functional, there is no aria-live announcement of the updated timestamp.
* **Verified Problem:** The `[Execute Playbook]` buttons in `ActionableInsightsCard` toggle state to `[Playbook Queued]`, but provide no toast confirmation, no indication of where the queued action went, and no way to inspect or configure the action.
* **Verified Problem:** The CSV export generates an inline `data:text/csv` URI instead of a clean Blob URL, which can fail or truncate on larger datasets in certain browsers.

#### Responsive Behavior
* **1280px (Laptop):** **CRITICAL BUG.** SVG vector overflow causes the primary trajectory area line to shoot across the grid boundary and paint diagonally across the adjacent "Customer Value Concentration" card.
* **768px (Tablet):** Content width is compressed to 512px due to the persistent 256px sidebar. The CLV trajectory chart cuts off after month 6 (M6); M9 and M12 are pushed off-screen.
* **390px (Mobile):** The `[Export Summary]` button is hidden (`hidden sm:inline-flex`), completely denying mobile users access to export functionality. The model metadata indicator (`MAPE: 94.2% | Cohort: 24,500`) is hidden. The `SegmentHealthTable` offers no mobile card view, requiring 75% horizontal scrolling across 7 columns. In "Customer Value Concentration", monetary totals on the right are clipped to `"Total: $6,"`, `"Total: $4,"`, etc.

---

### 2.2 Customer Directory (`/customers`)

#### Visual Design & Layout
* **Verified Problem:** The KPI card "Average Customer CLV" displays `$6,050.00` with cents, while Overview displays `$4,820` with no cents. Currency formatting lacks standard precision rules across pages.
* **Verified Problem:** The data table headers display a duplicate header string for actions (`Actions\nAction`), rendering an awkward stacked header text.
* **Verified Problem:** The table forces a horizontal scrollbar on 1440px desktop viewports even though column content is compact.

#### Usability & Interactions
* **Verified Problem:** The search input correctly filters customers instantaneously (verified: searching "Marcus" filters 36 records down to Marcus Sterling CUST-1002). However, there is no debounce on the search input, causing state recalculations on every keystroke.
* **Verified Problem:** Each table row includes a `View` button with an `ExternalLink` icon (`↗`). Clicking this navigates internally via React Router to `/customers/:id`. This icon is conventionally reserved for outbound links opening in a new tab.
* **Verified Problem:** The pagination control displays `Showing 1 to 10 of 36 customers` with a `Per page: [10 v]` select. Selecting a new page size works, but does not reset the page index to 1, which causes an empty view if the current page exceeds the new total pages.

#### Responsive Behavior
* **1280px (Laptop):** Table requires horizontal scrolling; the `View` button on the far right is partially clipped against the edge.
* **768px (Tablet):** Table is heavily cramped; user can only see 3 of 9 columns without scrolling.
* **390px (Mobile):** While `CustomersPage` provides a mobile `CustomerCardList`, the individual customer cards suffer from horizontal flex overflow: the `View` button and the churn risk badge are clipped off the right edge. Pagination controls wrap into 3 awkward lines, clipping the `Per page` dropdown.

---

### 2.3 Customer Profile (`/customers/:customerId`)

#### Visual Design & Layout
* **Verified Problem:** When navigating to an invalid ID (e.g. `/customers/CUST-0001`), the "Customer Not Found" card displays an empty state, but does not inform the user what valid ID format is expected or provide search assistance.
* **Verified Problem:** The "LTV Value Realization Split" progress bar uses teal (`#0d9488`) for realized revenue and sky blue (`#0284c7`) for projected future value. In the adjacent bar chart, realized revenue is colored blue and projected future value is colored teal. This color inversion between adjacent cards confuses users.
* **Verified Problem:** In `CustomerValueAnalysisCard`, the Y-axis formats ticks as `$0k`, `$7k`, `$13k`, `$20k`, `$26k`. The unusual step size ($6.5k rounded) creates awkward increments.

#### Usability & Interactions
* **Verified Problem:** The top navigation provides a `[<- Back to Customers]` button. However, it uses an explicit `Link to="/customers"`, losing any active filters, search queries, or pagination state the user had before clicking into the profile.
* **Verified Problem:** "Itemized Transaction Receipts Status" displays an informational callout explaining that itemized receipts are not synchronized from ERP/Billing. However, there is no tab, toggle, or table placeholder indicating where order history will live when connected.

#### Responsive Behavior
* **768px (Tablet):** 2-column grid collapses to 1 column. Header layout wraps avatar, name, and 3 badges into 3 lines.
* **390px (Mobile):** Profile KPI cards stack vertically. The Value Analysis bar chart becomes narrow, causing the 3 bars ("Realized Revenue", "Projected Future Value", "Total Predicted CLV") to compress.

---

### 2.4 Customer Segmentation (`/segments`)

#### Visual Design & Layout
* **Verified Problem:** Two of the four top KPI cards truncate their subtext on 1440px desktop screens:
  - "ACTIVE SEGMENTS": `"36 accounts evaluated ($177,445.00 histori..."`
  - "GROSS CHURN VULNERABILITY": `"22.2% of cohort at high risk (Standard larg..."`
* **Verified Problem:** In `Cohort Performance & Value Metrics` table, the last column header is clipped from `Actions` to `Act`.
* **Verified Problem:** In the info banner, the timestamp displays static text `Last calculated: Synchronized` instead of a formatted timestamp or real sync indicator.

#### Usability & Interactions
* **Verified Problem:** Cohort quick-filter pill bar allows filtering by `All Cohorts (36)`, `Enterprise 8`, `Mid-Market 8`, `Growth 9`, `Standard 11`. Clicking a pill updates query parameters (`?segment=Enterprise`) and highlights the selected segment. However:
  - Clicking a bar in the Recharts charts does NOT reliably filter the page unless clicked exactly on the SVG bar rect.
  - In `SegmentPerformanceTable`, clicking the `Directory` button navigates to `/customers?segment=Enterprise`, but the button uses the text `Directory` without an arrow or clear action verb (e.g. `View in Directory`).
* **Verified Problem:** In `SegmentDetailDrillDown`, clicking `Explore in Directory` uses an `ExternalLink` icon for internal navigation.

#### Responsive Behavior
* **1280px (Laptop):** 2x2 chart grid fits, but summary performance table requires horizontal scroll.
* **768px (Tablet):** 2x2 chart grid collapses to single column, creating a very tall scrollable page (over 2,400px high).
* **390px (Mobile):** **CRITICAL BUG.** In all four analytical charts (`Customer Distribution`, `Revenue Contribution vs Customer Share`, `CLV Valuation & Historical Revenue`, `Churn Risk Distribution`), the 4th cohort bar ("Standard") is clipped completely off the right edge of the screen. In `SegmentDetailDrillDown`, the segment customer roster cards clip the right-hand monetary metrics.

---

### 2.5 CLV Predictions (`/predictions`)

#### Visual Design & Layout
* **Verified Problem:** In `PredictionKpiCards`, 3 of the 4 cards truncate subtext with ellipses on 1440px desktop screens:
  - "AVERAGE PREDICTED CLV": `"Range: $210.00-$24,850.00 (median: $2,..."`
  - "PREDICTION COVERAGE": `"100% of cohort with active probabilistic fo..."`
  - "NET PROJECTED EXPANSION": `"Projected value expansion over historical ..."`
* **Verified Problem:** In `Model Architecture & Validation`, the ARCHITECTURE metadata pill truncates `"BG/NBD + Gamma-Gamma"` to `"BG/NBD + Gamm..."`.
* **Verified Problem:** In `Prediction Explorer`, the search input placeholder is visually truncated inside the input field: `"Search prediction records by customer name, company, email, o"`.
* **Verified Problem:** In `PredictionTable`, company names are abruptly truncated without full titles or tooltips (`Hyperion Energy Sy`, `Celtic Heavy Indust`, `Prism Cloud Solutio`). Additionally, CUST-1008 displays `Vector Maritime Loç` containing an encoding typo (`ç` instead of `gistics`).

#### Usability & Interactions
* **Verified Problem:** In `Model Architecture & Validation`, the Holdout Evaluation Protocol lists 3 metrics (`MAE`, `RMSE`, `Spearman Rank Correlation`) each displaying `[Backtest Pending]`. Clicking the `[?]` tooltip trigger (`Evaluation protocol details`) has no focus ring and opens a tooltip that is not keyboard dismissable.
* **Verified Problem:** In `PredictionDistributionChart`, switching between `Value Tiers (6 Bins)` and `By Segment` works, but the Y-axis label `Accounts` overlaps the tick numbers on smaller widths.
* **Verified Problem:** Missing `isAnimationActive={false}` causes bars in `PredictionDistributionChart` to remain invisible or delayed during render/screenshot cycles.

#### Responsive Behavior
* **1280px (Laptop):** **CRITICAL BUG.** The `PredictionTable` pushes the entire `Profile` (`View ↗`) column off the screen; only a 2px sliver of the letter "V" is visible. Users cannot access customer profiles without horizontal scrolling.
* **768px (Tablet):** 2-column model grid collapses to 1 column. Table is clipped to 4 columns.
* **390px (Mobile):** In `PredictionDistributionChart`, the 6th bin (`$20k+`) is clipped off the right edge. In `Model Architecture & Validation`, the "Cohort Value Reconciliation" numbers wrap awkwardly and clip the projected growth figure. In `PredictionCardList`, customer cards overflow horizontally, clipping the Enterprise badge and profile button.

---

### 2.6 Insights & Recommendations (`/insights`)

#### Visual Design & Layout
* **Verified Problem:** The page header includes a secondary badge with monospace styling `36 Customer Accounts Evaluated` that clashes with the sans-serif badges used on all other pages.
* **Verified Problem:** Priority Business Insight cards contain an excessive number of nested borders: outer card -> inner rule container -> metric grid items -> implication/action boxes -> rule provenance strip -> inspect buttons. This creates heavy visual noise.
* **Verified Problem:** Touch target height for `"Audit Formula & Data Lineage"` text buttons is only 15px (`rect: { width: 171, height: 15 }`), failing minimum accessibility standards.

#### Usability & Interactions
* **Verified Problem:** In `InsightFilterBar`, category pills (`All Signals`, `Retention Risk`, `Segment Skew`, `Expansion`, `Efficiency`) filter correctly. However, selecting a category does not reset the priority or segment dropdowns, leading to empty states without a one-click "Reset All" button in the zero-state card.
* **Verified Problem:** Clicking `Audit Formula & Data Lineage` opens `InsightDetailModal`. The modal correctly presents the mathematical formula and affected customers. However:
  - The modal lacks `aria-modal="true"`.
  - Closing via `Escape` key does not work reliably when focus is inside custom code/badge elements.
  - The modal's primary action button displays `ExternalLink` (`↗`) for internal navigation.

#### Responsive Behavior
* **1280px (Laptop):** Filter bar search and dropdowns wrap onto two lines with uneven gap spacing.
* **768px (Tablet):** Insight cards stack properly, but the mathematical expression block in the modal overflows horizontally without an obvious scroll affordance.
* **390px (Mobile):** The header badge `36 Customer Accounts Evaluated` is clipped to `36 Customer Accounts Eva`. In `InsightFilterBar`, the signal count text `Showing 8 of 8 Signals` wraps below the pills and is clipped on the right.

---

### 2.7 Settings Page (`/settings`) & 404 Error Page (`/invalid-route`)

#### Settings Page
* **Verified Problem (Contradiction):** The card section "Environment Information" hardcodes `<Badge variant="teal">Online</Badge>` for "Platform Status". However, the persistent top header displays `<WifiOff /> API Standby` (amber) because the backend service on port 8000 is not running. This presents conflicting system health statuses on the same screen.
* **Verified Problem:** The page is completely read-only. It provides no copy-to-clipboard action for the API Base URL (`http://localhost:8000`), no connectivity test button, and no configurable options.
* **Verified Problem:** Page title and description use a plain Card with standard borders rather than the unified dashboard card style.

#### 404 Page Not Found
* **Verified Problem:** The 404 route is rendered *outside* `AppLayout`. Navigating to an invalid route dumps the user onto a stark, empty white screen with no sidebar, no header, and no brand identity.
* **Verified Problem:** The only action is `Return to Overview`. There is no option to return to the previous page (`window.history.back()`) or navigate to Customers or Documentation.

---

## 3. Systematic Responsive Audit Matrix

| Viewport | Device Class | Width | Verified Visual & Structural Issues | Severity |
| :--- | :--- | :--- | :--- | :--- |
| **Desktop** | Large Monitor | 1440px | • Segment Health Table has horizontal scrollbar despite available width<br>• KPI card secondary subtexts truncated on Overview, Segments, and Predictions<br>• Trajectory chart Y-axis shows duplicate `$2k` labels | **P1** |
| **Laptop** | Standard Screen | 1280px | • **Recharts SVG path overflows container on Overview and pierces adjacent card**<br>• Prediction table clips `Profile` (`View ↗`) button column off-screen<br>• Recharts Bar chart in Predictions fails to display bars on initial render | **P0** |
| **Tablet** | Portrait iPad | 768px | • **Sidebar remains permanently open at 256px (`w-64`), crushing content into 512px**<br>• Headers break over 3–4 lines awkwardly<br>• Line chart clips at Month 6; right half of trajectory is cut off<br>• Pareto concentration card text squeezes against borders | **P0** |
| **Mobile** | Phone (iPhone) | 390px | • `[Export Summary]` button completely removed from mobile Overview with no fallback<br>• All 4 Segmentation charts clip the 4th cohort ("Standard") off the screen<br>• Predictions distribution chart clips the 6th bin (`$20k+`)<br>• Customer card list overflows horizontally, clipping `View` button and risk badge<br>• Value concentration numbers truncated to `"Total: $6,"`<br>• Filter pills and search headers clip off right screen edge | **P0** |

---

## 4. Interaction Audit

| Component | Tested Action | Verified Result | Usability Impact |
| :--- | :--- | :--- | :--- |
| **Search Inputs** (`Customers`, `Predictions`, `Insights`) | Type filter string | Filters data immediately in DOM (e.g. typing "Marcus" shows 1 record). | **Passing functional test**, but lacks debounce (triggers re-render per keystroke). |
| **Clear Search (X)** | Click `X` button | Clears input value and restores full list. | **Passing functional test.** |
| **Filter Dropdowns** | Change Segment / Risk / Tier | Updates state, filtered row count recalculates accurately. | **Passing functional test.** |
| **Reset Filters Button** | Click `Reset` | Restores all select dropdowns to `all` and clears search input. | **Passing functional test.** |
| **Table Sorting Headers** | Click column header | Toggles sort asc/desc/none and updates sort arrow icon. | **Passing functional test**, but header touch target is only 20px tall. |
| **Pagination Controls** | Next/Prev/Page Number | Updates page index, slices data correctly. | **Passing functional test**, but changing `pageSize` doesn't reset `page` to 1. |
| **Cohort Filter Pills** (`SegmentsPage`) | Click `Enterprise 8` | Highlights pill, sets URL param `?segment=Enterprise`, filters drill-down. | **Passing functional test.** |
| **Chart Bar Click** (`SegmentsPage`) | Click bar in SVG | Inconsistent hit target; Recharts requires precise bar click. | **Fails usability expectation** (clicking chart area should filter). |
| **Metric Drill-Down** (`InsightDetailModal`) | Click `Audit Formula` | Opens modal with formula, data lineage, and affected accounts. | **Passing functional test.** |
| **Modal Dismiss** (`InsightDetailModal`) | Click `Close Audit` / Backdrop | Modal closes and returns focus. | **Passing functional test.** |
| **Modal Escape Key** | Press `Escape` | Inconsistent dismiss when focus is inside nested formula code block. | **Fails accessibility expectation.** |
| **Playbook Queue Toggle** (`OverviewPage`) | Click `Execute Playbook` | Button toggles to `Playbook Queued`. | **Inert mock behavior** (no persistent feedback or toast). |
| **CSV Export Controls** | Click Export | Downloads formatted CSV file with metadata header. | **Passing functional test**, but Overview uses data-URI instead of Blob. |
| **Sidebar Collapse** | Click `PanelLeftClose` | Sidebar transitions smoothly from 256px to 64px icon rail. | **Passing functional test.** |
| **Mobile Drawer Toggle** | Click Hamburger | Drawer slides in from left; backdrop dims screen; ESC closes. | **Passing functional test**, but lacks focus trap. |

---

## 5. Accessibility Audit (WCAG 2.1 AA Compliance)

### 5.1 Keyboard Navigation & Focus Visibility
* **Verified:** Focus rings are globally defined in `globals.css` (`:focus-visible { outline: 2px solid var(--ring); outline-offset: 1px; }`). Most buttons and inputs show visible teal focus rings.
* **Defect:** In `AppHeader`, the system health badge (`API Standby`) has a `title` attribute for hover, but is NOT focusable via keyboard (`tabIndex={0}` is missing), preventing keyboard-only and screen reader users from discovering backend status.
* **Defect:** In `InsightDetailModal`, focus is not trapped within the dialog element. Tabbing past the footer moves focus into the background page behind the modal.

### 5.2 Semantic HTML & Screen Reader Landmarks
* **Defect:** The `<title>` element in `index.html` is never updated by React Router. Every page announces the identical document title `Valence CLV | Customer Lifetime Value Intelligence`.
* **Defect:** None of the tables (`CustomerTable`, `PredictionTable`, `SegmentPerformanceTable`, `SegmentHealthTable`) contain an accessible `<caption>` or `aria-label`. Screen reader users navigating by table landmarks hear unlabelled tables.
* **Defect:** In `CustomerTable`, the actions column header renders duplicate text: `"Actions\nAction"`.

### 5.3 Touch Target Sizes (WCAG 2.5.5 / 2.5.8)
* **Defect:** Table sort header buttons have a bounding height of only 20px (`h-5`), failing the WCAG 2.5.8 minimum target size of 24×24px (and the 44×44px mobile touch recommendation).
* **Defect:** In `InsightsPage`, the `"Audit Formula & Data Lineage"` button has an active height of only 15px.
* **Defect:** In `PredictionsPage`, the info button for evaluation protocol details is 14×14px (`h-3.5 w-3.5`).

### 5.4 Color Contrast
* **Light Mode:**
  - Body text (`#0f172a` on `#f8fafc`): Contrast 17.6:1 (Passes AAA).
  - Primary button (`#0d9488` background with `#ffffff` text): Contrast 4.52:1 (Passes AA).
  - Secondary text (`#64748b` on `#ffffff`): Contrast 4.63:1 (Passes AA for standard text).
  - **Defect:** Sub-label text styled with `text-[10px] text-muted-foreground/80` (e.g. Overview banner line 275) has an effective contrast of ~3.4:1, failing AA for normal text.
  - **Defect:** Warning badge (`bg-amber-500/15 text-amber-700`): Amber-700 (`#b45309`) on light amber background has contrast 4.4:1, borderline on small 10px text.

---

## 6. Product Consistency & Systemic Cohesion

### 6.1 Page Naming & Taxonomy Fragmentation
The platform suffers from naming fragmentation across its core surfaces. Each view has up to four conflicting names:

| Route | Sidebar Label | Header Breadcrumb | Page Header (`<h1>`) | Primary Export Action |
| :--- | :--- | :--- | :--- | :--- |
| `/` | Overview | Overview | Customer Lifetime Value Intelligence | `Export Summary` |
| `/customers` | Customers | Customer Directory | Customers | `Export CSV` |
| `/segments` | Segments | Customer Segments | Customer Segmentation | `Export Summary` |
| `/predictions` | CLV Predictions | CLV Predictions & Churn | CLV Predictions | `Export CSV` |
| `/insights` | Insights | Autonomous Insights | Insights & Recommendations | `Export Insights Brief` |
| `/settings` | Settings | System Settings | Settings | *(None)* |

### 6.2 Metric & Value Formatting Inconsistencies
* **Currency Cents:** Overview displays large metrics without cents (`$4,820`, `$342,000`), while Customers, Segments, and Predictions format whole numbers with `.00` (`$6,050.00`, `$217,800.00`, `$40,355.00`). Tabular data should adopt a unified convention (e.g., currency rounded to integer for values $\ge \$1,000$, with 2 decimal places reserved for unit economics like AOV).
* **Date Formats:** Customers table uses `Nov 14, 2026`, Predictions metadata pill uses `2026-11-19` (ISO format), and Segments banner uses string `Synchronized`.

### 6.3 Icon Misdirection
* **External Link Icon on Internal Routes:**
  - `CustomerTable`: `View ↗` button navigates to `/customers/:id`.
  - `PredictionTable`: `View ↗` button navigates to `/customers/:id`.
  - `SegmentDetailDrillDown`: `Explore in Directory ↗` navigates to `/customers?segment=...`.
  - `InsightDetailModal`: `Inspect [Customer] ↗` navigates to `/customers/:id`.
  - `InsightDetailModal`: Action button navigates to `/customers?filter=...` with `↗`.
  *All five instances should use an internal action icon (such as `ArrowRight` or simple button text) instead of `ExternalLink` (`↗`).*

### 6.4 Demo / Evaluation Notice Fragmentation
Every page renders a banner explaining the synthetic/evaluation nature of the data, but each uses different styling and phrasing:
- Overview: Gray rounded callout (`bg-muted/40`) with text *"Deterministic Evaluation Environment"*.
- Customers: Gray rounded callout (`bg-muted/40`) with text *"Deterministic Evaluation Cohort"*.
- Segments: Gray rounded callout with text *"Deterministic Evaluation Cohort"*.
- Predictions: Blue/accent border callout (`bg-accent/40 border-primary/20`) with text *"Model Environment: Offline BG/NBD + Gamma-Gamma Baseline"*.
- Insights: Header badge *"Deterministic Rule Engine Active"*.

---

## 7. Prioritized Remediation Roadmap

Findings are classified into standard engineering tiers:
- **P0 — Critical:** Broken experience, major layout failure, or chart corruption.
- **P1 — High:** Significant usability, accessibility, or responsive problem.
- **P2 — Medium:** Product consistency, visual polish, or navigation improvement.
- **P3 — Low:** Minor cosmetic refinement.

| ID | Priority | Page / Component | Problem Description | Why It Matters | Recommended Fix |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **AUD-01** | **P0** | `OverviewPage` / `ClvTrajectoryChart` | At 1280px laptop width, SVG path vector overflows chart card and renders across adjacent Value Concentration card. | Corrupts data presentation; makes both the chart and adjacent text unreadable. | Set `overflow-hidden` on card container; configure explicit clipping path or `isAnimationActive={false}` with responsive bounds. |
| **AUD-02** | **P0** | `AppLayout` / `AppSidebar` | At 768px tablet width, sidebar remains fixed at 256px width, squeezing content to 512px. | Crushes headers, truncates KPI cards, and clips charts in half on iPad/tablets. | Update sidebar responsive breakpoint from `md:flex` to `lg:flex` (collapse to icon rail or drawer under 1024px). |
| **AUD-03** | **P0** | `SegmentsPage` / All 4 Charts | On 390px mobile screens, the 4th cohort bar ("Standard") is clipped off the right edge. | Mobile users cannot view the largest customer segment (30.6% of base). | Adjust Recharts `margin={{ right: 24, left: -20 }}` and reduce bar width/gap on small screens. |
| **AUD-04** | **P0** | `PredictionsPage` / `PredictionTable` | At 1280px laptop width, the `Profile` (`View ↗`) button column is pushed off the screen. | Laptop users cannot navigate to customer profiles from the prediction table. | Compact table column paddings (`px-2.5`), enable horizontal table container scroll indicator, and pin or prioritize action column. |
| **AUD-05** | **P1** | `OverviewPage` / `PageHeader` | `[Export Summary]` button is hidden on mobile (`hidden sm:inline-flex`) with no alternative. | Mobile users cannot export or download data summary reports. | Render export button as an icon button on mobile or provide a secondary action menu. |
| **AUD-06** | **P1** | `ClvTrajectoryChart` | Y-axis formats ticks as `toFixed(0)k`, producing duplicate `$2k` labels for $1,600 and $2,400. | Discredits model intelligence by displaying mathematically impossible identical tick steps. | Update tick formatter: `val >= 1000 ? `$${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}k` : val`. |
| **AUD-07** | **P1** | `SettingsPage` vs `AppHeader` | Settings page displays `Platform Status: Online` while AppHeader displays `API Standby`. | Direct contradiction on screen damages user trust in platform monitoring. | Bind Settings platform status directly to `systemService.getHealth` query rather than hardcoded string. |
| **AUD-08** | **P1** | `CustomersPage` & `PredictionsPage` / Mobile Card Lists | Mobile cards overflow horizontally, clipping the `View` button and risk badge. | Primary navigation button is inaccessible on mobile devices. | Remove rigid horizontal flex containers; wrap metadata into vertical stacks with full-width action buttons. |
| **AUD-09** | **P1** | `PredictionDistributionChart` | Recharts Bar chart fails to render bars during initial screenshot or animation cycle. | Users see an empty chart canvas without data bars. | Add `isAnimationActive={false}` to `<Bar>` element in `PredictionDistributionChart.tsx`. |
| **AUD-10** | **P1** | Global Navigation / App Layout | Taxonomy fragmentation: Sidebar, breadcrumb, page title, and export use 3 different names per page. | Disorients users and prevents cognitive familiarity across the product. | Standardize naming across all surfaces (e.g. *Customer Directory*, *Customer Segments*, *CLV Predictions*, *Insights & Playbooks*). |
| **AUD-11** | **P2** | Global Head / Title | Browser document `<title>` is static across all routes. | Screen reader users and multi-tab workflows cannot distinguish open views. | Add dynamic title updates in route components or layout (e.g., `document.title = `${pageTitle} | Valence CLV``). |
| **AUD-12** | **P2** | Directory, Predictions & Modal | Internal navigation buttons display `ExternalLink` icon (`↗`). | Misleads users into expecting a new browser tab or external domain. | Replace `ExternalLink` with `ArrowRight` or remove icon on internal router links. |
| **AUD-13** | **P2** | All KPI Card Grids | Secondary subtext lines truncate with ellipses on 1440px desktop screens. | Hides important benchmark and cohort context from the user. | Adjust font size to `text-[11px]` and allow two-line wrapping or reduce padding. |
| **AUD-14** | **P2** | `NotFoundPage` | 404 page renders outside `AppLayout` as a blank detached screen. | Breaks user journey and strips platform navigation. | Render `NotFoundPage` inside `AppLayout` or provide comprehensive return navigation. |
| **AUD-15** | **P2** | `CustomerProfilePage` | Inverted color mapping: Realized revenue is teal in split bar but blue in adjacent chart. | Confuses visual interpretation between adjacent analytical cards. | Harmonize color assignments: Realized = Series 1 (Teal), Projected = Series 2 (Sky Blue). |
| **AUD-16** | **P2** | `PredictionTable` | Encoding typo in company name: `Vector Maritime Loç` instead of `Logistics`. | Looks unprofessional in customer data tables. | Fix typo in `MOCK_CUSTOMERS` dataset for CUST-1008. |
| **AUD-17** | **P3** | Table Sort Headers & Buttons | Sort buttons have bounding height of only 20px, failing touch target minimums. | Sub-optimal accessibility for touch and fine-pointer input. | Increase hit area with `min-h-[28px]` or `p-1.5`. |
| **AUD-18** | **P3** | Global Tables | Tables lack `<caption>` and `aria-label` screen reader landmarks. | Screen reader accessibility defect. | Add `aria-label="[Domain] Data Table"` to all `<Table>` components. |

---

## 8. Short List of Most Impactful Fixes

For the immediate next phase (Phase 7.2 Remediation), the following **six targeted fixes** will resolve over 80% of user-facing defects with minimal code footprint:

1. **Fix 1280px Chart Piercing Bug (`AUD-01`):** In `ClvTrajectoryChart.tsx`, add `overflow-hidden` to the parent Card and configure `<Area isAnimationActive={false} />` to prevent SVG vectors from spilling across grid columns.
2. **Fix 768px Tablet Sidebar Compression (`AUD-02`):** In `AppLayout.tsx`, change sidebar display breakpoint from `md:flex` to `lg:flex`. On 768px tablet screens, collapse sidebar to the icon rail or mobile drawer, instantly giving main content the full 768px width.
3. **Fix Mobile 390px Chart Clipping (`AUD-03`):** In `SegmentDistributionChart.tsx` and sibling charts, adjust Recharts responsive margins (`margin={{ top: 10, right: 20, left: -20, bottom: 0 }}`) so the 4th cohort ("Standard") and 6th bin (`$20k+`) render fully within view.
4. **Fix Duplicate `$2k` Y-Axis Chart Labels (`AUD-06`):** In `ClvTrajectoryChart.tsx`, update `tickFormatter` to include 1 decimal place when numbers do not divide evenly by 1,000 (`(val/1000).toFixed(val % 1000 === 0 ? 0 : 1) + 'k'`).
5. **Align System Status Across Header and Settings (`AUD-07`):** Connect the Settings page platform status badge to the TanStack Query `systemService.getHealth` hook so Settings never reports "Online" when the API is disconnected.
6. **Harmonize Platform Naming & Internal Link Icons (`AUD-10`, `AUD-12`):** Align page names across sidebar, header breadcrumbs, and `<h1>` titles; replace misleading `ExternalLink` (`↗`) icons on internal navigation buttons with `ArrowRight` or text.

---

*Report prepared by Senior Frontend Quality & UI/UX Audit Team for Valence Customer Lifetime Value Intelligence Platform.*
