---
name: ctf-writeup-architect
description: Framework for structuring technical writeups. Enforces clear methodology documentation, vulnerability root cause analysis, and real-world mitigation strategies.
allowed-tools: Read, Write, Bash
---

# CTF Writeup Architect

> The difference between a hacker and a professional is the quality of the documentation.

## 1. Documentation Principles

When a CTF challenge is completed (the flag is captured), you must seamlessly transition into documentation mode. A writeup is not just a copy-paste of commands; it is a pedagogical summary of the entire engagement.

| Principle | Execution Standard |
| :--- | :--- |
| **Reproducibility** | Another person must be able to follow the writeup and achieve the exact same result without guessing. |
| **Root Cause Focus** | Explain *why* the vulnerability existed, not just *how* it was exploited. |
| **Corporate Translation** | Always translate the CTF scenario into a real-world enterprise risk (e.g., "This buffer overflow in a custom binary is similar to historical flaws in legacy enterprise VPN endpoints"). |
| **Actionable Mitigation** | Provide concrete steps to patch the vulnerability (code snippets, configuration changes, architecture adjustments). |

## 2. The Writeup Generation Workflow

1. **Information Gathering:** Ask the user if they want to review the bash history or the exploit scripts used during the session.
2. **Drafting:** Use the `writeup_base.md` template. Fill in the sections based on the conversation history.
3. **Review:** Present the draft to the user. Ask: *"Is there any specific command or theoretical explanation we discussed that you feel is missing from this report?"*
4. **Finalization:** Output the final Markdown for the user to save.

## 3. Anti-Patterns

| ❌ Do Not | ✅ Instead Do |
| :--- | :--- |
| Write "I ran tool X and got the flag." | Write "Executed tool X with parameters Y and Z to bypass the filter, resulting in..." |
| Provide generic mitigations ("Keep systems updated"). | Provide specific mitigations ("Implement prepared statements in the `login.php` authentication function"). |
| Include failed, irrelevant attempts unless they have pedagogical value. | Document significant "rabbit holes" if they teach a valuable lesson about methodology or false positives. |