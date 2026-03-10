# Residency+ Axiom Telemetry Runbook
_G2 Operator Guide (2026-03-10)_

## 1. Prerequisites
Before Axiom telemetry will function or can be reviewed, ensure the following infrastructural prerequisites are met:
1. **Axiom Account & Dataset:** You must have an active Axiom account and a dedicated dataset created (e.g., `residency-plus-production`).
2. **Ingest Token:** An Axiom API token with `ingest` privileges must be generated for that dataset. *Do not use personal access tokens (PATs).*
3. **Environment Injection:** The `sc-auth-lib.js` Netlify function requires three specific environment variables to activate forwarding. If these are entirely missing, the proxy will silently skip Axiom forwarding and use local `stdout` only.
   - `AXIOM_API_TOKEN`
   - `AXIOM_DATASET`
   - `AXIOM_DOMAIN` (e.g., `us-east-1.aws.edge.axiom.co`)

> **Privacy Rule:** Never store or review secrets in Axiom. The wrapper is hard-coded to drop `Authorization` headers, suppress token values, and hash/trim raw user variables before transmission. **Do not alter the payload sanitizer to expose origin IPs or raw search queries.**

---

## 2. Confirming Ingestion
To quickly verify that events are actively arriving in your Axiom pipeline:
1. Open the Axiom UI -> **Datasets** -> select your `AXIOM_DATASET`.
2. Run a simple presence query:
   ```kusto
   ['residency-plus']
   | where _telemetry == true
   | take 10
   ```
3. You should see sanitized structured JSON objects containing keys like `event`, `endpoint`, and `status_code`.

---

## 3. Expected Event Dictionary
Per the `TELEMETRY_SPEC.md`, the dataset will regularly ingest these primary event indicators:

| Event | Meaning |
|---|---|
| `sc_search_request` | Search proxy hit (initial). |
| `sc_search_success` | Search proxy completed successfully (200 OK). Includes `duration_ms`. |
| `sc_search_error` | Search proxy crashed or rejected intrinsically (e.g., 400 Bad Request). |
| `sc_resolve_request` | Resolve URL proxy hit. |
| `sc_resolve_success` | Resolve proxy completed successfully. Includes `duration_ms`. |
| `sc_resolve_error` | Resolve proxy syntax or internal rejection. |
| `rate_limit_block` | Request blocked internally by our serverless 429 limiter. |
| `origin_forbidden` | Request rejected internally (403) for failing origin allowlist. |
| `upstream_429` | The request was valid, but SoundCloud rejected the proxy with an upstream 429. |

---

## 4. Investigation Playbooks

### A. Elevated Internal Rate Limits (`rate_limit_block`)
- **Symptom**: A sudden spike in 429 statuses generated internally.
- **Action**: Group by `origin`. If a single expected origin (like `residencysolutions.netlify.app`) is throwing massive limit hits, the frontend UI logic is likely caught in an infinite reload loop. If the origin is unknown/blank, a scraper is hitting the Netlify function directly and the limiter is properly defending the upstream credentials.

### B. Repeated `origin_forbidden` (403)
- **Symptom**: High volume of 403s.
- **Action**: Check the `origin` field in the payload. If the `origin` matches a new deployment URL (e.g., a Netlify branch preview), you must add that origin dynamically to the `ALLOWED_ORIGINS` environment variable.

### C. Upstream Failure Clusters (`upstream_429` or 502s)
- **Symptom**: Wrapper functions are executing cleanly but returning 502 bad gateway or `upstream_429`.
- **Action**: The proxy is fine; SoundCloud's API infrastructure is throttling or failing the tenant `client_id`. Cease automated test suites. Wait 15 minutes for burst limits to reset.

### D. Missing Success Events
- **Symptom**: You see `sc_search_request` but never an `sc_search_success` or `sc_search_error`.
- **Action**: The Netlify function is timing out (exceeding the standard 10-second serverless window) before it can write the final log. Review the Axiom UI for `duration_ms` creep leading up to the blackout, indicating severe upstream latency.
