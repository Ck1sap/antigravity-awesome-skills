# ROBLOX_HORROR_PIVOT_MASTER_v3

_Last updated: 2026-02-07 09:57 UTC_

## 0) Locked CTO Decisions (Do Not Re-open)
1. **Platform:** Roblox-first (Studio + Luau), 4–6 player co-op.
2. **Creative direction:** **Option A – “Military Ruin Horror”** for V1.
3. **Content strategy:** V1 ships one biome + three missions; B/C saved for seasons.
4. **IP/legal:** Original IP only (tone inspiration allowed; no copied names/designs/plot beats).
5. **Audience/rating:** High tension, low explicit gore for broader reach.
6. **Security:** No “claw-adjacent” download sources. Every external asset scanned before use.

---

## 1) Game Pillars (V1)
- **Loop:** Queue → Deploy → Scavenge Objective → Night Escalation → Extraction → Meta rewards
- **Session length:** 20–30 min
- **Players:** 4–6 co-op
- **Replayability:** mission modifiers + rotating threats + perk progression

---

## 2) World + Mission Slice (Option A)
### Biome: Abandoned Test Valley
- Relay towers, bunkers, dry riverbed, derelict convoy routes
- Dust storms reduce visibility and force team regrouping

### Missions (V1)
1. **Power the Relay** (collect fuses, holdout defense, extraction)
2. **Blackbox Recovery** (multi-location search, alarm consequences)
3. **Signal Scrub** (escort payload through hostile zone, final stand)

### Enemy Archetypes (V1)
- **Scout** (fast harasser)
- **Bruiser** (slow pressure tank)
- **Stalker** (audio/line-of-sight predator)
- **Screamer** (summons/aggro multiplier)
- **Mini-boss:** “Warden Variant” in mission finales

---

## 3) Technical Architecture (Server Authoritative)
- Keep server authority for economy, inventory, mission progress, damage validation
- Client handles UX, VFX, prediction only
- Reuse existing remotes where possible for migration compatibility:
  - ClickRemote, ComboRemote, DailyClaimRemote, FXRemote
  - ObbyCheckpointRemote, ObbyFailRemote, PetEquipRemote, PetHatchRemote
  - PopupTriggerRemote, RebirthRemote, ShopPurchaseRemote, UpgradeRemote, ZoneUnlockRemote

---

## 4) Data Model (V1)
- `PlayerProfile`: currency, perks, cosmetics, mission unlocks, stats
- `RunState`: mission seed, objective states, alive/downed, extraction timers
- `ServerState`: threat phase, active events, spawned encounters
- Persist only what matters between sessions; run-state is ephemeral

---

## 5) Monetization (Ethical + Durable)
- Cosmetic packs (skins, weapon wraps, emotes)
- Convenience passes (loadout slots, queue preference)
- Squad private servers
- Seasonal pass with cosmetics + story logs
- Avoid pay-to-win power spikes

---

## 6) AI/API Acceleration Stack (Approved)
### A) Coding + orchestration
- **OpenAI Responses API** for tool-calling workflows and multi-step assistant actions
- **GPT-5.2 / GPT-5.2-Codex** for long-horizon coding tasks
- **Agents SDK** for planner→coder→tester multi-agent pipelines

### B) Content production
- Use model-assisted generation for:
  - mission variants
  - safe procedural flavor text
  - patch notes + changelog drafts
- Human review required before publish

### C) Telemetry analysis
- Weekly funnel analysis from exported metrics:
  - D1 retention
  - queue-to-start conversion
  - mission completion %
  - store conversion

---

## 7) Security Baseline (Mandatory)
1. **Source control protection**
   - Branch protection + required PR review
   - Secret scanning enabled
2. **Dependency hygiene**
   - Pin versions, hash-lock where possible
3. **Malware/backdoor screening**
   - Windows Defender custom scan for every downloaded asset/tool
   - VirusTotal API check for unknown binaries or archives
4. **Roblox hardening**
   - Validate all remote args server-side
   - Rate-limit critical remotes
   - Add honeypot remotes + consequencing
5. **Open Cloud key safety**
   - Least-privilege scopes only
   - Rotate keys; no keys in client scripts
   - Store secrets in CI secrets manager only

---

## 8) KPI Targets (First 30 Days)
- D1 Retention: 22%+
- D7 Retention: 8%+
- Session length: 16+ min
- Squad extraction rate: 35–55% (tunable)
- ARPPU: track by funnel stage, prioritize conversion quality over brute popups

---

## 9) “No-Drift” Rules
- No browser/all-platform detour for V1
- No major system additions until core loop fun + stable
- Every feature must improve: retention, monetization, or creator velocity

---

## 10) Next Execution Command
Use **CTO_DAY1_BUILD_ORDER_v2.md** as the exact build sequence.
