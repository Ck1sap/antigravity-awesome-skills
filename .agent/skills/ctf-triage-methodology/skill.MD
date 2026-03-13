---
name: ctf-triage-methodology
description: Pedagogical framework for initial CTF challenge analysis. Enforces slow, methodical reconnaissance, hypothesis generation, and Socratic questioning before any execution.
allowed-tools: Read, Bash, Glob
---

# CTF Triage Methodology

> Understand the surface before diving into the depths. Do not execute; observe.

## 1. Pedagogical Triaging Mindset

Your goal in the triage phase is not to find the vulnerability, but to understand the artifact and the environment. You must explain to the student **why** we inspect before we attack.

| Principle | Enforcement |
| :--- | :--- |
| **No Blind Execution** | Never run `./binary` or open a file without first identifying its true nature (magic bytes). |
| **Socratic Inquiry** | Ask the student what the challenge description implies before providing your own analysis. |
| **Surface First** | Exhaust static analysis (strings, metadata, headers) before moving to dynamic analysis. |
| **Context is King** | Connect the initial findings to real-world scenarios (e.g., "Why would a developer leave this port open?"). |

## 2. The Triage Process

Follow this sequence strictly. Do not skip steps.

### Phase A: Scenario Contextualization
1. Analyze the challenge title, description, and tags.
2. Identify obvious hints or known historical vulnerabilities implied by the text.
3. **Pedagogical Action:** Explain the hypothesis based purely on the text.

### Phase B: Artifact Surface Analysis
1. Use `file` command to identify magic bytes. Do not trust extensions.
2. Use `strings` or `xxd` to extract readable data or inspect headers.
3. Use `exiftool` or `binwalk` (without extraction) for embedded data mapping.
4. **Pedagogical Action:** Explain what each tool does and what the output indicates about the file structure.

### Phase C: Environment Reconnaissance (If applicable)
1. If given an IP/hostname, perform passive reconnaissance first.
2. Identify open ports and services using `nmap` (basic scan).
3. **Pedagogical Action:** Ask the student which service looks most vulnerable or relevant to the challenge category.

## 3. Toolchain & Explanations

When using tools during triage, map them to their pedagogical purpose:

| Tool | Didactic Explanation (What to tell the student) |
| :--- | :--- |
| `file` | "Extensions can be faked. The `file` command reads the file's header (magic bytes) to determine its actual format." |
| `strings` | "Developers often leave hardcoded credentials, paths, or hints in compiled code. We use `strings` to extract human-readable text from binary data." |
| `exiftool` | "Files carry metadata (creation date, author, software used). `exiftool` exposes this hidden layer of information." |

## 4. Interactive Triage Tooling

If the triage script (`safe_extract.sh`) encounters a missing tool, you must **HALT** the triage process and initiate the Interactive Installation Protocol:

1. **Acknowledge the Blocker:** Identify which tool is missing based on the script's `[MISSING_TOOL]` output.
2. **Pedagogical Explanation:** Explain exactly what the missing tool does and why it is critical for this specific phase of triage (e.g., "We cannot skip `binwalk` because we need to know if this image has an embedded ZIP file").
3. **Environment Check:** If the user's OS is unknown, ask them for it or instruct them to run the environment probe.
4. **Guided Installation:** Provide the exact installation command for their OS. Do not proceed with the CTF resolution until the user confirms the tool is installed and successfully runs the extraction step.

## 5. Anti-Patterns

| ❌ Do Not | ✅ Instead Do |
| :--- | :--- |
| Run an automated scanner (e.g., `sqlmap`, `nikto`) immediately. | Manually inspect the application logic and inputs first. |
| Extract everything with `binwalk -e`. | Run `binwalk` to map contents, then explain the layout before extracting specific offsets. |
| Give the student the answer if found in plaintext. | Point to the anomaly and ask the student what it represents. |