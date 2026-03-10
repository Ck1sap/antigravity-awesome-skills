# Residency+ Wrapper Alert Policy
_G2 Operator Telemetry Monitors (2026-03-10)_

This document outlines the formal alerting rules, thresholds, and corresponding severity categories for the official SoundCloud wrapper endpoints (`sc-official-search` and `sc-official-resolve`). 

These policies are intended to be configured within Axiom Monitors (or an equivalent alerting system hooked into the telemetry sink).

---

## 1. Alert Candidates & Thresholds

| Alert Name | Condition | Severity | Interval |
|---|---|---|---|
| **Upstream Exhaustion (`upstream_429` Spike)** | Count > `10` | 🔴 CRITICAL | 5 minutes, rolling |
| **Silent Blackout (Missing Success Events)** | Count == `0` AND `request` events > `0` | 🔴 CRITICAL | 15 minutes, rolling |
| **Allowlist Poisoning (`origin_forbidden` Spike)** | Count > `50` | 🟠 WARNING | 10 minutes, rolling |
| **Latency Regression (`p95` Duration Spike)** | `p95(duration_ms)` > `4000ms` | 🟠 WARNING | 15 minutes, rolling |
| **Success-Rate Drop (Elevated 502s/400s)** | Ratio of `200 OK` drops below `95%` | 🟡 INFO | 60 minutes, rolling |

---

## 2. Response Playbooks

### 🔴 CRITICAL Alerts
These indicate immediate disruption to end-user functionality across the entire application domain.

#### A. Upstream Exhaustion (`upstream_429` Spike)
**Trigger:** SoundCloud has explicitly blocked our OAuth credentials due to excessive request volume.
1. Cease all automated testing pipelines or E2E suites immediately.
2. If traffic is organic, wait 15 minutes for the burst window to reset. 
3. If sustained, verify the frontend UI is not caught in a render loop issuing rapid searches. (Check `rate_limit_block` metrics correlated with the time of the event).
4. Do NOT attempt to rotate credentials immediately. Wait for the cooldown period.

#### B. Silent Blackout (Missing Success Events)
**Trigger:** Requests are arriving (`sc_search_request` tracked), but the proxy is dying before it can complete and log `sc_search_success` or `sc_search_error`.
1. Verify Netlify function logs natively. This indicates the serverless function is suffering a hard timeout (exceeding 10s).
2. Typically caused by a total, silent hang on the SoundCloud API side where fetches never resolve or reject.
3. No immediate fix; update status page to indicate upstream degradation.

---

### 🟠 WARNING Alerts
These indicate partial degradation or misconfiguration that needs rapid, non-emergency review.

#### C. Allowlist Poisoning (`origin_forbidden` Spike)
**Trigger:** A massive surge of 403s generated locally by the proxy.
1. Check the `origin` field in the Axiom telemetry payload.
2. If the origin is a legitimate new deployment (e.g., a Netlify PR preview domain `deploy-preview-123--residencysolutions.netlify.app`), update the `ALLOWED_ORIGINS` environment variable in the Netlify dashboard immediately.
3. If the origin is unfamiliar or blank, ignore it. The security proxy is successfully stopping a scraping attempt.

#### D. Latency Regression (`p95` Duration Spike)
**Trigger:** 5% of searches are taking longer than 4 seconds to resolve.
1. Review the Axiom dashboard for concurrent spikes in traffic volume.
2. If traffic is normal, SoundCloud's API nodes are degraded. Monitor to ensure it does not cascade into a **Silent Blackout** (10s timeout).

---

### 🟡 INFO Alerts
These are baseline drifts useful for planning but not immediate action.

#### E. Success-Rate Drop
**Trigger:** 200 OKs fall below 95% of total events.
1. Check if the errors are predominantly `400 Bad Request`.
2. If so, users are submitting empty queries or malformed URLs. Consider adding stricter frontend validations before the HTTP call is made.

---

## 3. Privacy Rules During Investigation
When responding to any alert, operators must adhere to strict data privacy:
- **No Secret Handling:** Do not copy/paste environment variables or credentials into incident channels (Slack/Discord/GitHub).
- **Sanitized Sharing:** If sharing payloads for debugging, ensure no accidental PII or internal IPs leak. The telemetry pipeline natively scrubs these, but manual replication attempts using `curl` must be careful.
- **No Raw Payloads in Dashboards:** Do not modify the Axiom payload format to ingest exact user search strings.

---

## 4. Operator Checklist
Before resolving an incident triggered by these policies, ensure:
- [ ] Root cause identified (Internal bug vs. Upstream decay).
- [ ] System stability restored (Metrics returned to healthy baselines).
- [ ] No secrets were exposed during the mitigation process.
