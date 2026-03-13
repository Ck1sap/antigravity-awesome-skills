---
description: Start new CTF challenge resolution. Triggers the pedagogical learning cycle and coordinates triage, toolchain, and execution skills.
---

# /start-ctf - Start CTF Resolution

$ARGUMENTS

---

## Task

This command initiates a structured, pedagogical approach to solving a Capture The Flag (CTF) challenge. It enforces the "Learning Cycle" and prevents blind execution.

### Steps:

1. **Scenario Analysis & Triage**
   - Orchestrate with `ctf-triage-methodology` skill.
   - Run `safe_extract.sh` or equivalent static analysis if a file is provided.
   - Formulate initial hypotheses without executing any dynamic payloads.
   - If information is missing, ask the user to provide the target (IP, URL, or file).

2. **Environment & Toolchain Preparation**
   - Orchestrate with `security-toolchain-manager` skill.
   - Run `env_probe.sh` to map the user's operating system and package managers.
   - Determine required tools for the identified challenge category.
   - Guide the user through the Interactive Installation Protocol if dependencies are missing. Explain the purpose of each tool.

3. **Theoretical Foundation & Controlled Exploitation**
   - Orchestrate with `controlled-execution-framework` skill.
   - Enforce the Pedagogical Gate: Explain the vulnerability theory before building the payload.
   - Use the `exploit_scaffold.py` structure.
   - Require the user to predict the outcome before executing the exploit.
   - Perform Socratic Debugging if the exploit fails.

4. **Review & Mitigation (Upon Flag Capture)**
   - Orchestrate with `ctf-writeup-architect` skill.
   - Consolidate the chat history and successful commands into the `writeup_base.md` template.
   - Detail the real-world enterprise impact and mitigation strategies.

---

## Usage Examples

/start-ctf
/start-ctf web http://10.10.10.10
/start-ctf pcap capture.pcapng
/start-ctf pwn vulnerable_binary


---

## Before Starting

If the request lacks context, ask the following questions before triggering the triage phase:
- What is the category of this CTF challenge (e.g., Web, Crypto, Pwn, Forensics)?
- Do you have a target file, an IP address, or a URL?
- What is your immediate initial hypothesis based on the challenge description?

Do not proceed to step 2 until step 1 is fully resolved and explained.