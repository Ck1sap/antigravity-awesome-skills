# CODEX_CONTEXT.md
_Last updated: 2026-02-10_

## 1) Project Snapshot
- **Project:** Local Clipper V6.0 — Parity Core
- **Repo path:** `G:\StreamSegments\local-clipper`
- **Primary app:** `app.py` (Streamlit)
- **Architecture:** modular `core/` + `ui/` refactor
- **Goal:** StreamLadder-style local-first clip editor with stable render pipeline and parity behavior

---

## 2) What’s Implemented (V6 Parity Core)
- Modularized app into:
  - `core/`: state, indexing, probe, roi, layout_engine, render_engine, ai_highlights, captions_engine
  - `ui/`: sidebar, preview, panels (layouts/elements/effects/audio/captions/export), theme
- Added:
  - Layout presets + layout engine
  - ROI editor + auto-suggest ROI
  - Elements/effects pipeline
  - Captions (manual SRT + optional faster-whisper auto-captions)
  - Audio source selection incl. music-only
  - Export profiles + queue
  - AI highlight suggestions
  - NVENC render with libx264 fallback
  - yuv420p + faststart enforcement
- Docs added:
  - `README_V6.md`
  - `MIGRATION_V5_TO_V6.md`
- Tests added:
  - `tests/test_probe.py`
  - `tests/test_layout_engine.py`
  - `tests/test_render_command.py`

---

## 3) Verified Status (from last run)
- Import smoke:
  - `import app` ✅
- Compile smoke:
  - `compileall` on `app.py`, `core`, `ui` ✅
- Pytest:
  - full suite passed: **3 passed** ✅
- Streamlit startup:
  - earlier failures: port `8501` and `8502` in use
  - final smoke: startup on `8501` succeeded; URLs printed ✅

---

## 4) Known Important Diffs / Fixes
### `ui/panels/audio.py`
- `st.selectbox` explicitly uses `options=opts` (instead of positional list arg).

### `core/render_engine.py`
- audio map logic hardened for:
  - `audio_source == "none"` => `-an`
  - `audio_source == "music_only"` => map music input
  - source mapping for cam/v1/v2 behavior

> Note: Keep this mapping stable; this area is easy to regress during refactors.

---

## 5) Repo Hygiene / Git State
- Branch created: `feat/v6-parity-core`
- `.venv` was accidentally staged once due broad add; removed from index using cached remove.
- `.gitignore` should include:
  - `.venv/`
  - `__pycache__/`
  - `*.pyc`
  - `_st_out.log`
  - `_st_err.log`
  - `_st_pid.txt`

**Rule:** never run `git add .` before verifying `.venv` is excluded.

---

## 6) Acceptance Checklist (current)
From `README_V6.md`:
- [ ] A) Load one source as CAM+VIDEO1, render 1080x1920 mp4 with audio
- [ ] B) Load VIDEO2 and verify each layout preset (including attention motion)
- [ ] C) Apply text + sticker + color boost + SRT and export
- [ ] D) Generate AI highlight suggestions and apply one
- [ ] E) Verify NVENC-unavailable path succeeds via libx264 fallback

Pytests are green, but **manual acceptance still needs full end-to-end confirmation**.

---

## 7) Next Session Start Protocol (Codex)
1. Read this file (`CODEX_CONTEXT.md`) first.
2. Confirm repo + branch:
   - `git rev-parse --show-toplevel`
   - `git branch --show-current`
3. Sanity checks:
   - import/compile smoke
   - pytest quick/full
4. Port handling before Streamlit launch:
   - if port busy, either stop owner or run on free port
5. Run app smoke, then execute acceptance checklist A→E.
6. Only then commit incremental fixes.

---

## 8) Commands (copy/paste)
```powershell
# In repo root
$py = ".\.venv\Scripts\python.exe"

# sanity
& $py -c "import app; print('app import OK')"
& $py -m compileall .\app.py .\core .\ui
& $py -m pytest -q

# check streamlit port owner (example 8501)
(Get-NetTCPConnection -LocalPort 8501 -State Listen -ErrorAction SilentlyContinue).OwningProcess |
  ForEach-Object { Get-Process -Id $_ | Select-Object Id,ProcessName,Path }

# run streamlit (choose free port)
& $py -m streamlit run .\app.py --server.port 8501
# fallback:
& $py -m streamlit run .\app.py --server.port 8503
```
