---
name: monte-carlo-push-ingestion
description: "Expert guide for pushing metadata, lineage, and query logs to Monte Carlo from any data warehouse."
category: data
risk: safe
source: community
source_repo: monte-carlo-data/mc-agent-toolkit
source_type: community
date_added: "2026-04-08"
author: monte-carlo-data
tags: [data-observability, ingestion, monte-carlo, pycarlo, metadata]
tools: [claude, cursor, codex]
---

# Monte Carlo Push Ingestion

## Overview

Helps engineers collect metadata, lineage, and query logs from their data warehouses and push that data to Monte Carlo via the push ingestion API. The push model works with any data source and fills gaps the pull model cannot always cover -- integrations that don't expose query history, custom lineage between non-warehouse assets, or customers who already have this data and want to send it directly.

Adapted from [monte-carlo-data/mc-agent-toolkit](https://github.com/monte-carlo-data/mc-agent-toolkit) (`skills/push-ingestion`).

## When to Use This Skill

- Use when pushing data to Monte Carlo or using the IngestionService/pycarlo push APIs
- Use when building a metadata, lineage, or query log collection script
- Use when creating custom lineage nodes or edges
- Use when debugging why pushed data is not showing up
- Use when generating code that collects metadata from any data warehouse and sends it to Monte Carlo

## How It Works

### Step 1: Generate Collection Scripts

Provide your warehouse type and Monte Carlo resource UUID. The skill generates a Python script using the pycarlo SDK that connects to your warehouse, discovers tables, extracts metadata (names, types, row counts, freshness), and pushes to Monte Carlo.

Templates are available for Snowflake, BigQuery, BigQuery Iceberg, Databricks, Redshift, and Hive. For other platforms, the skill derives appropriate collection queries from that warehouse's system catalog.

### Step 2: Push Data

The generated script uses the pycarlo SDK to push data via three endpoints:

| Flow | Method | Endpoint |
|------|--------|----------|
| Table metadata | `send_metadata()` | `/ingest/v1/metadata` |
| Table/column lineage | `send_lineage()` | `/ingest/v1/lineage` |
| Query logs | `send_query_logs()` | `/ingest/v1/querylogs` |

Every push returns an `invocation_id` for tracing through downstream systems.

### Step 3: Validate

After pushing, verify data is visible in Monte Carlo using GraphQL API queries. Timing expectations: metadata appears within minutes, table lineage within seconds to minutes, query logs take 15-20 minutes.

## Examples

### Example 1: Metadata Collection

User: "Build me a metadata collection script for Snowflake. My MC resource UUID is `abc-123`."

The skill generates a ready-to-run Python script that connects to Snowflake, discovers all databases/schemas/tables, extracts schema and volume information, and pushes to Monte Carlo.

### Example 2: Custom Lineage

User: "I need to create a lineage edge between my Airflow DAG and a Snowflake table."

The skill generates GraphQL mutations using `createOrUpdateLineageNode` and `createOrUpdateLineageEdge`, with `expireAt: "9999-12-31"` for permanent nodes.

## Best Practices

- Always save the `invocation_id` returned by push calls for debugging
- Push at most once per hour; sub-hourly pushes produce unpredictable anomaly detector behavior
- Batch large payloads into groups of 50 assets per push call (10-second SDK timeout)
- Use the correct key type: Ingestion scope key for pushing, GraphQL API key for verification
- Set `expireAt: "9999-12-31"` for permanent custom lineage nodes (default is 7 days)

## Security & Safety Notes

- Generated scripts require Monte Carlo API credentials stored in environment variables
- Scripts connect to your data warehouse in read-only mode to collect metadata
- No data warehouse modifications are made; only metadata is pushed to Monte Carlo

## Common Pitfalls

- **Problem:** Using `resource_type` for query logs instead of `log_type`
  **Solution:** Query logs are the only endpoint where the field name differs. Use `log_type`, not `resource_type`.

- **Problem:** Custom lineage nodes disappearing after 7 days
  **Solution:** Set `expireAt: "9999-12-31"` on custom lineage nodes. The default TTL is 7 days.

- **Problem:** Query logs not appearing after push
  **Solution:** Query log processing takes at least 15-20 minutes. This is expected, not a bug.
