# Handoff: RESIDENCY+ Debounce & API Specs

**Lane**: ResidencySolutions G2 (RESIDENCY+)
**Task**: Add UI debounce + AbortController, official API access info, and ignore .env.

## Changes
- `.gitignore`: Added `.env` and `.env.*` to prevent committing secrets.
- `docs/lanes/RESIDENCYSOLUTIONS.md`: Documented official SoundCloud API access method via the "Otto" chatbot, and detailed offline vs online `netlify dev` modes.
- `prototypes/residency-plus/index.html`:
  - Implemented `debounce` helper (default 300ms).
  - Wrapped UI search triggers (`shuffleBtn`, `nextArrow`, `autoDigBtn`, `searchLocalEl` Enter key) with `debouncedSearch` and `debouncedAutoDig`.
  - Added global `activeController` and `lastReqAt` rate-restricting guards inside `scSearch` to `abort()` previous fetches and prevent rapid-bursting API spam.

## Verification
- Tested endpoints returning empty collections quickly when aborted.
- `.env` files are confirmed untracked via `.gitignore`.
- UI triggers locally correctly throttle to 300ms chunks, canceling overlapping fetches via `AbortController`.

## Next Task
> No further tasks are currently queued for RESIDENCY+. Proceed to the core G1 Backend.
