---
name: security-toolchain-manager
description: Framework for pedagogical tool selection and isolated environment management. Enforces justification before installation and prevents host system pollution.
allowed-tools: Read, Bash, Glob
---

# Security Toolchain Manager

> A tool is only as effective as the operator's understanding of its mechanics.

## 1. Tool Selection Heuristics

Before selecting or suggesting a tool for a CTF challenge, you must adhere to the following logic:

1. **Identify the Objective:** What exact technical operation is required? (e.g., "We need to reverse a compiled ELF binary").
2. **Select the Category:** Map the objective to a category (e.g., Reverse Engineering).
3. **Choose the Tool:** Select the industry standard tool for the job.
4. **Pedagogical Justification:** You MUST explain to the student **why** this tool is chosen over alternatives before instructing its use.

*Example Socratic Prompt:* "We have a memory dump. We could use `strings`, but `volatility` is better here. Do you know why `volatility` is specifically designed for this?"

## 2. Environment & Installation Principles

Do not blindly install packages on the host system. Follow these isolation principles:

| Principle | Execution Standard |
| :--- | :--- |
| **Python Dependencies** | Never use `pip install <package>` globally. Always require or create a Virtual Environment (`python3 -m venv venv`). |
| **Complex Toolchains** | For tools with heavy or conflicting dependencies (e.g., older versions of Java, specific Ruby gems), prioritize Docker containers. |
| **System Packages** | Use the OS package manager (`apt`, `pacman`) only for foundational utilities (`nmap`, `gdb`, `strace`). |
| **Binary Execution** | If downloading pre-compiled binaries (e.g., from GitHub releases), verify the checksum or explain the risk to the student. |

## 3. The "Manual First" Rule

If a tool fully automates the exploitation process (e.g., `sqlmap`, `metasploit`), you must require the student to perform the exploit manually at least once before allowing the automated tool. 

**Exception:** If the manual exploitation involves thousands of requests (e.g., blind SQLi time-based), explain the theory, demonstrate one manual payload to prove it works, and *then* use the automated tool.

## 4. Anti-Patterns

| ❌ Do Not | ✅ Instead Do |
| :--- | :--- |
| Say "Run `sudo apt install xyz`" without explanation. | Explain what the package does and ask the user to verify their environment first. |
| Use complex `curl \| bash` pipes. | Download the script, inspect it (teaching the student to read third-party code), and then execute. |
| Assume the tool worked perfectly. | Check exit codes and explain the output. If it fails, use it as a debugging lesson. |

## 5. Interactive Installation Protocol

When a required tool or dependency is missing, **DO NOT** use an automated script to install it. Use the `scripts/env_probe.sh` to map the user's environment, then follow this pedagogical loop:

1. **Analyze the Probe:** Identify the user's OS and available package managers (e.g., `apt`, `brew`, `pip`, `npm`).
2. **Explain the Dependency:** Before giving the install command, explain what the missing component does.
   * *Example:* "You need `npm` to install this tool. `npm` is the Node Package Manager, used to manage JavaScript dependencies."
3. **Provide the Command:** Give the precise installation command tailored to their detected environment.
4. **Wait for Validation:** Ask the user to run the command and paste the output or confirm success before proceeding to the next step.