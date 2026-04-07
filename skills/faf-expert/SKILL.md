---
name: faf-expert
description: "Advanced .faf (Foundational AI-context Format) specialist. IANA-registered format, MCP server config, championship scoring, bi-directional sync."
category: coding
risk: safe
source: community
source_repo: Wolfe-Jam/faf-cli
source_type: community
date_added: "2026-04-07"
author: wolfejam
tags: [faf, ai-context, project-management, mcp, iana]
tools: [claude, cursor, gemini, windsurf]
---

# FAF Expert - Advanced AI Context Architecture

**Master the IANA-registered format that makes AI understand your projects.**

Transform any codebase into an AI-intelligent project with persistent context that survives across sessions, tools, and AI platforms. Expert-level control over the foundational layer that powers modern AI development workflows.

## When to Use This Skill

Use FAF Expert when you need:

| Scenario | What FAF Expert Provides |
|----------|---------------------------|
| **Complex project setup** | Expert configuration of .faf files and MCP servers |
| **Championship scoring** | Achieve 85%+ AI-readiness scores for production projects |
| **Multi-AI workflows** | Universal context that works across Claude, Cursor, Gemini, Windsurf |
| **Legacy codebase revival** | Transform archaeology into AI-readable project DNA |
| **Team collaboration** | Standardized context format for consistent AI assistance |
| **Enterprise deployment** | Professional MCP server configuration and management |

## Real-World Examples

### Example 1: Legacy Enterprise Codebase
```yaml
# Before: 0% AI-readiness
# After: 92% Gold tier with FAF Expert
project:
  name: enterprise-legacy-api
  goal: Mission-critical payment processing system
  
stack:
  backend: java-spring
  database: oracle
  runtime: java-11
  deployment: kubernetes
  
human_context:
  where: AWS EKS production cluster
  when: Legacy system from 2018, modernizing 2026
  how: Spring Boot 2.7, Oracle 19c, Docker containerization
```

### Example 2: Modern React Application
```yaml
# Achieved: 97% Gold tier performance
project:
  name: modern-react-dashboard
  goal: Real-time analytics dashboard for SaaS platform
  
stack:
  frontend: react-18
  css_framework: tailwind
  state: zustand
  build: vite
  testing: vitest
  deployment: vercel
```

### Example 3: Multi-Service Architecture
```yaml
# Enterprise microservices: 89% Bronze tier
project:
  name: microservices-platform
  goal: Scalable e-commerce backend architecture
  
stack:
  api_gateway: kong
  services: node-typescript
  database: mongodb
  message_queue: redis
  deployment: docker-compose
```

## Core Technology

### IANA-Registered Format

**Media Type:** `application/vnd.faf+yaml`  
**Registry:** Internet Assigned Numbers Authority (IANA)  
**Draft:** IETF Internet-Draft filed (draft-wolfe-faf-format)  
**Status:** Official web standard for AI project context

### Architecture Overview

```
project/
├── package.json     ← Dependencies (npm reads this)
├── project.faf      ← AI Context (AI reads this)
├── CLAUDE.md        ← Human docs (synced from .faf)
└── src/             ← Code (guided by context)
```

**The Three-Layer Stack:**
1. **Foundation Layer**: `.faf` files (machine-readable YAML)
2. **Translation Layer**: Auto-sync to platform-specific formats
3. **AI Interface Layer**: Direct consumption by AI assistants

### Universal Compatibility

| AI Platform | Format | Sync Command |
|-------------|--------|---------------|
| Claude Desktop | CLAUDE.md | `faf bi-sync` |
| Cursor IDE | .cursorrules | `faf cursor` |
| Google Gemini | GEMINI.md | `faf gemini` |
| OpenAI Codex | AGENTS.md | `faf agents` |
| Windsurf | WINDSURF.md | `faf bi-sync` |

### Championship Scoring System

**Mk4 Engine Performance:**
- **Scoring Speed:** 0.5ms average (WASM-powered)
- **Test Coverage:** 1,143 tests passing (faf-cli)
- **Format Detection:** 153+ supported project types
- **Accuracy:** 94% stack detection rate

## Step-by-Step Quick Start

### Method 1: CLI Installation (Recommended)

```bash
# Install via npm
npm install -g faf-cli@latest

# Or install via Homebrew
brew install faf-cli

# Verify installation
faf --version  # Should show v6.0.14+
```

### Method 2: MCP Server Setup

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "faf": {
      "command": "npx",
      "args": ["-y", "claude-faf-mcp@latest"],
      "env": {
        "FAF_MCP_SHOW_ADVANCED": "false"
      }
    }
  }
}
```

### Method 3: Direct Usage

```bash
# Initialize new project
cd your-project
faf init

# Auto-detect stack and generate context
faf auto

# Score AI-readiness
faf score  # Target: 85%+ for production

# Sync to platform formats
faf bi-sync  # Creates CLAUDE.md
faf cursor   # Creates .cursorrules
faf gemini   # Creates GEMINI.md
```

## Key Files

- **`.faf`** - YAML format, machine-readable project context
- **`CLAUDE.md`** - Markdown format, human-readable project guide
- **Bi-Sync** - `.faf ↔ CLAUDE.md` kept in sync automatically
- **`project.faf`** - v1.2.0 standard naming

## Common Commands

### faf-cli Commands
```bash
faf init              # Create .faf from project
faf auto              # Auto-detect stack and create .faf
faf score             # Rate AI-readiness (0-100%)
faf formats           # List 153+ supported formats
faf bi-sync           # Sync .faf ↔ CLAUDE.md
faf status            # Check project AI-readiness
faf validate          # Validate .faf structure
faf doctor            # Diagnose and fix issues
faf migrate           # Migrate to latest format
```

## Available Tools & Commands

### Essential Commands

| Command | Purpose | Example Output |
|---------|---------|----------------|
| `faf init` | Create .faf from scratch | Generated project.faf (87% Bronze) |
| `faf auto` | Auto-detect stack | Detected React+TypeScript (92% Gold) |
| `faf score` | Rate AI-readiness | 89% Bronze → Production Ready |
| `faf bi-sync` | Sync to CLAUDE.md | Synced to 3 platform formats |
| `faf formats` | List supported stacks | 153 formats available |
| `faf validate` | Check .faf validity | Valid IANA format ✅ |

### MCP Server Tools (claude-faf-mcp v5.2.0)

**42 professional tools** available through Claude Desktop:

#### Core Workflow (Essential)
```
faf_init     → Initialize new project context
faf_auto     → Auto-detect and generate .faf
faf_score    → Championship scoring (0-100%)
faf_status   → Quick health check
faf_bi_sync  → Multi-platform synchronization
```

#### Quality & Validation
```
faf_validate → IANA format compliance
faf_doctor   → Diagnose and fix issues
faf_audit    → Comprehensive quality check
faf_trust    → Verify integrity
```

#### Intelligence & Discovery
```
faf_formats  → Browse 153+ supported formats
faf_stacks   → Explore stack combinations
faf_chat     → Natural language .faf generation
faf_enhance  → AI-powered improvements
```

#### Advanced Configuration
Enable advanced tools via environment:
```json
"env": {
  "FAF_MCP_SHOW_ADVANCED": "true"
}
```

Unlocks 30+ additional tools for enterprise workflows, file operations, and DNA tracking.

## Championship Scoring System

### Performance Tiers

| Score Range | Tier | Badge | Production Status |
|-------------|------|-------|-------------------|
| **100%** | Trophy | 🏆 | Perfect AI context |
| **99%** | Gold | 🥇 | Exceptional quality |
| **95-98%** | Silver | 🥈 | Top-tier projects |
| **85-94%** | Bronze | 🥉 | Production ready |
| **70-84%** | Green | 🟢 | Solid foundation |
| **55-69%** | Yellow | 🟡 | Needs improvement |
| **1-54%** | Red | 🔴 | Major work needed |
| **0%** | White | 🤍 | No AI context |

### Scoring Methodology

**Mk4 WASM Engine Features:**
- **Speed:** 0.5ms average scoring time
- **Accuracy:** 33-slot validation system
- **Coverage:** Project completeness analysis
- **Intelligence:** Stack-specific recommendations

### Real Performance Examples

```
┌────────────────────────────────┐
│ PROJECT SCORING REPORT       │
├────────────────────────────────┤
│ Next.js E-commerce: 94% 🥉   │
│ Python Django API: 89% 🥉    │
│ Legacy Java App: 67% 🟡     │
│ Fresh React App: 97% 🥈     │
└────────────────────────────────┘
```

## .faf File Architecture

### Standard Structure (33-Slot System)

```yaml
# project.faf - IANA application/vnd.faf+yaml
faf_version: "3.0"

# Project Identity (Required)
project:
  name: modern-web-app
  goal: Real-time collaboration platform
  main_language: typescript

# Human Context (6W Framework)
human_context:
  who: Full-stack development team
  what: React-based collaboration tool
  why: Remote team productivity
  where: AWS cloud infrastructure  
  when: Started Q1 2026
  how: TypeScript, React, Node.js, PostgreSQL

# Technical Stack (Auto-detected)
stack:
  frontend: react-18
  css_framework: tailwind
  backend: express
  database: postgresql
  runtime: node-18
  deployment: aws-ecs
  build: vite
  testing: vitest
  cicd: github-actions

# Dependencies (Key packages only)
dependencies:
  runtime:
    - react: "^18.2.0"
    - express: "^4.18.0"
  development:
    - typescript: "^5.0.0"
    - vite: "^5.0.0"

# Architecture Patterns
architecture:
  pattern: microservices
  api_style: rest
  auth: jwt
  state_management: zustand
```

### Validation Rules

✅ **Must have:** `faf_version`, `project.name`, `project.goal`  
✅ **Performance:** Under 500 lines, valid YAML  
✅ **Security:** No credentials, API keys, or secrets  
✅ **Compatibility:** Works across all AI platforms

## Expert Best Practices

### Development Workflow

1. **Foundation First**
   ```bash
   faf auto          # 94% accurate stack detection
   faf score         # Baseline measurement
   faf bi-sync       # Multi-platform compatibility
   ```

2. **Championship Optimization**
   ```bash
   faf enhance       # AI-powered improvements
   faf validate      # IANA compliance check
   faf audit         # Comprehensive quality review
   ```

3. **Team Integration**
   ```bash
   faf formats       # Explore 153+ supported stacks
   git add project.faf CLAUDE.md .cursorrules
   git commit -m "Add AI context architecture"
   ```

### Performance Targets

| Project Type | Minimum Score | Target Score |
|--------------|---------------|---------------|
| **Production apps** | 85% Bronze | 95% Silver |
| **Open source** | 70% Green | 89% Bronze |
| **Learning projects** | 55% Yellow | 85% Bronze |
| **Enterprise systems** | 89% Bronze | 97% Gold |

### Common Optimization Paths

**From 67% → 89% (22% improvement):**
- Add deployment details (+8%)
- Document architecture patterns (+7%) 
- Include testing strategy (+4%)
- Specify CI/CD pipeline (+3%)

**From 89% → 95% (Gold tier):**
- Advanced dependency mapping (+3%)
- Performance optimization notes (+2%)
- Security implementation details (+1%)

## Ecosystem Integration

### FAF Package Family

| Package | Registry | Downloads | Purpose |
|---------|----------|-----------|----------|
| **faf-cli** | npm | 51,582+ | Universal CLI tooling |
| **claude-faf-mcp** | npm | 7,200+ | Claude Desktop MCP |
| **gemini-faf-mcp** | PyPI | 2,100+ | Google Gemini integration |
| **grok-faf-mcp** | npm | 850+ | xAI Grok platform |
| **rust-faf-mcp** | crates.io | 420+ | Rust-native performance |

### Platform Support Matrix

| AI Platform | Format File | Sync Command | Status |
|-------------|-------------|--------------|--------|
| Claude Desktop | CLAUDE.md | `faf bi-sync` | ✅ Native |
| Cursor IDE | .cursorrules | `faf cursor` | ✅ Full support |
| Google Gemini | GEMINI.md | `faf gemini` | ✅ MCP server |
| OpenAI Codex | AGENTS.md | `faf agents` | ✅ Compatible |
| Windsurf IDE | WINDSURF.md | `faf bi-sync` | ✅ Supported |
| GitHub Copilot | .copilot.md | `faf copilot` | 🔄 In progress |

### Framework Champions

**Gold Tier Performance (🥇 95%+):**
- React 18+ with TypeScript
- Next.js 14+ with App Router  
- Vue 3+ with Composition API
- Svelte 5+ with SvelteKit

**Silver Tier Performance (🥈 89%+):**
- Express.js with TypeScript
- FastAPI with Python 3.10+
- Spring Boot with Java 17+
- Ruby on Rails 7+

## Installation & Configuration

### Quick Setup (60 seconds)

**Step 1: Install CLI**
```bash
# Option A: npm (recommended)
npm install -g faf-cli@latest

# Option B: Homebrew (macOS/Linux)
brew install faf-cli

# Verify installation
faf --version  # v6.0.14+
```

**Step 2: Configure MCP Server**
```bash
# Automatic configuration
faf setup claude

# Manual configuration (advanced)
# Edit: ~/Library/Application Support/Claude/claude_desktop_config.json
```

**Step 3: Initialize Project**
```bash
cd your-project
faf auto              # Auto-detect and generate
faf score             # Should show 85%+ for modern projects
```

### Enterprise Configuration

**Multi-AI Platform Setup:**
```bash
# Configure all platforms at once
faf setup --all

# Or individually
faf setup claude      # Claude Desktop
faf setup cursor      # Cursor IDE  
faf setup gemini      # Google Gemini
faf setup windsurf    # Windsurf IDE
```

**Advanced MCP Configuration:**
```json
{
  "mcpServers": {
    "faf": {
      "command": "npx",
      "args": ["-y", "claude-faf-mcp@latest"],
      "env": {
        "FAF_MCP_SHOW_ADVANCED": "true",
        "FAF_AUTO_SYNC": "true",
        "FAF_SCORING_ENGINE": "mk4"
      }
    }
  }
}
```

## v2.8.0 Tool Visibility System

**Problem Solved:** Reduced cognitive load from 51 tools to 21 core tools.

**How It Works:**
- **Default:** Shows 21 essential tools
- **Opt-in:** Enable all 51 tools via environment variable
- **Smart Filtering:** Tools categorized by purpose
- **Backward Compatible:** Existing setups continue working

**Categories:**
- `workflow` - Essential commands
- `quality` - Scoring and validation
- `intelligence` - Format/stack detection
- `sync` - Context synchronization
- `ai` - AI enhancement features
- `help` - Documentation
- `trust` - Trust validation
- `file` - File operations
- `utility` - Misc tools

**Configuration Priority:**
1. Environment variable (`FAF_MCP_SHOW_ADVANCED`)
2. Config file (`~/.fafrc`)
3. Default (core only)

## Philosophy

**The Noodle Philosophy 🍜**
- YAML noodles for AI (machine-readable)
- Converts to markdown/TXT for humans (human-readable)
- Interconnected context, not flat data

**Format-First**
- The format is the foundation
- Without .faf, there is no universal context
- Format-driven architecture

**Official Stewardship**
- Anthropic-approved MCP server (PR #2759 MERGED)
- Account Managers for all things .FAF in Anthropic ecosystem
- Governance responsibility for format specification

## Brand Values

- **NO BS ZONE** - Only real stats, verified claims
- **Championship Standards** - <50ms performance, 1,000+ tests
- **Free Forever** - MIT license, open source
- **Trust is Everything** - Built on credibility
- **Professional, Boring, Trusted** - F1-grade engineering

## Performance Metrics & Verification

### Real-World Performance (Verified)

```
┌────────────────────────────────────────┐
│ FAF ECOSYSTEM METRICS (April 2026)     │
├────────────────────────────────────────┤
│ Total Downloads: 62,150+ (All platforms) │
│ Active Projects: 8,400+ (Using .faf)    │
│ Test Coverage: 1,494 tests passing     │
│ Format Support: 153+ project types     │
│ Scoring Speed: 0.5ms average          │
│ Platform Support: 6 AI tools          │
└────────────────────────────────────────┘
```

### Official Recognition

✅ **IANA Media Type:** `application/vnd.faf+yaml`  
✅ **Anthropic MCP:** Official steward (Registry #2759)  
✅ **IETF Internet-Draft:** Filed (draft-wolfe-faf-format)  
✅ **Zenodo/CERN:** Published (#18251362)  
✅ **WJTTC Gold:** F1-inspired testing certification  

### Quality Assurance

| Component | Test Coverage | Performance |
|-----------|---------------|-------------|
| faf-cli | 1,143 tests | <50ms commands |
| claude-faf-mcp | 351 tests | 0.5ms scoring |
| Format detection | 153 formats | 94% accuracy |
| IANA compliance | 100% valid | YAML spec |

### Download Distribution

```
npm (faf-cli):          51,582 downloads
npm (claude-faf-mcp):    7,200 downloads  
PyPI (gemini-faf-mcp):   2,100 downloads
npm (grok-faf-mcp):        850 downloads
crates.io (rust-faf):      418 downloads
─────────────────────────────────────
Total Ecosystem:        62,150+ downloads
```

## Version History

- **v5.0.6** - faf-cli latest (1,143 tests, Bun-optimized)
- **v5.1.0** - claude-faf-mcp latest (33 tools, 351 tests)
- **v1.2.0** - faf-mcp universal

## Resources & Documentation

### Essential Links

| Resource | URL | Purpose |
|----------|-----|----------|
| **Official Website** | https://faf.one | Documentation hub |
| **CLI Package** | https://npmjs.com/package/faf-cli | npm installation |
| **MCP Server** | https://npmjs.com/package/claude-faf-mcp | Claude Desktop |
| **GitHub Repository** | https://github.com/Wolfe-Jam/faf-cli | Source code |
| **Homebrew Formula** | `brew install faf-cli` | macOS/Linux |
| **Chrome Extension** | Chrome Web Store | Browser integration |
| **Community Discord** | https://discord.gg/faf | Support & discussion |

### API Documentation

```
FAF API Reference:
├── CLI Commands       → https://faf.one/docs/cli
├── MCP Tools         → https://faf.one/docs/mcp  
├── File Format       → https://faf.one/docs/format
├── Scoring System    → https://faf.one/docs/scoring
└── Integration Guide → https://faf.one/docs/platforms
```

## Testing Standards

**WJTTC (WolfeJam Technical & Testing Center)**
- F1-Inspired testing methodology
- 3 Tiers: Brake Systems, Engine Systems, Aerodynamics
- Philosophy: "We break things so others never have to know they were broken"
- All tests reported and documented
- Gold certification for production releases

## Troubleshooting & Support

### Common Issues & Solutions

#### MCP Server Not Responding
```bash
# Diagnostic sequence
faf doctor            # Run health check
faf setup claude      # Reconfigure MCP

# Check logs
tail -f ~/Library/Logs/Claude/mcp-server-claude-faf-mcp.log

# Verify tool count
# Default: 21 core tools
# Advanced: 42 total tools
```

#### Low AI-Readiness Scores
```bash
# Get specific recommendations
faf audit             # Detailed quality analysis
faf enhance           # AI-powered improvements
faf validate          # IANA compliance check

# Common score boosters:
# + Add human_context section (+15%)
# + Specify deployment details (+10%)
# + Include testing strategy (+8%)
# + Document architecture patterns (+5%)
```

#### Format Detection Issues
```bash
# Manual stack specification
faf init --stack typescript-nextjs
faf init --stack python-fastapi
faf init --stack rust-actix

# Browse supported formats
faf formats           # List 153+ available
faf formats --search react  # Filter by keyword
```

### Performance Optimization

| Issue | Solution | Expected Improvement |
|-------|----------|---------------------|
| Slow scoring | Update to Mk4 engine | 10x faster (0.5ms) |
| Large .faf files | Use `faf compress` | 60% size reduction |
| Sync conflicts | Enable auto-sync | Real-time updates |
| Missing tools | Set ADVANCED=true | 21 → 42 tools |

## Advanced Usage

### Custom Config File
Create `~/.fafrc`:
```json
{
  "showAdvanced": true
}
```

Or key=value format:
```
FAF_SHOW_ADVANCED=true
```

### Local Development
```bash
# Use local build
{
  "mcpServers": {
    "faf": {
      "command": "node",
      "args": ["/path/to/claude-faf-mcp/dist/src/index.js"],
      "env": {
        "FAF_MCP_SHOW_ADVANCED": "false"
      }
    }
  }
}
```

## Advanced Use Cases

### Enterprise Integration

**Multi-Repository Management:**
```bash
# Batch process multiple projects
faf batch-init ~/projects/*
faf batch-score ~/projects/* --min-score 85
faf batch-sync ~/projects/* --format claude,cursor,gemini
```

**CI/CD Pipeline Integration:**
```yaml
# .github/workflows/faf-quality.yml
name: FAF Quality Check
on: [push, pull_request]
jobs:
  faf-quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install -g faf-cli
      - run: faf validate
      - run: faf score --min-score 85
```

**Team Standardization:**
```bash
# Organization-wide .faf template
faf template create --org mycompany
faf template apply --template mycompany-standard
```

### Developer Workflow Integration

**IDE Extensions:**
- Visual Studio Code: FAF syntax highlighting
- JetBrains IDEs: Smart completion for .faf files  
- Vim/Neovim: FAF filetype detection and validation

**Git Hooks:**
```bash
# Pre-commit hook for .faf validation
#!/bin/sh
faf validate || exit 1
faf score --min-score 70 || exit 1
```

## Skill Management

### Installation Methods

**Method 1: Smithery.ai (Recommended)**
```bash
npx @smithery/cli skill install wolfe-jam/faf-expert
```

**Method 2: Manual Installation**
```bash
mkdir -p ~/.claude/skills/faf-expert
curl -o ~/.claude/skills/faf-expert/SKILL.md \
  https://raw.githubusercontent.com/Wolfe-Jam/claude-skills/main/faf-expert/SKILL.md
```

**Method 3: Git Clone**
```bash
cd ~/.claude/skills
git clone https://github.com/Wolfe-Jam/claude-skills.git
ln -s claude-skills/faf-expert ./faf-expert
```

### Skill Control

```bash
# Temporarily disable
mv ~/.claude/skills/faf-expert{,.disabled}

# Re-enable  
mv ~/.claude/skills/faf-expert{.disabled,}

# Remove completely
rm -rf ~/.claude/skills/faf-expert
```

---

## Credits & Licensing

**Created by:** wolfejam.dev (Official Anthropic MCP Steward)  
**Version:** 6.0.14 (Skills Edition)  
**License:** MIT License  
**Format Standard:** IANA application/vnd.faf+yaml  
**Last Updated:** April 2026

**Built with F1-inspired engineering principles** 🏎️

*Professional. Trusted. Championship-grade.*
