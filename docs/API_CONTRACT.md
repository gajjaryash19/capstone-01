# API Contract — CLV Intelligence Platform

> **Status: PROPOSED — NOT IMPLEMENTED**
> This document defines the agreed-upon interface between the frontend and the backend that
> does not exist yet. Every endpoint below is a planning artefact. No backend code should be
> written to match it until the team reviews and signs off.
>
> **Last updated:** 2026-11-19
> **Authors:** Frontend team (Phase 6.1 planning)
> **Review required from:** Backend team, ML team, full team for open questions

---

## Table of Contents

1. [API Conventions](#1-api-conventions)
2. [Base URL & Versioning](#2-base-url--versioning)
3. [Authentication](#3-authentication)
4. [Pagination & Filtering Conventions](#4-pagination--filtering-conventions)
5. [Error Response Format](#5-error-response-format)
6. [Shared Type Definitions](#6-shared-type-definitions)
7. [Endpoints](#7-endpoints)
   - [7.1 Dashboard Overview](#71-dashboard-overview)
   - [7.2 Customers](#72-customers)
   - [7.3 Segmentation](#73-segmentation)
   - [7.4 CLV Predictions](#74-clv-predictions)
   - [7.5 Insights & Recommendations](#75-insights--recommendations)
   - [7.6 System / Model Metadata](#76-system--model-metadata)
8. [Frontend-to-Backend Field Mapping](#8-frontend-to-backend-field-mapping)
9. [Frontend-Calculated Fields (Do Not Return from Backend)](#9-frontend-calculated-fields-do-not-return-from-backend)
10. [Data Relationships](#10-data-relationships)
11. [ML Dependencies & Unknowns](#11-ml-dependencies--unknowns)
12. [Open Questions Requiring Team Decisions](#12-open-questions-requiring-team-decisions)

---

## 1. API Conventions

| Convention | Rule |
|---|---|
| **Protocol** | HTTPS in production; HTTP only on `localhost` |
| **Data format** | JSON (`Content-Type: application/json`) |
| **Field naming** | `camelCase` for all JSON keys |
| **Dates** | ISO 8601 strings: `YYYY-MM-DD` for dates, `YYYY-MM-DDTHH:MM:SSZ` for timestamps |
| **Monetary values** | Plain `number` (USD), no currency symbols, no formatting |
| **Probabilities** | `number` in range `0.0–1.0` (not 0–100) |
| **Percentages** | `number` in range `0.0–100.0` |
| **IDs** | `string` — format `CUST-XXXX` for customers; opaque strings for all others |
| **Enums** | Lowercase snake_case strings (e.g. `"high"`, `"mid_market"`) unless a specific value is documented |
| **Null vs. absent** | Absent field = not applicable; `null` = known but not yet available |
| **Boolean** | `true` / `false`, never `0` / `1` |
| **HTTP verbs** | Only `GET` in Phase 1 (read-only). `POST` / `PATCH` reserved for future phases |

---

## 2. Base URL & Versioning

```
http://localhost:8000          ← development (matches VITE_API_BASE_URL default)
https://api.clv.example.com   ← production (TBD — see open questions)
```

All endpoints are prefixed with `/api/v1/`.

**Example:** `GET /api/v1/customers`

The frontend reads `VITE_API_BASE_URL` from `.env`. The `api-client.ts` already appends the endpoint path, so the backend base prefix must remain at the root of the configured URL.

---

## 3. Authentication

> **Open question** — authentication strategy not decided. See [Section 12](#12-open-questions-requiring-team-decisions).

For now: **no authentication header required** in the local development phase.
When auth is added, the convention will be `Authorization: Bearer <token>` in the request header.

---

## 4. Pagination & Filtering Conventions

### 4.1 Pagination Query Parameters

All list endpoints that can return large sets support cursor-less, offset-based pagination:

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | `integer` | `1` | 1-based page number |
| `pageSize` | `integer` | `10` | Records per page (max: `100`) |

### 4.2 Paginated Response Envelope

```jsonc
{
  "items": [ /* array of records */ ],
  "total": 36,       // total matching records (before pagination)
  "page": 1,
  "pageSize": 10,
  "totalPages": 4
}
```

> This matches the existing `PaginatedResponse<T>` generic in `src/types/common.ts`.

### 4.3 Filtering Query Parameters

Filter parameters are passed as query strings. Unknown/invalid filter values should be **ignored** by the backend (not rejected), so the frontend never crashes on backend additions.

### 4.4 Sorting Query Parameters

| Parameter | Type | Description |
|---|---|---|
| `sort` | `string` | Field name to sort by |
| `dir` | `"asc"` \| `"desc"` | Sort direction (default: `desc`) |

### 4.5 Search

Full-text search over customer-facing string fields:

| Parameter | Type | Description |
|---|---|---|
| `q` | `string` | Searches `name`, `email`, `company`, `id` |

---

## 5. Error Response Format

All errors use standard HTTP status codes plus a consistent JSON body:

```jsonc
{
  "error": {
    "code": "CUSTOMER_NOT_FOUND",        // machine-readable constant
    "message": "Customer CUST-9999 was not found.",  // human-readable
    "field": null                        // populated for validation errors; null otherwise
  }
}
```

### Standard HTTP Status Codes Used

| Code | Meaning |
|---|---|
| `200` | OK |
| `400` | Bad Request (invalid query parameter type, missing required field) |
| `404` | Resource not found |
| `422` | Unprocessable entity (valid JSON, but fails business validation) |
| `500` | Internal Server Error |
| `503` | Service Unavailable (ML model not ready) |

---

## 6. Shared Type Definitions

These type aliases are used throughout the endpoint schemas below.

```typescript
// Enums
type CustomerSegment = "Enterprise" | "Mid-Market" | "Growth" | "Standard"
type ChurnRiskLevel  = "low" | "moderate" | "high"
type CustomerStatus  = "active" | "at-risk" | "dormant"

// Monetary + numeric primitives
type Money       = number  // USD, no symbol
type Probability = number  // 0.0 – 1.0
type Percentage  = number  // 0.0 – 100.0
```

### 6.1 `CustomerRecord`

The canonical customer object returned by the backend. It is the shared base for the Customer Directory, Customer Profile, Predictions, Segmentation, and Insights pages.

```typescript
interface CustomerRecord {
  id:                 string           // "CUST-1001"
  name:               string
  email:              string
  company:            string
  segment:            CustomerSegment
  status:             CustomerStatus
  predictedClv:       Money
  historicalRevenue:  Money
  totalOrders:        number           // integer
  averageOrderValue:  Money
  lastPurchaseDate:   string           // "YYYY-MM-DD"
  joinedDate:         string           // "YYYY-MM-DD"
  churnRisk:          ChurnRiskLevel
  churnProbability:   Probability      // 0.0 – 1.0
}
```

> **Note:** `avatarInitials` is derived on the frontend from `name` — do NOT include it in the backend response.

### 6.2 `SegmentMetricRow`

Per-segment aggregated analytics.

```typescript
interface SegmentMetricRow {
  id:                       CustomerSegment
  name:                     CustomerSegment
  label:                    string        // display name, e.g. "Enterprise Tier"
  description:              string
  strategicFocus:           string
  customerCount:            number
  customerShare:            Percentage
  totalClv:                 Money
  averageClv:               Money
  clvShare:                 Percentage
  totalHistoricalRevenue:   Money
  averageHistoricalRevenue: Money
  revenueShare:             Percentage
  totalOrders:              number
  averageOrders:            number        // decimal
  averageOrderValue:        Money
  churnRiskDistribution: {
    low:      number
    moderate: number
    high:     number
  }
  highRiskCount:            number
  highRiskPercentage:       Percentage
  averageChurnProbability:  Probability
  status:                   "expanding" | "stable" | "at-risk"
}
```

### 6.3 `ModelMetadata`

Information about the ML model that produced the CLV predictions.

```typescript
interface ModelMetadata {
  modelName:          string   // e.g. "BG/NBD + Gamma-Gamma Probabilistic Pipeline"
  version:            string   // e.g. "v1.4-beta"
  framework:          string
  horizon:            string   // e.g. "12 Months Forward"
  trainingCohortSize: number
  lastRunDate:        string   // "YYYY-MM-DD"
  evaluationStatus:   "pending" | "evaluated"
  statusLabel:        string
  description:        string
  holdoutWindow:      string
}
```

### 6.4 `InsightMetric`

```typescript
interface InsightMetric {
  label: string
  value: string
  hint?: string
}
```

### 6.5 `BusinessInsight`

```typescript
interface BusinessInsight {
  id:                    string
  title:                 string
  category:              "retention" | "segment" | "growth" | "efficiency"
  priority:              "high" | "medium" | "low"
  segment:               CustomerSegment | "All Segments"
  supportingObservation: string
  metrics:               InsightMetric[]
  businessImplication:   string
  suggestedAction:       string
  actionLabel:           string
  actionHref:            string
  ruleId:                string
  ruleName:              string
  ruleFormula:           string
  impactEstimate:        string   // human-readable label, e.g. "$148,000 LTV at risk"
  impactNumeric:         Money    // machine-readable number
  affectedCustomerIds:   string[] // list of CUST-XXXX IDs
  generationType:        "rule-based"  // only value for Phase 1
}
```

### 6.6 `ActionRecommendation`

```typescript
interface ActionRecommendation {
  id:              string
  title:           string
  category:        "retention" | "loyalty" | "growth" | "efficiency"
  priority:        "high" | "medium" | "low"
  targetAudience:  string
  dataTrigger:     string
  impactEstimate:  string
  actionLabel:     string
  actionHref:      string
  tactics:         string[]
  ruleReference:   string
  affectedSegment?: CustomerSegment | "All Segments"
}
```

---

## 7. Endpoints

> **All endpoints below are PROPOSED — NOT IMPLEMENTED.**

---

### 7.1 Dashboard Overview

#### `GET /api/v1/dashboard/summary`

Returns all data needed to render the Overview Dashboard page in a single call.
This avoids multiple round-trips on the most visited page.

**Query Parameters**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `horizon` | `"30d"` \| `"90d"` \| `"12m"` \| `"all"` | `"12m"` | Time horizon for projected KPIs and trajectory data |
| `segment` | `"all"` \| `"enterprise"` \| `"mid-market"` \| `"growth"` | `"all"` | Cohort filter applied to KPI values |

**Request body:** none

**Response `200 OK`**

```jsonc
{
  "kpis": [
    {
      "id":               "kpi-avg-clv",
      "title":            "Average Customer Lifetime Value",
      "value":            "$4,820",          // formatted display string
      "numericValue":     4820,              // raw number for calculations
      "change":           "+12.4%",          // period-over-period delta string
      "changeType":       "positive",        // "positive" | "negative" | "neutral"
      "period":           "vs previous quarter",
      "secondaryContext": "Benchmark: $4,290 (+12.3% above sector)",
      "icon":             "clv"              // "clv" | "revenue" | "retention" | "risk"
    }
    // ... more KPI objects
  ],
  "trajectory": [
    {
      "month":          "M0",
      "observedClv":    540,          // null for future months
      "predictedClv":   540,
      "confidenceLow":  520,
      "confidenceHigh": 560
    }
    // ... monthly points M0–M36
  ],
  "tierDistribution": [
    {
      "tier":          "top-5",
      "label":         "Champions (Top 5%)",
      "customerShare": 5,
      "revenueShare":  46,
      "customerCount": 356,
      "totalRevenue":  6568800,
      "avgClv":        18450
    }
    // ...
  ],
  "segmentHealth": [
    {
      "id":            "seg-enterprise-champions",
      "name":          "Enterprise VIP Champions",
      "tier":          "Tier 1 (Enterprise)",
      "customerCount": 356,
      "averageSpend":  18450,
      "retentionRate": 96.4,
      "churnRisk":     "low",
      "clvGrowth":     "+18.4%",    // period-over-period string — team decision needed
      "status":        "expanding"
    }
    // ...
  ],
  "actionableInsights": [
    {
      "id":                "act-1",
      "type":              "risk",        // "risk" | "opportunity" | "optimization"
      "severity":          "critical",   // "critical" | "elevated" | "positive"
      "title":             "Early Attrition Signal in Mid-Market Tier",
      "description":       "...",
      "impactEstimate":    "$148,000 LTV at immediate risk",
      "recommendedAction": "...",
      "cohortTarget":      "Mid-Market Consistent (Days 45–75)"
    }
    // ...
  ],
  "modelMetadata": {
    "name":               "BG/NBD + Gamma-Gamma CLV Pipeline",
    "version":            "v1.4-prod",
    "lastRunTimestamp":   "2026-11-19T06:00:00Z",
    "trainingCohortSize": 24500,
    "mapeAccuracy":       "94.2%"    // see open question on format
  }
}
```

**Notes:**
- When `segment != "all"`, the backend should return filtered `kpis` values appropriate to that cohort; `trajectory`, `tierDistribution` and `segmentHealth` may also be filtered.
- When `horizon` changes, only the `kpis.numericValue`, `kpis.value`, and the `trajectory` array content change; `tierDistribution` and `segmentHealth` are horizon-independent.
- The frontend currently applies segment and horizon filtering in-memory from a single mock. The API replaces this with parameterized server-side logic.

---

### 7.2 Customers

#### `GET /api/v1/customers`

Returns a paginated, filtered, and sorted list of customers for the Customer Directory page.

**Query Parameters**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `q` | `string` | — | Full-text search across `name`, `email`, `company`, `id` |
| `segment` | `CustomerSegment` | — | Filter by segment |
| `risk` | `ChurnRiskLevel` | — | Filter by churn risk level |
| `tier` | `"high"` \| `"mid"` \| `"standard"` | — | CLV tier filter (`high` ≥ \$10k; `mid` \$2.5k–\$9.99k; `standard` < \$2.5k) |
| `sort` | `CustomerSortField` | `"predictedClv"` | Sort field |
| `dir` | `"asc"` \| `"desc"` | `"desc"` | Sort direction |
| `page` | `integer` | `1` | Page number |
| `pageSize` | `integer` | `10` | Records per page |

Where `CustomerSortField` is one of:
`name`, `segment`, `predictedClv`, `historicalRevenue`, `totalOrders`, `averageOrderValue`, `lastPurchaseDate`, `churnRisk`

**Request body:** none

**Response `200 OK`**

```jsonc
{
  "items": [ /* CustomerRecord[] */ ],
  "total": 36,
  "page": 1,
  "pageSize": 10,
  "totalPages": 4,
  "kpis": {
    "totalCustomers":    36,
    "highValueCustomers": 8,   // predictedClv >= 10000
    "atRiskCustomers":   7,    // churnRisk === "high"
    "averageClv":        4820
  }
}
```

> **Note:** The `kpis` block is calculated over the **entire unfiltered dataset**, not the current page. The frontend currently shows global KPI cards (from `globalKpis`) separately from the filtered count label. The backend must distinguish:
> - `kpis` → global, unfiltered summary (always from full cohort)
> - `total` → count matching the current filters

**Possible error responses**

| Code | Condition |
|---|---|
| `400` | `pageSize` > 100, or non-integer `page`/`pageSize` |

---

#### `GET /api/v1/customers/:customerId`

Returns the full `CustomerRecord` for a single customer. Used by the Customer Profile page.

**Path Parameters**

| Parameter | Type | Description |
|---|---|---|
| `customerId` | `string` | Customer ID in format `CUST-XXXX` |

**Request body:** none

**Response `200 OK`**

```jsonc
{
  "customer": { /* CustomerRecord */ }
}
```

**Possible error responses**

| Code | Condition |
|---|---|
| `404` | No customer with this ID |

**Notes for the Customer Profile page:**
- The profile page computes several derived values purely in the frontend — these are NOT needed from the backend. See [Section 9](#9-frontend-calculated-fields-do-not-return-from-backend).
- The profile currently shows a notice that itemized transaction receipts are unavailable. If the backend exposes a transactions sub-resource in a future phase, the route would be `GET /api/v1/customers/:customerId/transactions`.

---

### 7.3 Segmentation

#### `GET /api/v1/segments`

Returns full segmentation analytics used by the Segmentation page. This is primarily an aggregate endpoint — it returns pre-computed segment metrics alongside the global summary.

**Query Parameters:** none for Phase 1.

**Request body:** none

**Response `200 OK`**

```jsonc
{
  "segments": [
    {
      "id":                       "Enterprise",
      "name":                     "Enterprise",
      "label":                    "Enterprise Tier",
      "description":              "High-contract, high-volume strategic accounts...",
      "strategicFocus":           "Executive relationship management...",
      "customerCount":            8,
      "customerShare":            22.2,
      "totalClv":                 144350,
      "averageClv":               18044,
      "clvShare":                 54.2,
      "totalHistoricalRevenue":   116850,
      "averageHistoricalRevenue": 14606,
      "revenueShare":             52.1,
      "totalOrders":              212,
      "averageOrders":            26.5,
      "averageOrderValue":        551.18,
      "churnRiskDistribution": {
        "low":      6,
        "moderate": 1,
        "high":     1
      },
      "highRiskCount":            1,
      "highRiskPercentage":       12.5,
      "averageChurnProbability":  0.24,
      "status":                   "expanding"
    }
    // ... 3 more segments: Mid-Market, Growth, Standard
  ],
  "summary": {
    "totalSegments":   4,
    "totalCustomers":  36,
    "totalRevenue":    224350,
    "totalClv":        266190,
    "averageClv":      7394,
    "largestSegment": {
      "name":  "Standard",
      "count": 11,
      "share": 30.6
    },
    "highestValueSegment": {
      "name":         "Enterprise",
      "totalClv":     144350,
      "avgClv":       18044,
      "revenueShare": 52.1
    },
    "highRiskSummary": {
      "count":                  7,
      "percentage":             19.4,
      "mostVulnerableSegment":  "Standard"
    },
    "highestAovSegment": {
      "name": "Enterprise",
      "aov":  551.18
    }
  }
}
```

**Notes:**
- The `segments` array must be in the fixed order: `Enterprise`, `Mid-Market`, `Growth`, `Standard`.
- The frontend renders this data into multiple sub-components (distribution chart, performance table, risk table, CLV comparison, revenue breakdown). All data comes from this single endpoint.

---

#### `GET /api/v1/segments/:segmentId/customers`

Returns the customers belonging to a specific segment, paginated. Used when drilling into a segment detail view.

**Path Parameters**

| Parameter | Type | Description |
|---|---|---|
| `segmentId` | `CustomerSegment` | One of `Enterprise`, `Mid-Market`, `Growth`, `Standard` |

**Query Parameters:** supports `page`, `pageSize`, `sort`, `dir`, `q` (same as `/customers`)

**Response `200 OK`** — standard `PaginatedResponse<CustomerRecord>` envelope.

---

### 7.4 CLV Predictions

#### `GET /api/v1/predictions`

Returns enriched customer prediction records for the CLV Predictions page. The list is sortable, filterable, and paginated identically to the customer directory.

**Query Parameters**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `q` | `string` | — | Search across `name`, `email`, `company`, `id` |
| `segment` | `CustomerSegment` | — | Filter by segment |
| `tier` | `"high"` \| `"mid"` \| `"standard"` | — | CLV tier (same thresholds as `/customers`) |
| `delta` | `"expansion"` \| `"contraction"` | — | Filter by value delta direction |
| `sort` | `PredictionSortField` | `"predictedClv"` | Sort field |
| `dir` | `"asc"` \| `"desc"` | `"desc"` | Sort direction |
| `page` | `integer` | `1` | Page number |
| `pageSize` | `integer` | `10` | Records per page |

Where `PredictionSortField` is one of:
`name`, `segment`, `predictedClv`, `historicalRevenue`, `valueDelta`, `churnProbability`

**Request body:** none

**Response `200 OK`**

```jsonc
{
  "items": [
    {
      /* All CustomerRecord fields */
      "id":                "CUST-1001",
      "name":              "Eleanor Vance",
      "email":             "...",
      "company":           "...",
      "segment":           "Enterprise",
      "status":            "active",
      "predictedClv":      24850,
      "historicalRevenue": 19400,
      "totalOrders":       38,
      "averageOrderValue": 510.53,
      "lastPurchaseDate":  "2026-11-14",
      "joinedDate":        "2024-03-12",
      "churnRisk":         "low",
      "churnProbability":  0.08,
      /* Prediction-specific enrichments */
      "valueDelta":         5450,     // predictedClv - historicalRevenue
      "valueDeltaPercent":  28.1,     // (valueDelta / historicalRevenue) * 100
      "predictionHorizon":  "12 Months",
      "isExpansion":        true      // valueDelta >= 0
    }
    // ...
  ],
  "total": 36,
  "page": 1,
  "pageSize": 10,
  "totalPages": 4,
  "kpis": {
    "totalPredictedClv":         266190,
    "averagePredictedClv":        7394,
    "medianPredictedClv":         3450,
    "minPredictedClv":             210,
    "maxPredictedClv":           24850,
    "totalCustomers":               36,
    "totalHistoricalRevenue":    224350,
    "totalProjectedExpansion":    41840,
    "projectedExpansionPercent":   18.6,
    "highValuePredictionCount":      8
  },
  "distribution": [
    {
      "id":              "bin-under-1k",
      "label":           "$0 – $999",
      "shortLabel":      "<$1k",
      "rangeDescription":"Micro & transactional spend accounts",
      "min":             0,
      "max":             999.99,
      "customerCount":   11,
      "customerShare":   30.6,
      "totalClv":        4015,
      "clvShare":        1.5,
      "avgClv":          365
    }
    // ... 5 more bins
  ],
  "segmentBreakdown": [
    {
      "segment":           "Enterprise",
      "label":             "Enterprise Tier",
      "customerCount":     8,
      "customerShare":     22.2,
      "totalClv":          144350,
      "clvShare":          54.2,
      "avgClv":            18044,
      "historicalRevenue": 116850,
      "projectedExpansion":27500,
      "expansionPercent":  23.5
    }
    // ... Growth, Mid-Market, Standard
  ],
  "modelMetadata": { /* ModelMetadata */ }
}
```

**Notes:**
- `kpis` reflects the **global unfiltered** cohort (same logic as `/customers`).
- `distribution` and `segmentBreakdown` also reflect the global cohort (they are chart data, not filtered by the user's current table filters).
- `valueDelta`, `valueDeltaPercent`, and `isExpansion` are computed fields — the backend must return them (they are derived from ML output, not from pure frontend math). See [Section 9](#9-frontend-calculated-fields-do-not-return-from-backend) for the boundary.
- **`predictionHorizon`** must match `modelMetadata.horizon`.

---

#### `GET /api/v1/predictions/:customerId`

Returns the enriched prediction record for a single customer. Currently not used in a standalone page, but required when the Customer Profile page links to prediction detail.

**Path Parameters**

| Parameter | Type | Description |
|---|---|---|
| `customerId` | `string` | Customer ID |

**Response `200 OK`**

```jsonc
{
  "customer": { /* EnrichedPredictionCustomer — same shape as an item in /predictions */ },
  "modelMetadata": { /* ModelMetadata */ }
}
```

---

### 7.5 Insights & Recommendations

> The Insights page is currently a shell (`InsightsPage.tsx`) with an empty state. The types file (`src/features/insights/types.ts`) defines the full contract the frontend expects to consume when the page is built out. This section formalizes those endpoints.

#### `GET /api/v1/insights`

Returns all business insights generated by the rule-based engine.

**Query Parameters**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `category` | `"retention"` \| `"segment"` \| `"growth"` \| `"efficiency"` | — | Filter by insight category |
| `priority` | `"high"` \| `"medium"` \| `"low"` | — | Filter by priority |
| `segment` | `CustomerSegment` \| `"All Segments"` | — | Filter by affected segment |
| `q` | `string` | — | Search insight `title` and `supportingObservation` |

**Request body:** none

**Response `200 OK`**

```jsonc
{
  "insights": [ /* BusinessInsight[] */ ],
  "kpis": {
    "totalInsights":              12,
    "highPriorityCount":           4,
    "totalAtRiskClv":          48200,
    "projectedExpansionClv":   27000,
    "enterpriseClvConcentration": 54.2
  },
  "retentionOpportunities": {
    "highValueAtRisk": [
      {
        "customer":               { /* CustomerRecord */ },
        "exposureShareOfCohort":  18.5,
        "churnProbability":       0.72,
        "daysSinceLastPurchase":  76
      }
    ],
    "totalAtRiskClv": 48200,
    "outperformers": [
      {
        "customer":              { /* CustomerRecord */ },
        "segmentAverageClv":     7394,
        "outperformancePercent": 236.0
      }
    ],
    "dormantAccounts": [
      {
        "customer":          { /* CustomerRecord */ },
        "status":            "dormant",
        "churnProbability":  0.85
      }
    ]
  }
}
```

**Notes:**
- Phase 1 insights are **rule-based only** (`generationType: "rule-based"`). ML/AI-generated insights are out of scope until the ML model is validated.
- The frontend's `InsightsPage` is a shell today; this endpoint supports its future build-out.

---

#### `GET /api/v1/recommendations`

Returns strategic action recommendations.

**Query Parameters**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `category` | `"retention"` \| `"loyalty"` \| `"growth"` \| `"efficiency"` | — | Filter by category |
| `priority` | `"high"` \| `"medium"` \| `"low"` | — | Filter by priority |
| `segment` | `CustomerSegment` \| `"All Segments"` | — | Filter by affected segment |

**Response `200 OK`**

```jsonc
{
  "recommendations": [ /* ActionRecommendation[] */ ]
}
```

---

### 7.6 System / Model Metadata

#### `GET /api/v1/system/model-metadata`

Returns the current state of the ML model. Used by any page that shows the model version badge.

**Response `200 OK`**

```jsonc
{
  "modelMetadata": { /* ModelMetadata */ }
}
```

**Notes:**
- When `evaluationStatus: "pending"`, the frontend shows "Backtest Validation Pending" and disables confidence intervals.
- This endpoint is a simple health/status check, not a data query.

---

## 8. Frontend-to-Backend Field Mapping

This table maps every field currently shown in the frontend (from mock data) to its proposed backend source.

### Customer Directory / Profile

| Frontend field (mock) | Backend source |
|---|---|
| `id` | DB primary key — keep `CUST-XXXX` format or define new format (open question) |
| `name` | CRM / billing system |
| `email` | CRM / billing system |
| `company` | CRM / billing system |
| `avatarInitials` | ⛔ **Frontend-derived** from `name` — not needed from backend |
| `segment` | Assigned by segmentation logic (backend or ML pipeline) |
| `predictedClv` | ML model output |
| `historicalRevenue` | Billing aggregation (sum of invoices) |
| `totalOrders` | Billing aggregation (count of orders) |
| `averageOrderValue` | ⚠️ Could be backend-computed or frontend-derived as `historicalRevenue / totalOrders` — **team decision needed** |
| `lastPurchaseDate` | Latest order date from billing |
| `joinedDate` | First order date or CRM registration date — **team decision needed** |
| `churnRisk` | ML model output — discretized from `churnProbability` |
| `churnProbability` | ML model output (0.0–1.0) |
| `status` | Derived: `high` churn = `at-risk`; long recency + high churn = `dormant`; else `active` — **team decision on thresholds** |

### Overview KPI Cards

| Frontend KPI | Backend source |
|---|---|
| Average CLV | Computed from prediction records |
| 12-Month Projected LTV Pipeline | ML model cohort-level output |
| Net Revenue Retention (NRR) | ⚠️ **ML/finance dependency** — requires cancellation and expansion revenue data not currently in mock |
| Gross LTV at Churn Risk | Computed: sum of `predictedClv` for `churnRisk === "high"` |

### CLV Trajectory Chart

| Field | Backend source |
|---|---|
| `observedClv` | Historical billing actuals per cohort-month |
| `predictedClv` | ML model per-month projection |
| `confidenceLow`, `confidenceHigh` | ML model confidence bands (optional in Phase 1) |

### Segment Health Table (Overview)

| Field | Backend source |
|---|---|
| `averageSpend` | Historical revenue average per segment |
| `retentionRate` | ⚠️ **ML/finance dependency** — requires cancellation data |
| `churnRisk` | Discretized from segment-level average churn probability |
| `clvGrowth` | ⚠️ Period-over-period comparison — requires historical snapshot — **team decision needed** |

---

## 9. Frontend-Calculated Fields (Do Not Return from Backend)

These fields are computed in the browser from raw backend values. The backend must **not** return them to avoid duplication and inconsistency.

| Field | Computed as | Location |
|---|---|---|
| `avatarInitials` | First letter of each word in `name` | Customer Directory, Profile |
| `realizedShare` | `Math.round((historicalRevenue / predictedClv) * 100)` | Customer Profile — Value Analysis Card |
| `futureShare` | `100 - realizedShare` | Customer Profile — Value Analysis Card |
| `futureProjected` | `Math.max(0, predictedClv - historicalRevenue)` | Customer Profile — Value Analysis Card |
| `recencyDays` | `(evalRefDate - lastPurchaseDate) / 86400000` | Customer Profile — Purchase Behavior Card |
| `tenureMonths` | `(evalRefDate - joinedDate) / (30.44 * 86400000)` | Customer Profile — Purchase Behavior Card |
| `monthlyCadence` | `totalOrders / tenureMonths` | Customer Profile — Purchase Behavior Card |
| `avgDaysBetweenOrders` | `tenureDays / totalOrders` | Customer Profile — Purchase Behavior Card |
| `globalKpis` | Aggregated from full customer list | Customer Directory |
| `filteredKpis` | Aggregated from filtered customer list (client-side) | Customer Directory |
| Pagination slicing | URL param–driven slice of sorted list | Customer Directory, Predictions |

---

## 10. Data Relationships

```
CustomerRecord (1)
  ├── Belongs to exactly one CustomerSegment
  ├── Has exactly one churnRisk classification
  ├── Has one predictedClv (ML output)
  └── Appears in zero or many BusinessInsight.affectedCustomerIds

CustomerSegment (4 total: Enterprise, Mid-Market, Growth, Standard)
  ├── Has many CustomerRecord
  └── Has one SegmentMetricRow (aggregate analytics)

ModelMetadata (1 active record)
  └── Associated with all PredictionRecord outputs for current run

BusinessInsight (many)
  ├── References one CustomerSegment (or "All Segments")
  └── References many CustomerRecord via affectedCustomerIds

ActionRecommendation (many)
  └── Optionally references one CustomerSegment
```

**Key constraint:** Every customer belongs to exactly one segment. Segment stats must sum to the global totals (no overlap, no gaps).

---

## 11. ML Dependencies & Unknowns

The following fields shown in the frontend **require the ML model to be trained and deployed** before the backend can supply real values. During the development phase, the backend should return mock/placeholder values with an appropriate flag.

| Field / Feature | ML dependency | Status |
|---|---|---|
| `predictedClv` | BG/NBD + Gamma-Gamma model output per customer | ❌ Not implemented |
| `churnProbability` | BG/NBD churn probability per customer | ❌ Not implemented |
| `churnRisk` | Discretized from `churnProbability` with team-agreed thresholds | ❌ Threshold undecided |
| `trajectory[].predictedClv` | Per-month cohort average from ML pipeline | ❌ Not implemented |
| `trajectory[].confidenceLow/High` | Model uncertainty bands | ❌ Not implemented |
| NRR (Net Revenue Retention) | Requires cancellation + expansion revenue data | ❌ Data pipeline dependency |
| `retentionRate` per segment | Requires cancellation/subscription events | ❌ Data pipeline dependency |
| `clvGrowth` per segment | Requires historical CLV snapshots (time-series) | ❌ Not implemented |
| SHAP / feature attributions | Explainability layer on top of ML model | ❌ Post-MVP |
| AI-generated insights | LLM or ML anomaly detection layer | ❌ Post-MVP |

**Suggested fallback strategy for backend while ML is not ready:**
Return a `"dataStatus": "mock"` flag at the top level of any response that contains placeholder values. The frontend can use this to show a banner.

```jsonc
{
  "dataStatus": "mock",   // "live" | "mock" | "partial"
  ...
}
```

---

## 12. Open Questions Requiring Team Decisions

The following decisions block backend implementation. Each item should produce a GitHub issue, be discussed in a team meeting, and result in an ADR (Architecture Decision Record).

| # | Question | Blocking |
|---|---|---|
| Q1 | **Customer ID format:** Keep `CUST-XXXX` or use UUID? If changed, all mock data must be updated. | Customers, Predictions |
| Q2 | **`averageOrderValue`:** Should the backend compute and store it, or should the frontend always derive it as `historicalRevenue / totalOrders`? (Risk: integer division rounding inconsistency) | Customer Directory, Profile |
| Q3 | **`joinedDate` definition:** First billing date vs. CRM registration date? These may differ if a customer registered but never purchased. | Customer Profile |
| Q4 | **`status` thresholds:** What recency + churn probability combination makes a customer `dormant` vs `at-risk`? Currently no backend logic exists for this. | Customer Directory |
| Q5 | **`churnRisk` discretization thresholds:** What probability ranges map to `low`, `moderate`, `high`? The frontend currently treats the enum as given. | All pages |
| Q6 | **NRR (Net Revenue Retention) data source:** Does the backend have access to cancellation, contraction, and expansion revenue events? If not, NRR cannot be computed and that KPI card must show a placeholder. | Overview Dashboard |
| Q7 | **`clvGrowth` definition:** Period-over-period change in average CLV — what period? What snapshot mechanism does the backend use to store historical CLV per segment? | Overview Dashboard |
| Q8 | **Authentication strategy:** JWT, session cookie, API key, or none for MVP? This affects every endpoint. | All endpoints |
| Q9 | **`mapeAccuracy` format:** Should this be a `number` (e.g. `94.2`) or a `string` (`"94.2%"`)? The frontend currently receives a string. Numbers are safer. | Overview Dashboard |
| Q10 | **Pagination location for `kpis`:** Should global KPIs live in the list response (`GET /customers`) or in a separate `GET /customers/summary` endpoint? A separate endpoint avoids re-computing on every paginated request. | Customer Directory |
| Q11 | **Dashboard endpoint granularity:** Should `/api/v1/dashboard/summary` return everything in one call (current proposal) or should the frontend call individual endpoints? The single-call approach is simpler for the team but may be harder to cache independently. | Overview Dashboard |
| Q12 | **`dataStatus` mock flag:** Should the backend return a `dataStatus` field to indicate live vs. mock data? This helps the frontend show appropriate disclaimers during the ML-pending phase. | All endpoints |

---

*End of API Contract v1.0 — PROPOSED — NOT IMPLEMENTED*
