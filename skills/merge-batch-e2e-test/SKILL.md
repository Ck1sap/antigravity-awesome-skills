---
name: merge-batch-e2e-test
description: "Synthetic skill used to exercise the maintainer merge workflow end-to-end."
risk: safe
source_repo: fake-owner/fake-repo
source_type: community
date_added: "2026-04-05"
---

# Merge Batch E2E Test

## Overview

This temporary skill exists only to test the maintainer merge workflow against a deliberately broken pull request.

## Instructions

1. Confirm the maintainer workflow detects broken metadata and CI failures.
2. Repair the skill and let the PR proceed to merge.
