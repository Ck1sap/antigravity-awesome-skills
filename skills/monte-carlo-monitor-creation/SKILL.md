---
name: monte-carlo-monitor-creation
description: "Guides creation of Monte Carlo monitors via MCP tools, producing monitors-as-code YAML for CI/CD deployment."
category: data
risk: safe
source: community
source_repo: monte-carlo-data/mc-agent-toolkit
source_type: community
date_added: "2026-04-08"
author: monte-carlo-data
tags: [data-observability, monitoring, monte-carlo, monitors-as-code]
tools: [claude, cursor, codex]
---

# Monte Carlo Monitor Creation

## Overview

Guides AI agents through creating Monte Carlo monitors via MCP tools. All creation tools run in dry-run mode and return monitors-as-code (MaC) YAML that can be applied via the Monte Carlo CLI or CI/CD. No monitors are created directly.

Adapted from [monte-carlo-data/mc-agent-toolkit](https://github.com/monte-carlo-data/mc-agent-toolkit) (`skills/monitor-creation`). Requires the [Monte Carlo MCP Server](https://docs.getmontecarlo.com/docs/mcp-server).

## When to Use This Skill

- Use when asked to create, add, or set up a monitor for a table, field, or metric
- Use when a user wants to check data quality rules or enforce data contracts
- Use when asking about monitoring options for a table or dataset
- Use when generating monitors-as-code YAML

## How It Works

### Step 1: Understand the Request

Determine what the user wants to monitor and which monitor type fits:

| Type | Use When |
|------|----------|
| **Metric** | Track statistical metrics on fields (null rates, unique counts, numeric stats) |
| **Validation** | Row-level data quality checks with conditions |
| **Custom SQL** | Arbitrary SQL returning a single number with threshold alerts |
| **Comparison** | Compare metrics between two tables (e.g. dev vs prod) |
| **Table** | Monitor groups of tables for freshness, schema changes, and volume |

### Step 2: Identify Tables and Columns

Use `search` and `getTable` MCP tools to find the target table, verify column names, and check domain membership. Never guess column names.

### Step 3: Confirm and Generate

Present the monitor configuration in plain language, get user confirmation, then call the appropriate creation tool. Present the resulting YAML in a code block with instructions to save and apply via `montecarlo monitors apply`.

## Examples

### Example 1: Freshness Monitor

User: "Add a freshness monitor for the orders table"

The skill searches for the table, identifies timestamp columns, confirms schedule preferences, and generates MaC YAML for a metric monitor tracking freshness.

### Example 2: Validation Rule

User: "Make sure status is always one of active, inactive, or pending"

The skill generates a validation monitor that flags rows where the status column contains unexpected values.

## Best Practices

- Always verify column names from `getTable` before calling creation tools
- Always check the table's domain membership before creating monitors
- Always confirm the configuration with the user before generating YAML
- Present the full YAML in a copyable code block

## Security & Safety Notes

- All creation tools run in dry-run mode and return YAML only
- No monitors are created directly; the user applies YAML via CLI or CI/CD
- Requires a configured Monte Carlo MCP Server with valid API credentials

## Common Pitfalls

- **Problem:** Guessing column names instead of fetching them from `getTable`
  **Solution:** Always call `getTable` with `include_fields: true` and use the actual column names returned.

- **Problem:** Adding a `schedule` field to table monitor YAML
  **Solution:** Table monitors do not support the `schedule` field in MaC YAML. Table monitor scheduling is managed automatically by Monte Carlo.
