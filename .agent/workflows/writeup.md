---
description: Generate a comprehensive CTF writeup based on the session history. Triggers the writeup architect skill.
---

# /writeup - Generate CTF Report

$ARGUMENTS

---

## Task

This command transitions the session from execution to documentation. It aggregates the context of the current conversation to produce a pedagogical and professional CTF writeup.

### Steps:

1. **Context Aggregation**
   - Scan the immediate conversation history for successful commands, identified vulnerabilities, and executed scripts.
   - Identify the challenge category, tools used, and the root cause discussed during the pedagogical gates.

2. **Draft Generation**
   - Orchestrate with `ctf-writeup-architect` skill.
   - Populate the `writeup_base.md` template using the aggregated context.
   - Ensure the "Real-World Impact & Mitigation" section translates the CTF flaw into a corporate enterprise scenario.

3. **User Review**
   - Present the drafted writeup to the user.
   - Ask for confirmation on the exact payloads used and if any manual steps performed outside the chat need to be included.

4. **Finalization**
   - Apply user corrections.
   - Output the final Markdown code block for the user to save.

---

## Usage Examples

/writeup
/writeup focus on the buffer overflow mitigation
/writeup partial report for triage phase

---

## Before Starting

If the CTF is not yet completed, clarify the scope:
- Are we writing a partial report up to our current progress, or have you captured the flag outside of this chat?
- Are there any specific enterprise mitigation standards (e.g., OWASP, NIST) you want applied to the conclusion?