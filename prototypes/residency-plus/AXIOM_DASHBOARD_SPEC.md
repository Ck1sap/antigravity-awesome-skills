# Residency+ Axiom Dashboard Specification
_Analytical Blueprints (2026-03-10)_

This document outlines the recommended visualizations and query thresholds to construct within the Axiom Dashboards module to monitor the ResidencySolutions G2 wrapper functions.

---

## 1. Top-Level Dashboard Panels

### A. Total Request Volume by Endpoint (Time Series)
- **Type**: Time Series Bar/Line Chart.
- **Query**: Count of `event` filtered by `*request*` over a 24-hour window, grouped by `endpoint` (`sc-official-search` vs `sc-official-resolve`).
- **Purpose**: Establishes the macro traffic baseline.

### B. Health Status Ratio (Pie/Donut)
- **Type**: Donut Chart.
- **Query**: Count of all events grouped by `status_code` (`200`, `400`, `403`, `429`, `502`).
- **Goal**: >98% of the pie should be `200`.

### C. Upstream Latency Profiler
- **Type**: Time Series Line (Percentiles).
- **Query**: Summarize `p50(duration_ms)` and `p95(duration_ms)` where `status_code == 200`.
- **Purpose**: Tracks how slow the SoundCloud API is responding. Serverless functions die after 10s, so approaching 8000ms is critically dangerous.

### D. Rejected Traffic Waterfall
- **Type**: Stacked Bar.
- **Query**: Count events where `event` IN (`rate_limit_block`, `origin_forbidden`, `upstream_429`).
- **Purpose**: Distinct visual grouping separating **Internal Defense** (we blocked them via 403/429) vs **External Failure** (SoundCloud blocked us via upstream_429).

---

## 2. Healthy Baselines
A stable Residency+ prototype environment should exhibit the following telemetry signatures over a 7-day rolling window:
- `p50(duration_ms)`: ~120ms to 400ms.
- `p95(duration_ms)`: Under 1200ms.
- `origin_forbidden`: Near zero (unless a new Preview env is spawned without updating the allowlist).
- `sc_search_error`: Should scale linearly only with `400 Bad Request` events driven by malformed user queries (e.g. empty inputs).

---

## 3. Potential Monitors (Alert Candidates)
*These do not need to be configured immediately, but should be added if production traffic scales heavily.*

1. **Upstream Exhaustion Alarm**
   - **Condition**: Count of `upstream_429` > 10 in 5 minutes.
   - **Response**: Immediate operator escalation; SoundCloud has rate-limited the main system tenant credentials.
2. **Latency Critical Zone**
   - **Condition**: `p95(duration_ms)` > 4000ms over a 15-minute rolling window.
   - **Response**: Upstream API degradation is likely. End-users will experience heavy UI stalling.
3. **Allowlist Poisoning**
   - **Condition**: Sudden spike in `origin_forbidden` (> 50 in 10 minutes).
   - **Response**: Check frontend configurations. A valid UI branch may have deployed with an unregistered hostname causing a total traffic block.
