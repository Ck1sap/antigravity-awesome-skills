# Residency+ G2 – Production Auth Inject Root Cause Fix

- **Timestamp**: 20260313_235400
- **Slice**: Production Auth Visibility (Account/Sign In still missing after deploy)
- **Branch**: `feat/discovery-engine-v1`

## 1. Exact Root Cause

Production was serving `index.html` that still contained the **literal placeholders** `%%AUTH_ENABLED%%`, `%%SUPABASE_URL%%`, `%%SUPABASE_ANON_KEY%%` instead of injected values. As a result:

- `AUTH_FLAG_ENV === "true"` never held, so `resolveAuthEnabled()` returned `false`.
- `SUPA_URL` / `SUPA_KEY` contained `"%%"`, so the Supabase init block (`!SUPA_URL.includes("%%")`) skipped client creation and `rplusSupabase` stayed `null`.
- The auth wiring block then hid `#accountBtn` and returned, so Account / Sign In never appeared.

Contributing causes addressed by this fix:

1. **Path**: The inject script used `path.resolve(__dirname, "..")` to find `index.html`. If Netlify’s build cwd and publish directory ever differ from the script’s location, we could be editing a different copy than the one published. Using `process.cwd()` ensures we edit the file in the directory Netlify will publish (the build base).
2. **Replace scope**: Only the **first** occurrence of each placeholder was replaced (`.replace(string, value)`). The comment on the next line also contains `%%AUTH_ENABLED%%`; if ordering or tooling changed, the const could be left unreplaced. Using global replace (e.g. `/%%AUTH_ENABLED%%/g`) replaces every occurrence.
3. **Env value shape**: `AUTH_ENABLED` from the UI might have leading/trailing whitespace or alternate casing (`True`, `1`, `yes`). The frontend checks `AUTH_FLAG_ENV === "true"` (strict). Trimming and normalizing to `"true"` for truthy values ensures the gate passes when intended.

**Netlify requirement**: For env vars to be available during the build command, their **scope must include “Builds”** (e.g. “All” or “Production” with builds). If they are only available at runtime (e.g. “Functions”), the inject script will not see them and placeholders will remain.

## 2. Commit Hash

`3db8e76ce6f133884a2ad51c12f05ae0596816d8`

## 3. Exact Files Changed

- `prototypes/residency-plus/scripts/inject-env.js` — Reworked to:
  - Resolve `index.html` from `process.cwd()` (the build base Netlify publishes).
  - Replace all occurrences of each placeholder using global regex.
  - Trim env values and normalize `AUTH_ENABLED` so `true`/`1`/`yes` (and trimmed `" true "`) become `"true"`.

(No changes to `netlify.toml`, `index.html`, or product logic.)

## 4. Auth Gating (Reference)

Account visibility is controlled by:

1. **`AUTH_ENABLED`** — Derived once from `resolveAuthEnabled()`.
2. **`resolveAuthEnabled()`** returns true if any of:
   - `window.RPLUS_CONFIG.authEnabled === true`
   - `window.RPLUS_AUTH_ENABLED === true`
   - **`AUTH_FLAG_ENV === "true"`** ← build-time replacement of `%%AUTH_ENABLED%%`
   - Query param `?auth=on|true|1`
3. In the auth wiring block: if `!AUTH_ENABLED` → hide `#accountBtn` and return. If `AUTH_ENABLED` but `!rplusSupabase` (Supabase init skipped when URL/key contain `%%`) → hide `#accountBtn` and return. Otherwise enable and show the button.

The path that actually controls production Account visibility when no runtime overrides are set is: **build-time replacement of `%%AUTH_ENABLED%%` and `%%SUPABASE_*%%`** so that `AUTH_FLAG_ENV === "true"` and Supabase client is created.

## 5. Verification (This Session)

- **verify_prod**: PASS — `verify_prod_20260313_195330.log`
- **verify_frontend_boot**: FAIL (expected when local server not running) — `verify_frontend_boot_20260313_235340.log` (net::ERR_CONNECTION_REFUSED at http://localhost:8888/)
- **verify_local_dev**: FAIL (env-gated; local server not running) — `verify_local_dev_20260313_195351.log`

## 6. Concise Summary of Fix

The build-time inject script was updated to (1) resolve `index.html` from `process.cwd()` so it always modifies the directory Netlify publishes, (2) replace every occurrence of each placeholder with a global regex, and (3) trim and normalize `AUTH_ENABLED` so values like `" true "` or `"1"` become `"true"`. After redeploy (and ensuring env vars are available at build time with “Builds” scope), production HTML will contain the injected values and Account / Sign In will appear when `AUTH_ENABLED=true` and Supabase vars are set.

## 7. Handoff Path

`prototypes/residency-plus/docs/handoffs/HANDOFF_20260313_235400_RESIDENCYSOLUTIONS_G2_PROD_AUTH_INJECT_ROOT_CAUSE_FIX.md`
