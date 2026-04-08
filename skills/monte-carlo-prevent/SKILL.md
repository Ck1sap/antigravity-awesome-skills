---
name: monte-carlo-prevent
description: "Surfaces Monte Carlo data observability context (table health, alerts, lineage, blast radius) before SQL/dbt edits."
category: data
risk: safe
source: community
source_repo: monte-carlo-data/mc-agent-toolkit
source_type: community
date_added: "2026-04-08"
author: monte-carlo-data
tags: [data-observability, dbt, schema, monte-carlo, lineage]
tools: [claude, cursor, codex]
---

# Monte Carlo Prevent

## Overview

Brings Monte Carlo's data observability context directly into your editor. When modifying a dbt model or SQL pipeline, this skill surfaces table health, lineage, active alerts, and blast radius before any code is written. It also generates monitors-as-code YAML and targeted SQL validation queries after changes are made.

Adapted from [monte-carlo-data/mc-agent-toolkit](https://github.com/monte-carlo-data/mc-agent-toolkit) (`skills/prevent`). Requires the [Monte Carlo MCP Server](https://docs.getmontecarlo.com/docs/mcp-server).

## When to Use This Skill

- Use when opening or editing a `.sql` file or dbt model
- Use when a table name, dataset, or dbt model name is mentioned
- Use when planning a schema change (new column, join update, filter change, refactor)
- Use when investigating data quality, freshness, row counts, or anomalies
- Use when triaging or responding to a data quality alert

## How It Works

### Step 1: Table Health Check

When a dbt model or table is referenced, automatically surface health, lineage, alerts, and risk signals using Monte Carlo MCP tools (`getTable`, `getAssetLineage`, `getAlerts`, `getMonitors`).

### Step 2: Change Impact Assessment (Required Before Edits)

Before editing any SQL, run the change impact assessment:

1. Fetch downstream dependencies via `getAssetLineage`
2. Check active incidents via `getAlerts`
3. Review monitor coverage via `getMonitors`
4. Review recent query exposure via `getQueriesForTable`
5. Produce a risk-tiered report (High/Medium/Low) connecting findings to the specific change

If risk is High or Medium, ask the engineer for confirmation before proceeding with any edits.

### Step 3: Monitor Generation

After new transformation logic is added, generate monitors-as-code YAML using `createValidationMonitorMac`, `createMetricMonitorMac`, `createComparisonMonitorMac`, or `createCustomSqlMonitorMac`.

### Step 4: Change Validation

After edits are complete, generate 3-5 targeted SQL queries to verify the change behaved as intended.

## Examples

### Example 1: Opening a dbt Model

When a user opens `models/staging/stg_orders.sql`, automatically run the table health check and present lineage, alerts, and monitor coverage as context before the engineer starts working.

### Example 2: Adding a Column

When a user says "add a `discount_amount` column to `stg_orders`", run the change impact assessment first. If 34 downstream models depend on this table, present the blast radius and ask for confirmation before writing any SQL.

## Best Practices

- Always run the change impact assessment before editing SQL
- Present results as context the engineer needs, not as a response to a question
- Do not activate for seed files, analysis files, or configuration files
- For macros and snapshots, identify affected models and assess those instead
- End every synthesis with one clear recommendation in plain English

## Security & Safety Notes

- This skill is read-only with respect to data infrastructure; it does not modify tables or pipelines
- Monitor creation tools run in dry-run mode and return YAML; they do not directly create monitors
- Requires a configured Monte Carlo MCP Server with valid API credentials

## Common Pitfalls

- **Problem:** Skipping the impact assessment before editing SQL
  **Solution:** Always run the change impact assessment first, even for seemingly small changes. Parameter changes (thresholds, date constants) silently change model output.

- **Problem:** Running the assessment once per session and assuming it covers all edits
  **Solution:** Each distinct change requires its own assessment connecting MC findings to that specific change.
