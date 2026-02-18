# Residency Quest — Living Master Brief (v9)

## Session Update (Current)
- ✅ RQ-004 completed on `feat/rq-004-class-weighted-xp`
- Implemented class-weighted XP + event-to-stat progression
- Added cooldown dampening and anti-idle behavior
- Added migration: `003_class_weighted_xp.sql`
- Added XP engine module and integrated `award_event_xp`
- Extended Resident API with event XP + stats endpoints
- Added/updated tests; local gates reported passing:
  - `python tools/validate_events.py`
  - `python -m pytest -q`

## Current State
- Main branch currently includes:
  - RQ-001 schema
  - RQ-002 resident card core
  - RQ-003 onboarding + build manager
- Next action: merge RQ-004 into `main` and push.

## Immediate Command Sequence
```powershell
cd "G:\residency-quest"
git checkout feat/rq-004-class-weighted-xp
git status
git log --oneline -n 5
python tools/validate_events.py
python -m pytest -q

git checkout main
git pull --ff-only
git merge --no-ff feat/rq-004-class-weighted-xp -m "merge: RQ-004 class-weighted xp and event stat progression"
git push -u origin main
```

## Next Ticket (RQ-005) Recommendation
- **RQ-005: Ranked Foundation (Divisions + MMR + Weekly Reset)**
  - Tables: `seasons`, `division_tiers`, `build_rank_state`, `match_results`
  - Service: MMR updates, promotion/relegation, weekly reward eligibility
  - API: rank summary, leaderboard page 1, weekly claim preview
  - Tests: MMR monotonicity rules, tier transitions, reset correctness
