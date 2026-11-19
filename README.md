# CLV Platform — Customer Lifetime Value Analytics & Prediction

Academic capstone (team of five, deadline 15 Dec 2026). A web dashboard that shows historical customer
purchase metrics (RFM) and **batch-generated 90-day revenue forecasts** from the UCI Online Retail II dataset.

> Status: project skeleton. Nothing here is evidence of completed features, deployment or model accuracy.
> The forecast is a 90-day **revenue proxy**, not lifetime profit.

## Architecture (modular monolith)
UCI workbook -> offline data/ML pipeline (Pandas, scikit-learn) -> PostgreSQL -> FastAPI REST API -> React dashboard.
The browser never talks to the database. Model training never runs on a page request.

## Repository layout
| Folder | Purpose |
|---|---|
| `frontend/` | React + TypeScript + Vite app |
| `backend/` | FastAPI, SQLAlchemy, Alembic |
| `data-pipeline/` | cleaning, features, modeling, exports |
| `docs/` | requirements, architecture/ADRs, API contract, data policy, test plan |
| `tests/` | integration and contract checks |

Organized by responsibility, not by person. No per-member folders.

## Not in the MVP
Login, uploads, live inference, campaigns, payments, microservices.

## Setup
See the README inside each folder. Copy `.env.example` to `.env` (never commit `.env`).
Do not commit the raw UCI workbook; see `docs/data/`.

## Workflow
1. Open a GitHub issue (owner, deliverable, dependencies, acceptance criteria).
2. Branch from updated `main`: `feature/<short-name>` or `fix/<short-name>`.
3. Open a PR using the template; link the issue; attach test evidence.
4. One peer review (no self-approval), CI green, then squash-merge.
No direct pushes to `main`.
