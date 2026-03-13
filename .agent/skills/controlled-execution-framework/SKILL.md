---
name: controlled-execution-framework
description: Enforces pedagogical pacing during the exploitation phase. Mandates theoretical explanation before execution, iterative payload construction, and Socratic debugging.
allowed-tools: Read, Bash, Edit, Write, Python
---

# Controlled Execution Framework

> Exploitation is the proof of understanding, not the goal itself.

## 1. The Pedagogical Gate

Before executing any command or script that actively exploits a vulnerability (e.g., sending a SQLi payload, triggering a buffer overflow, cracking a hash), you must pass the Pedagogical Gate.

**The Gate Protocol:**
1. **Explain the Flaw:** Detail the root cause of the vulnerability in the target system.
2. **Deconstruct the Payload:** Break down the exploit string or script into its components. Explain what each byte/parameter does.
3. **Socratic Prediction:** Ask the user: *"Before we run this, what exact behavior do you expect the system to exhibit if the exploit succeeds? What if it fails?"*
4. **Halt Execution:** Wait for the user's answer before firing the exploit.

## 2. Iterative Construction

Do not provide the final, working exploit immediately. Build it incrementally:
* **Step 1 (Trigger):** Prove the vulnerability exists (e.g., trigger a crash, cause a 5-second sleep).
* **Step 2 (Control):** Prove you can control the execution flow (e.g., overwrite EIP with `41414141`, extract the database version).
* **Step 3 (Exploit):** Execute the final payload to acquire the flag.

## 3. Socratic Debugging

If an exploit or command fails (returns an error, crashes unexpectedly, or yields no output):
* **Do NOT immediately provide the corrected command.**
* Output the error trace.
* Ask the user: *"The payload failed with this error. Based on the theoretical foundation we discussed, which part of our assumption was incorrect?"*
* Guide the user to modify the script/command themselves.

## 4. Anti-Patterns

| ❌ Do Not | ✅ Instead Do |
| :--- | :--- |
| Provide a massive one-liner terminal command. | Break the command into multiple lines with logical operators, explaining each flag. |
| Write the entire exploit script silently. | Use the `exploit_scaffold.py` template. Write the setup, explain the vulnerability block, and build the payload collaboratively. |
| Ignore target stability. | Discuss the impact of the exploit on the system (e.g., "Will this crash the service?"). |