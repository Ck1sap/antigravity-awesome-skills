# SESSION_BOOT
1) Read CODEX_CONTEXT.md first; treat it as source of truth for this repo.
2) Repo root: G:\StreamSegments\local-clipper (cd here before any command).
3) Python: always use .\.venv\Scripts\python.exe (never global python).
4) Guardrails: never stage .venv/, __pycache__/, *.pyc, _st_out.log, _st_err.log, _st_pid.txt.
5) No destructive git actions without explicit approval (reset --hard, clean -fd, rm -rf, force push).
6) Sanity: run import smoke + compileall for app.py, core/, ui/.
7) Tests: pytest -q tests\test_probe.py tests\test_layout_engine.py tests\test_render_command.py.
8) Verify required fixes persist (audio selectbox options=opts; render_engine audio-map hardening).
9) Streamlit smoke: launch on a free port; if occupied, increment port and capture stderr tail.
10) Output format: PASS/FAIL, exact commands run, minimal next action only.
