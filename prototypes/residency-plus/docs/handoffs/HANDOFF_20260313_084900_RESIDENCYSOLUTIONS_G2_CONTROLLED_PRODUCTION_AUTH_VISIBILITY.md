## Residency+ G2 – Controlled Production Auth Visibility

- **Timestamp**: 20260313_084900
- **Slice**: Controlled Auth Rollout / Production Sign-In Visibility
- **Branch**: `feat/discovery-engine-v1`

### 1. Files Changed

- `index.html`

### 2. What Shipped: Config-Driven Auth Entry Visibility

#### 2.1. Auth enablement remains config-driven and safe

- The frontend already used a `resolveAuthEnabled()` helper; this slice confirms and tightens its role as the **single source of truth**:
  - `const AUTH_FLAG_ENV = "%%AUTH_ENABLED%%";`
  - `resolveAuthEnabled()` now clearly respects three sources, in this order:
    1. **Explicit runtime config**:
       - `window.RPLUS_CONFIG.authEnabled === true`
       - or `window.RPLUS_AUTH_ENABLED === true`
    2. **Build-time flag**:
       - `AUTH_FLAG_ENV === "true"` (e.g., replaced at deploy time for production).
    3. **Dev/test query param**:
       - `?auth=on|true|1`
  - `AUTH_ENABLED` is derived once from `resolveAuthEnabled()` and is used consistently to gate:
    - Visibility of the `Account` entry.
    - Supabase initialization.
    - All cloud sync behavior (crate, history, vibes, sessions, playlists, session state).
- When none of these sources enables auth, `AUTH_ENABLED` is `false` and the app behaves exactly as the current anonymous/local baseline.

#### 2.2. Intentional Account entry visibility in production

- The `Account` button (`#accountBtn`) is now explicitly treated as a **controlled entry point**:
  - When `AUTH_ENABLED === false`:
    - In the auth wiring block, the code hides `accountBtn` and returns immediately:
      - Ensuring no visible auth entry in anonymous-only deployments.
  - When `AUTH_ENABLED === true` and Supabase is correctly configured:
    - Supabase client (`rplusSupabase`) is initialized.
    - If initialization succeeds:
      - `accountBtn.disabled = false`.
      - `accountBtn.style.opacity = "1"`.
      - Emits a lightweight telemetry event:
        - `auth_entry_visible` with an empty payload.
    - If Supabase is not available or misconfigured:
      - `accountBtn` is hidden and auth wiring returns, preserving the anonymous baseline.

#### 2.3. Auth entry click / modal instrumentation

- When the Account button is clickable and the auth modal is present:
  - `accountBtn.onclick`:
    - Resets the auth UI.
    - If `currentUser` is present, refreshes plan and entitlements for the session.
    - Shows the auth modal (`authModal.style.display = "block"`).
    - Emits:
      - `auth_entry_clicked`
      - `auth_modal_opened`
  - Telemetry is strictly best-effort and wrapped in `try/catch`, so failures never affect the modal or shell.

### 3. Rollout Posture

- **Anonymous/local mode (default)**:
  - `AUTH_ENABLED === false`:
    - No Account button visible.
    - No Supabase client or auth modal wiring active.
    - Core discovery, vibe flows, crate, history, and saved sessions all function as before.
- **Production with auth intentionally enabled**:
  - Set either:
    - `AUTH_FLAG_ENV` to `"true"` at build/deploy, or
    - Provide `window.RPLUS_CONFIG.authEnabled = true` in a small runtime config script.
  - With Supabase env vars correctly configured:
    - The Account button becomes visible and interactive.
    - Existing portal, billing, and cloud-sync behaviors become reachable for signed-in users.
  - If Supabase is partially configured or unavailable:
    - The Account entry is hidden again, preventing a broken auth experience.

### 4. Verification Results

- `scripts/verify_frontend_boot.ps1`:
  - **PASS**
  - Log: `logs/verify_frontend_boot_20260313_084828.log`
- `scripts/verify_prod.ps1`:
  - **PASS**
  - Log: `logs/verify_prod_20260313_084841.log`
- `scripts/verify_local_dev.ps1`:
  - **Env-gated** (SoundCloud creds missing locally):
    - Log: `logs/verify_local_dev_20260313_084853.log`
    - `sc-health` returns HTTP 200 with the expected “Missing SOUNDCLOUD_CLIENT_ID…” message.
    - `sc-official-search` returns HTTP 400, consistent with prior runs.

