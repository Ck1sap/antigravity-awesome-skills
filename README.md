# 🎓 CTF Professor — Cybersecurity Education Agent System

> **Um sistema de agentes de IA focado em ensinar cibersegurança através de CTF, não apenas em resolver desafios.**
>
> **An AI agent system focused on teaching cybersecurity through CTF, not just solving challenges.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Language: PT-BR](https://img.shields.io/badge/Idioma-PT--BR-009c3b)](README.md)
[![Language: EN](https://img.shields.io/badge/Language-EN-blue)](README.md)
[![Antigravity](https://img.shields.io/badge/Powered%20by-Antigravity-red)](https://antigravity-kit.unikorn.vn)
[![Status: Active Development](https://img.shields.io/badge/Status-Active%20Development-orange)](https://github.com/magalz/awesome-cybersecurity-ctf-professor-skills/tree/agent-development)
[![Forked from](https://img.shields.io/badge/Forked%20from-sickn33%2Fantigravity--awesome--skills-lightgrey)](https://github.com/sickn33/antigravity-awesome-skills)

---

## Idioma / Language

- 🇧🇷 [Português Brasileiro](#português-brasileiro) ← *Idioma principal*
- 🇺🇸 [English](#english) ← *Primary documentation reference*

---

## English

### What is this?

**CTF Professor** is a fork of the [Antigravity Awesome Skills](https://github.com/sickn33/antigravity-awesome-skills) project, transformed into a **cybersecurity educational environment** centered on Capture The Flag (CTF) methodology.

Unlike tools that solve challenges automatically, this system behaves like a **Cybersecurity Professor**:

- It **teaches**, not just solves
- It **guides** through structured reasoning
- It **challenges** your thinking with Socratic questions
- It **enforces** a learning methodology before allowing execution
- It **connects** CTF vulnerabilities to real-world enterprise security

### Core Philosophy

> *"Do not just teach how to find the flag; teach the understanding of the vulnerability that allowed it to exist."*

### The Learning Cycle

Every CTF session follows a structured 6-phase learning cycle:

```
1. SCENARIO ANALYSIS      → Categorize the challenge, form initial hypotheses
2. GUIDED RECONNAISSANCE  → Identify attack vectors with pedagogical explanations
3. THEORETICAL FOUNDATION → Understand the vulnerability before touching any tool
4. CONTROLLED EXPLOITATION → Build the exploit step-by-step with Socratic gates
5. FLAG ACQUISITION        → Validate success; explain what the flag represents
6. MITIGATION & WRITEUP   → Translate the flaw to enterprise risk and remediation
```

### Agent System

| Agent | Role | Status |
|:---|:---|:---|
| `ctf-professor` | Lead orchestrator — Socratic educator and pedagogical gatekeeper | ✅ Active |
| `security-auditor` | Code review and vulnerability assessment challenges | ✅ Active |
| `penetration-tester` | Full engagement simulation challenges | ✅ Active |
| `challenge-classifier` | Classifies challenges by category before solving begins | 🚧 Planned |
| `reverse-engineering-specialist` | Static/dynamic binary analysis with assembly-level guidance | 🚧 Planned |
| `binary-exploit-engineer` | Builds exploitation payloads using iterative construction | 🚧 Planned |
| `forensics-analyst` | PCAP, memory forensics, steganography, artifact analysis | 🚧 Planned |
| `crypto-analyst` | Cipher identification and mathematical weakness analysis | 🚧 Planned |

### Skill Stack

#### Core Skills (Active)
| Skill | Purpose |
|:---|:---|
| `ctf-triage-methodology` | Pedagogical initial recon — no blind execution |
| `security-toolchain-manager` | Tool selection with justification, isolated environments |
| `controlled-execution-framework` | Exploitation with Socratic gates and iterative construction |
| `ctf-writeup-architect` | Root-cause writeups with corporate impact translation |
| `i18n-localization` | PT-BR / EN bilingual support |

#### Domain Skills (Planned)
`ctf-challenge-classifier` · `reverse-engineering-analysis` · `binary-exploitation-guide` · `web-exploitation-methodology` · `cryptography-analysis` · `forensics-investigation` · `osint-methodology` · `hint-generation-engine`

### Workflows (Slash Commands)

| Command | Purpose | Status |
|:---|:---|:---|
| `/start-ctf` | Start the structured learning cycle | ✅ Active |
| `/debug-exploit` | Socratic debugging when an exploit fails | ✅ Active |
| `/writeup` | Generate a pedagogical report after flag capture | ✅ Active |
| `/hint` | Request a calibrated hint without getting the answer | 🚧 Planned |
| `/classify-challenge` | Run classification pipeline on a challenge | 🚧 Planned |
| `/analyze-binary` | Deep-dive guided binary analysis | 🚧 Planned |
| `/explain-vulnerability` | Pure educational explanation of any vulnerability class | 🚧 Planned |
| `/threat-model` | Build a corporate STRIDE threat model from a CTF finding | 🚧 Planned |
| `/replay-exploit` | Re-run a completed exploit for retention testing | 🚧 Planned |

### Project Structure

```
NEW/
├── agents/              # Specialist AI agent definitions
│   ├── cybersecurity-professor-ctf.md
│   ├── security-auditor.md
│   ├── penetration-tester.md
│   └── ...
├── skills/              # Domain-specific knowledge modules
│   ├── ctf-triage-methodology/
│   │   ├── skill.MD
│   │   ├── scripts/
│   │   │   ├── safe_extract.sh
│   │   │   └── entropy_analyzer.py
│   │   └── checklists/
│   ├── controlled-execution-framework/
│   │   ├── SKILL.md
│   │   ├── templates/
│   │   │   └── exploit_scaffold.py
│   │   └── checklists/
│   │       └── pedagogical-gate.md
│   ├── security-toolchain-manager/
│   │   └── scripts/
│   │       └── verify_toolchain.sh
│   ├── ctf-writeup-architect/
│   │   ├── templates/
│   │   │   └── writeup_base.md
│   │   └── scripts/
│   │       └── log_aggregator.sh
│   └── ...
├── workflows/           # Slash command procedures
│   ├── start-ctf.md
│   ├── debug-exploit.md
│   └── writeup.md
├── rules/
│   └── GEMINI.md        # Global rules
└── scripts/             # Master orchestration scripts
    ├── checklist.py
    └── verify_all.py
```

### Quick Start

1. **Clone the repository** (use the `agent-development` branch for latest CTF features):
   ```bash
   git clone -b agent-development https://github.com/magalz/awesome-cybersecurity-ctf-professor-skills.git
   ```

2. **Install skills** into your Antigravity/Gemini CLI workspace:
   ```bash
   cp -r NEW/ .agent/
   ```

3. **Start a CTF session**:
   ```
   /start-ctf web http://10.10.10.10
   /start-ctf pwn vulnerable_binary
   /start-ctf pcap capture.pcapng
   ```

4. **When stuck**, ask for a hint:
   ```
   /hint
   ```

### CTF Categories Supported

| Category | Skills | Status |
|:---|:---|:---|
| Web | `web-exploitation-methodology` | 🚧 Planned |
| Binary Exploitation (Pwn) | `binary-exploitation-guide`, `exploit_scaffold.py` | ✅ Partial |
| Reverse Engineering | `reverse-engineering-analysis` | 🚧 Planned |
| Cryptography | `cryptography-analysis` | 🚧 Planned |
| Forensics / Steganography | `forensics-investigation` | 🚧 Planned |
| OSINT | `osint-methodology` | 🚧 Planned |

---

## Português Brasileiro

### O que é isso?

**CTF Professor** é um fork do projeto [Antigravity Awesome Skills](https://github.com/sickn33/antigravity-awesome-skills), transformado em um **ambiente educacional de cibersegurança** centrado na metodologia de Capture The Flag (CTF).

Diferente de ferramentas que resolvem desafios automaticamente, este sistema se comporta como um **Professor de Cibersegurança**:

- Ele **ensina**, não apenas resolve
- Ele **guia** por raciocínio estruturado
- Ele **desafia** seu pensamento com perguntas socrática
- Ele **aplica** uma metodologia de aprendizado antes de permitir a execução
- Ele **conecta** as vulnerabilidades do CTF com a segurança corporativa do mundo real

### Filosofia Central

> *"Não ensine apenas como encontrar a flag; ensine a compreensão da vulnerabilidade que permitiu sua existência."*

### O Ciclo de Aprendizado

Cada sessão de CTF segue um ciclo estruturado de 6 fases:

```
1. ANÁLISE DO CENÁRIO    → Categorizar o desafio, formular hipóteses iniciais
2. RECONHECIMENTO GUIADO → Identificar vetores de ataque com explicações pedagógicas
3. BASE TEÓRICA          → Compreender a vulnerabilidade antes de usar qualquer ferramenta
4. EXPLORAÇÃO CONTROLADA → Construir o exploit passo a passo com gates socráticas
5. CAPTURA DA FLAG       → Validar o sucesso; explicar o que a flag representa
6. MITIGAÇÃO E WRITEUP   → Traduzir a falha para risco corporativo e remediação
```

### Sistema de Agentes

| Agente | Função | Status |
|:---|:---|:---|
| `ctf-professor` | Orquestrador principal — educador socrático e guardião pedagógico | ✅ Ativo |
| `security-auditor` | Desafios de revisão de código e avaliação de vulnerabilidades | ✅ Ativo |
| `penetration-tester` | Simulação de engajamento completo | ✅ Ativo |
| `challenge-classifier` | Classifica desafios por categoria antes de começar a resolver | 🚧 Planejado |
| `reverse-engineering-specialist` | Análise binária estática/dinâmica com orientação em assembly | 🚧 Planejado |
| `binary-exploit-engineer` | Constrói payloads de exploração com construção iterativa | 🚧 Planejado |
| `forensics-analyst` | PCAP, forense de memória, esteganografia, análise de artefatos | 🚧 Planejado |
| `crypto-analyst` | Identificação de cifras e análise de fraquezas matemáticas | 🚧 Planejado |

### Habilidades (Skills)

#### Habilidades Core (Ativas)
| Habilidade | Propósito |
|:---|:---|
| `ctf-triage-methodology` | Reconhecimento inicial pedagógico — sem execução cega |
| `security-toolchain-manager` | Seleção de ferramentas com justificativa, ambientes isolados |
| `controlled-execution-framework` | Exploração com gates socráticas e construção iterativa |
| `ctf-writeup-architect` | Writeups de causa raiz com tradução para impacto corporativo |
| `i18n-localization` | Suporte bilíngue PT-BR / EN |

#### Habilidades de Domínio (Planejadas)
`ctf-challenge-classifier` · `reverse-engineering-analysis` · `binary-exploitation-guide` · `web-exploitation-methodology` · `cryptography-analysis` · `forensics-investigation` · `osint-methodology` · `hint-generation-engine`

### Fluxos de Trabalho (Slash Commands)

| Comando | Propósito | Status |
|:---|:---|:---|
| `/start-ctf` | Iniciar o ciclo de aprendizado estruturado | ✅ Ativo |
| `/debug-exploit` | Depuração socrática quando um exploit falha | ✅ Ativo |
| `/writeup` | Gerar relatório pedagógico após captura da flag | ✅ Ativo |
| `/hint` | Solicitar uma dica calibrada sem receber a resposta | 🚧 Planejado |
| `/classify-challenge` | Executar pipeline de classificação em um desafio | 🚧 Planejado |
| `/analyze-binary` | Análise guiada aprofundada de binário | 🚧 Planejado |
| `/explain-vulnerability` | Explicação educacional pura de qualquer classe de vulnerabilidade | 🚧 Planejado |
| `/threat-model` | Construir modelo de ameaças STRIDE corporativo a partir de um finding de CTF | 🚧 Planejado |
| `/replay-exploit` | Re-executar um exploit completo para teste de retenção | 🚧 Planejado |

### Como Começar

1. **Clone o repositório** (use o branch `agent-development` para os recursos CTF mais recentes):
   ```bash
   git clone -b agent-development https://github.com/magalz/awesome-cybersecurity-ctf-professor-skills.git
   ```

2. **Instale as skills** no seu workspace Antigravity/Gemini CLI:
   ```bash
   cp -r NEW/ .agent/
   ```

3. **Inicie uma sessão CTF**:
   ```
   /start-ctf web http://10.10.10.10
   /start-ctf pwn binario_vulneravel
   /start-ctf pcap captura.pcapng
   ```

4. **Quando travar**, peça uma dica:
   ```
   /hint
   ```

### Categorias de CTF Suportadas

| Categoria | Habilidades | Status |
|:---|:---|:---|
| Web | `web-exploitation-methodology` | 🚧 Planejado |
| Exploração de Binários (Pwn) | `binary-exploitation-guide`, `exploit_scaffold.py` | ✅ Parcial |
| Engenharia Reversa | `reverse-engineering-analysis` | 🚧 Planejado |
| Criptografia | `cryptography-analysis` | 🚧 Planejado |
| Forense / Esteganografia | `forensics-investigation` | 🚧 Planejado |
| OSINT | `osint-methodology` | 🚧 Planejado |

---

## Contributing / Contribuindo

- **New agents/skills:** Follow the `SKILL.md` format documented in [NEW/skills/doc.md](NEW/skills/doc.md)
- **Novas habilidades:** Siga o formato `SKILL.md` documentado em [NEW/skills/doc.md](NEW/skills/doc.md)
- Branch de desenvolvimento: `agent-development`

---

## Credits / Créditos

This project is built on top of the following open-source foundations:

| Project | Role |
|:---|:---|
| [sickn33/antigravity-awesome-skills](https://github.com/sickn33/antigravity-awesome-skills) | Original upstream skills repository — 1,254+ agentic skills |
| [Antigravity Kit](https://antigravity-kit.unikorn.vn) | Agent/Skill/Workflow framework documentation |

All upstream work retains its original MIT License. This fork's CTF-specific additions are also MIT licensed.

---

## License

MIT License. See [LICENSE](LICENSE) for details.
