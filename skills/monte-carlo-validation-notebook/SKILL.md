---
name: monte-carlo-validation-notebook
description: "Generates SQL validation notebooks for dbt PR changes with before/after comparison queries."
category: data
risk: safe
source: community
source_repo: monte-carlo-data/mc-agent-toolkit
source_type: community
date_added: "2026-04-08"
author: monte-carlo-data
tags: [data-observability, validation, dbt, monte-carlo, sql-notebook]
tools: [claude, cursor, codex]
---

# Monte Carlo Validation Notebook

## Overview

Generates SQL validation notebooks for dbt changes. Given a GitHub PR URL or local dbt repo path, it parses changed models, infers schemas, and produces a notebook with targeted validation queries that opens directly in Monte Carlo's SQL Notebook interface.

Adapted from [monte-carlo-data/mc-agent-toolkit](https://github.com/monte-carlo-data/mc-agent-toolkit) (`skills/generate-validation-notebook`).

## When to Use This Skill

- Use when validating dbt model changes before or after merging a PR
- Use when you want before/after comparison queries for modified models
- Use when reviewing a dbt PR and want to check data impact
- Use when working locally on dbt changes and want validation queries

## How It Works

### Step 1: Get Changed Files

**PR mode:** Fetches changed files, diffs, and file contents from a GitHub PR using the `gh` CLI.

**Local mode:** Uses `git diff` to identify changed SQL files compared to the base branch.

Filters to `.sql` files under `models/` or `snapshots/` directories. Caps at 10 models per run.

### Step 2: Parse Changed Models

For each changed model, extracts:
- Output table name and schema (via `dbt_project.yml` resolution)
- Materialization config, unique keys, and clustering fields
- Core segmentation fields and time axis
- Diff analysis: changed fields, filters, joins, new columns

### Step 3: Generate Validation Queries

Generates targeted SQL queries based on what changed:

| Query Pattern | Trigger |
|--------------|---------|
| Row count | Always |
| Sample data preview | Always |
| Core segmentation counts | Always |
| Changed field distribution | Column modified in diff |
| Uniqueness check | JOIN/unique_key changed, or new model |
| NULL rate check | New column added, or COALESCE changes |
| Time-axis continuity | Incremental model or time field present |
| Before/after comparison | Modified models (compares prod vs dev) |

### Step 4: Build and Open Notebook

Assembles queries into a YAML notebook with database parameters (`prod_db`, `dev_db`), encodes it into a base64 import URL, and opens it in the Monte Carlo SQL Notebook interface.

## Examples

### Example 1: PR Validation

```
/generate-validation-notebook https://github.com/acme/dbt/pull/42
```

Fetches the PR, identifies 3 changed models, generates 15 validation queries, and opens the notebook in the browser.

### Example 2: Local Validation

```
/generate-validation-notebook ./my-dbt-project
```

Diffs against the base branch, identifies changed models, and generates a validation notebook for local changes.

## Best Practices

- Run before merging a PR to verify changes won't break downstream consumers
- Set `dev_db` to your personal dev database and `prod_db` to production
- Review comparison queries (prod vs dev) to spot unexpected row count or distribution changes
- For PRs with more than 10 changed models, use `--models` to select the most critical ones

## Security & Safety Notes

- This skill generates SQL queries for review only; it does not execute them
- Requires `gh` CLI authenticated for PR mode
- Requires `python3` and `pyyaml` for helper scripts

## Common Pitfalls

- **Problem:** Schema resolution fails
  **Solution:** Ensure `dbt_project.yml` is accessible. The skill uses a helper script to resolve schemas; do not manually parse `dbt_project.yml`.

- **Problem:** Using `${prod_db}` instead of `{{prod_db}}` in queries
  **Solution:** Always use double curly braces for notebook parameter placeholders.
